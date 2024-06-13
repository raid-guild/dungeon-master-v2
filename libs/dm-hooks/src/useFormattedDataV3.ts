/* eslint-disable no-param-reassign */
import {
  IMappedTokenPrice,
  IMember,
  ITokenBalanceLineItem,
  IVaultTransaction,
} from '@raidguild/dm-types';
import {
  formatDate,
  formatUnitsAsNumber,
  GUILD_GNOSIS_DAO_ADDRESS,
  REGEX_ETH_ADDRESS,
} from '@raidguild/dm-utils';
import { InfiniteData } from '@tanstack/react-query';
import _ from 'lodash';
import { useCallback, useMemo } from 'react';

class CalculateTokenBalances {
  calculatedTokenBalances: Record<
    string,
    { inflow: bigint; outflow: bigint; balance: bigint }
  >;

  constructor() {
    this.calculatedTokenBalances = {};
  }

  getBalance(tokenAddress: string) {
    this.initTokenBalance(tokenAddress);
    return this.calculatedTokenBalances[tokenAddress].balance;
  }

  initTokenBalance(tokenAddress: string) {
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
    this.calculatedTokenBalances[tokenAddress] = {
      ...tokenStats,
      inflow: tokenStats.inflow + inValue,
      balance: tokenStats.balance + inValue,
    };
  }

  incrementOutflow(tokenAddress: string, outValue: bigint) {
    this.initTokenBalance(tokenAddress);
    const tokenStats = this.calculatedTokenBalances[tokenAddress];
    this.calculatedTokenBalances[tokenAddress] = {
      ...tokenStats,
      outflow: tokenStats.outflow + outValue,
      balance: tokenStats.balance - outValue,
    };
  }

  getBalances() {
    return this.calculatedTokenBalances;
  }
}

function calculateTokenFlows(transactions) {
  const tokenBalances = new CalculateTokenBalances();

  // Sort transactions by executionDate in ascending order
  const sortedTransactions = transactions.sort((a, b) =>
    a.executionDate.localeCompare(b.executionDate)
  );

  sortedTransactions.forEach((transaction) => {
    const safeAddress = '0x181eBDB03cb4b54F4020622F1B0EAcd67A8C63aC';

    transaction.transfers.forEach((transfer) => {
      const tokenAddress =
        transfer.type === 'ETHER_TRANSFER'
          ? 'ETH'
          : transfer.tokenInfo?.address;
      const amount = BigInt(transfer.value || 0);

      if (transfer.to === safeAddress) {
        tokenBalances.incrementInflow(tokenAddress, amount);
      } else if (transfer.from === safeAddress) {
        tokenBalances.incrementOutflow(tokenAddress, amount);
      }
    });
  });

  return tokenBalances.getBalances();
}

const useFormattedDataV3 = ({
  balances,
  transactions,
  tokenPrices,
  memberData,
  proposalsInfo,
}: {
  balances: ITokenBalanceLineItem[];
  transactions: IVaultTransaction[];
  tokenPrices: IMappedTokenPrice;
  memberData: InfiniteData<IMember[][]>;
  proposalsInfo: any;
}) => {
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
  console.log('members', members);

  const withPrices = useCallback(
    (items: any[]) =>
      (items || []).map((t) => {
        if (!t) return t;
        const formattedDate = formatDate(t.date);
        const tokenSymbol = t.tokenSymbol?.toLowerCase();
        const balance = {
          inflow: {
            tokenValue: formatUnitsAsNumber(
              flows[t.tokenAddress]?.inflow || BigInt(0),
              t.token?.decimals
            ),
          },
          outflow: {
            tokenValue: formatUnitsAsNumber(
              flows[t.tokenAddress]?.outflow || BigInt(0),
              t.token?.decimals
            ),
          },
          closing: {
            tokenValue: formatUnitsAsNumber(
              flows[t.tokenAddress]?.balance || BigInt(0),
              t.token?.decimals
            ),
          },
        };
        if (
          tokenPrices[tokenSymbol] &&
          tokenPrices[tokenSymbol][formattedDate]
        ) {
          return {
            ...t,
            ...balance,
            priceConversion: tokenPrices[tokenSymbol][formattedDate],
          };
        }
        if (tokenSymbol?.includes('xdai')) {
          return {
            ...t,
            ...balance,
            priceConversion: 1,
          };
        }
        return {
          ...t,
          ...balance,
        };
      }),
    [tokenPrices, flows]
  );

  const balancesWithPrices = useMemo(
    () => withPrices(balances),
    [balances, withPrices]
  );

  const transactionsWithPrices = useMemo(() => {
    const tokenBalances = new CalculateTokenBalances();

    return withPrices(transactions)
      .sort((a, b) => a.executionDate.localeCompare(b.executionDate))
      .flatMap((t) =>
        t.transfers?.map((transfer) => {
          const tokenSymbol =
            transfer?.type === 'ETHER_TRANSFER'
              ? 'XDAI'
              : transfer?.tokenInfo?.symbol || '';
          const tokenDecimals =
            transfer?.type === 'ETHER_TRANSFER'
              ? 18
              : transfer?.tokenInfo?.decimals || 0;
          const tokenAddress =
            transfer?.type === 'ETHER_TRANSFER'
              ? 'XDAI'
              : transfer?.tokenAddress || '';

          const inAmount =
            transfer?.to === '0x181eBDB03cb4b54F4020622F1B0EAcd67A8C63aC' &&
            transfer?.value !== null
              ? BigInt(transfer.value)
              : BigInt(0);
          const outAmount =
            transfer?.from === '0x181eBDB03cb4b54F4020622F1B0EAcd67A8C63aC' &&
            transfer?.value !== null
              ? BigInt(transfer.value)
              : BigInt(0);

          tokenBalances.incrementInflow(tokenAddress, inAmount);
          tokenBalances.incrementOutflow(tokenAddress, outAmount);

          const txHash = t.transactionHash || t.txHash;
          const proposal = proposalsInfo[txHash];
          const txExplorerLink = `https://blockscout.com/xdai/mainnet/tx/${t.txHash}`;
          const proposalLink = proposal
            ? `https://admin.daohaus.club/#/molochV3/0x64/${proposal.id.replace(
                /-/g,
                '/'
              )}`
            : '';

          return {
            balance: formatUnitsAsNumber(
              tokenBalances.getBalance(tokenAddress),
              tokenDecimals
            ),
            counterparty: transfer?.to, // gotta check
            date: new Date(t.executionDate),
            elapsedDays: undefined,
            in: formatUnitsAsNumber(inAmount, tokenDecimals),
            net: formatUnitsAsNumber(inAmount - outAmount, tokenDecimals),
            out: formatUnitsAsNumber(outAmount, tokenDecimals),
            proposalApplicant: proposal?.proposedBy,
            proposalId: proposal?.id,
            txExplorerLink,
            proposalLink,
            proposalLoot: undefined,
            proposalShares: undefined,
            proposalTitle: proposal?.title,
            tokenAddress,
            tokenDecimals,
            tokenSymbol,
            type: t.txType,
          };
        })
      )
      .reverse();
  }, [transactions, withPrices]);

  const transactionsWithPricesAndMembers = useMemo(
    () =>
      transactionsWithPrices.map((t) => {
        const ethAddress = t.counterparty?.toLowerCase();
        const m = members[ethAddress];
        const memberLink = m?.ethAddress?.match(REGEX_ETH_ADDRESS)
          ? `/members/${ethAddress}`
          : undefined;

        return {
          ...t,
          memberLink,
          memberEnsName: m?.ensName,
          memberName: m?.name,
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
