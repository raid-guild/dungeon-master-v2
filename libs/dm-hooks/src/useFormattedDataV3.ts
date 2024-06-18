/* eslint-disable no-param-reassign */
import { IMember, IVaultTransactionV2 } from '@raidguild/dm-types';
import {
  DAY_MILLISECONDS,
  formatUnitsAsNumber,
  GNOSIS_SAFE_ADDRESS,
  REGEX_ETH_ADDRESS,
} from '@raidguild/dm-utils';
import { InfiniteData } from '@tanstack/react-query';
import _ from 'lodash';
import { useCallback, useMemo } from 'react';

import useAccountingV3 from './useAccountingV3';

class CalculateTokenBalances {
  calculatedTokenBalances: Record<
    string,
    { inflow: bigint; outflow: bigint; balance: bigint }
  > = {};

  private initTokenBalance(tokenAddress: string) {
    if (!(tokenAddress in this.calculatedTokenBalances)) {
      this.calculatedTokenBalances[tokenAddress] = {
        inflow: BigInt(0),
        outflow: BigInt(0),
        balance: BigInt(0),
      };
    }
  }

  incrementInflow(tokenAddress: string, inValue: bigint) {
    this.initTokenBalance(tokenAddress);
    const tokenStats = this.calculatedTokenBalances[tokenAddress];
    tokenStats.inflow += inValue;
    tokenStats.balance += inValue;
  }

  incrementOutflow(tokenAddress: string, outValue: bigint) {
    this.initTokenBalance(tokenAddress);
    const tokenStats = this.calculatedTokenBalances[tokenAddress];
    tokenStats.outflow += outValue;
    tokenStats.balance -= outValue;
  }

  getBalance(tokenAddress: string) {
    this.initTokenBalance(tokenAddress);
    return this.calculatedTokenBalances[tokenAddress].balance;
  }

  getBalances() {
    return this.calculatedTokenBalances;
  }
}

function calculateTokenFlows(transactions: IVaultTransactionV2[]) {
  const tokenBalances = new CalculateTokenBalances();

  _.sortBy(transactions, 'executionDate').forEach((transaction) => {
    _.forEach(transaction?.transfers, (transfer) => {
      const tokenAddress =
        transfer.type === 'ETHER_TRANSFER'
          ? 'ETH'
          : transfer.tokenInfo?.address || '';
      const amount = BigInt(transfer.value || 0);

      if (transfer.to === GNOSIS_SAFE_ADDRESS) {
        tokenBalances.incrementInflow(tokenAddress, amount);
      } else if (transfer.from === GNOSIS_SAFE_ADDRESS) {
        tokenBalances.incrementOutflow(tokenAddress, amount);
      }
    });
  });

  return tokenBalances.getBalances();
}

const useFormattedDataV3 = (memberData: InfiniteData<IMember[][]>) => {
  const { data: dataFromMolochV3 } = useAccountingV3();
  const balances = dataFromMolochV3?.tokens?.tokenBalances || [];
  const transactions = dataFromMolochV3?.transactions || [];
  const proposalsInfo = dataFromMolochV3?.proposalsInfo || {};
  const rageQuits = dataFromMolochV3?.rageQuits || [];

  const flows = useMemo(
    () => calculateTokenFlows(transactions),
    [transactions]
  );

  const members = useMemo(() => {
    const memberArray = _.flatten(
      _.get(memberData, 'pages')
    ) as unknown as IMember[];
    return _.keyBy(memberArray, (m: IMember) => m.ethAddress?.toLowerCase());
  }, [memberData]);

  const withPrices = useCallback(
    (items: any[]) =>
      _.map(items, (t) => {
        if (!t) return t;
        const tokenSymbol = _.lowerCase(t.token?.symbol);
        const balance = {
          inflow: {
            tokenValue: formatUnitsAsNumber(
              _.get(flows, [t.tokenAddress, 'inflow'], BigInt(0)),
              _.get(t, ['token', 'decimals'])
            ),
          },
          outflow: {
            tokenValue: formatUnitsAsNumber(
              _.get(flows, [t.tokenAddress, 'outflow'], BigInt(0)),
              _.get(t, ['token', 'decimals'])
            ),
          },
          closing: {
            tokenValue: formatUnitsAsNumber(
              _.get(flows, [t.tokenAddress, 'balance'], BigInt(0)),
              _.get(t, ['token', 'decimals'])
            ),
          },
        };

        const priceConversion = _.includes(tokenSymbol, 'xdai') ? 1 : undefined;

        return {
          ...t,
          ...balance,
          tokenSymbol,
          priceConversion,
          date: new Date(),
          tokenExplorerLink: `https://blockscout.com/xdai/mainnet/address/${t.tokenAddress}`,
        };
      }),
    [flows]
  );

  const balancesWithPrices = useMemo(
    () => withPrices(balances),
    [balances, withPrices]
  );

  const transactionsWithPrices = useMemo(() => {
    const tokenBalances = new CalculateTokenBalances();
    const rageQuitsMap = _.keyBy(rageQuits, 'txHash');

    return _.chain(withPrices(transactions))
      .sortBy('executionDate')
      .flatMap((t) =>
        _.map(t.transfers, (transfer) => {
          const tokenSymbol =
            transfer.type === 'ETHER_TRANSFER'
              ? 'XDAI'
              : _.get(transfer, 'tokenInfo.symbol', '');
          const tokenDecimals =
            transfer.type === 'ETHER_TRANSFER'
              ? 18
              : _.get(transfer, 'tokenInfo.decimals', 0);
          const tokenAddress =
            transfer.type === 'ETHER_TRANSFER'
              ? 'XDAI'
              : _.get(transfer, 'tokenAddress', '');

          const inAmount =
            transfer.to === GNOSIS_SAFE_ADDRESS && transfer.value !== null
              ? BigInt(transfer.value)
              : BigInt(0);
          const outAmount =
            transfer.from === GNOSIS_SAFE_ADDRESS && transfer.value !== null
              ? BigInt(transfer.value)
              : BigInt(0);

          tokenBalances.incrementInflow(tokenAddress, inAmount);
          tokenBalances.incrementOutflow(tokenAddress, outAmount);

          const txExplorerLink = `https://blockscout.com/xdai/mainnet/tx/${t.txHash}`;
          const txHash = _.get(t, 'transactionHash', t.txHash);
          const proposal = proposalsInfo[txHash];
          const proposalLink = proposal
            ? `https://admin.daohaus.club/#/molochV3/0x64/${_.replace(
                proposal.id,
                /-/g,
                '/'
              )}`
            : '';
          let txType;
          if (proposal) {
            txType = 'proposal';
          } else if (transfer.to === GNOSIS_SAFE_ADDRESS) {
            txType = 'spoils';
          } else {
            txType = 'ragequit';
          }

          const net = formatUnitsAsNumber(inAmount - outAmount, tokenDecimals);

          const elapsedDays =
            net > 0
              ? Math.floor(
                  (Date.now() - new Date(t.executionDate).getTime()) /
                    DAY_MILLISECONDS
                )
              : undefined;

          const proposalShares =
            transfer.from === GNOSIS_SAFE_ADDRESS
              ? _.get(rageQuitsMap, [t.txHash, 'shares'], undefined)
              : undefined;

          return {
            elapsedDays,
            date: new Date(t.executionDate),
            balance: formatUnitsAsNumber(
              tokenBalances.getBalance(tokenAddress),
              tokenDecimals
            ),
            counterparty: transfer.to,
            in: formatUnitsAsNumber(inAmount, tokenDecimals),
            out: formatUnitsAsNumber(outAmount, tokenDecimals),
            net,
            proposalApplicant: _.get(proposal, 'createdBy', ''),
            proposalId: _.get(proposal, 'id'),
            txExplorerLink,
            proposalLink,
            proposalTitle: _.get(proposal, 'title'),
            proposalShares,
            proposalLoot: undefined,
            tokenAddress,
            tokenDecimals,
            tokenSymbol,
            type: txType,
          };
        })
      )
      .reverse()
      .value();
  }, [transactions, withPrices, proposalsInfo]);

  const transactionsWithPricesAndMembers = useMemo(
    () =>
      _.map(transactionsWithPrices, (t) => {
        const ethAddress = _.get(t, 'counterparty').toLowerCase();
        const member = _.get(members, ethAddress);
        const memberLink = _.get(member, 'ethAddress')?.match(REGEX_ETH_ADDRESS)
          ? `/members/${ethAddress}`
          : undefined;

        return {
          ...t,
          memberLink,
          memberEnsName: _.get(member, 'ensName'),
          memberName: _.get(member, 'name'),
        };
      }),
    [transactionsWithPrices, members]
  );

  return {
    balancesWithPrices,
    transactionsWithPrices,
    transactionsWithPricesAndMembers,
  };
};

export default useFormattedDataV3;
