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
  REGEX_ETH_ADDRESS,
} from '@raidguild/dm-utils';
import { useCallback, useMemo } from 'react';

function calculateTokenFlows(transactions) {
  console.log('transactions', transactions);
  return transactions?.reduce((tokenFlows, transaction) => {
    const safeAddress = '0x181eBDB03cb4b54F4020622F1B0EAcd67A8C63aC';

    transaction.transfers.forEach((transfer) => {
      const tokenAddress = transfer.tokenInfo?.address;
      const amount = parseFloat(transfer.value);

      if (!tokenFlows[tokenAddress]) {
        tokenFlows[tokenAddress] = {
          inflow: 0,
          outflow: 0,
        };
      }

      if (transfer.to === safeAddress) {
        tokenFlows[tokenAddress].inflow += amount;
      } else if (transfer.from === safeAddress) {
        tokenFlows[tokenAddress].outflow += amount;
      }
    });

    return tokenFlows;
  }, {});
}

const useFormattedDataV3 = ({
  balances,
  transactions,
  tokenPrices,
  members,
}: {
  balances: ITokenBalanceLineItem[];
  transactions: IVaultTransaction[];
  tokenPrices: IMappedTokenPrice;
  members: Record<string, IMember>;
}) => {
  console.log('balances', balances);
  console.log('tokenPrices', tokenPrices);

  const flows = useMemo(
    () => calculateTokenFlows(transactions),
    [transactions]
  );

  console.log('flows', flows);

  const withPrices = useCallback(
    // fix type
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
              t.balance || BigInt(0),
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
    [tokenPrices]
  );

  const balancesWithPrices = useMemo(
    () => withPrices(balances),
    [balances, withPrices]
  );
  console.log('balancesWithPrices', balancesWithPrices);

  const transactionsWithPrices = useMemo(
    () =>
      withPrices(transactions).map((t) => {
        const transfer = t.transfers[0];
        const tokenSymbol = transfer?.tokenInfo?.symbol || '';
        const tokenDecimals = transfer?.tokenInfo?.decimals || 0;
        const tokenAddress = transfer?.tokenAddress || '';

        const inAmount =
          transfer?.type === 'DEPOSIT' ? parseFloat(transfer.value) : 0;
        const outAmount =
          transfer?.type === 'WITHDRAW' ? parseFloat(transfer.value) : 0;

        return {
          balance: 0, // Placeholder, needs to be calculated separately
          counterparty: transfer?.to,
          date: new Date(t.executionDate),
          elapsedDays: undefined, // Placeholder, needs to be calculated separately
          in: inAmount,
          net: inAmount - outAmount,
          out: outAmount,
          proposalApplicant: '', // Placeholder
          proposalId: '', // Placeholder
          proposalLink: '', // Placeholder
          proposalLoot: undefined, // Placeholder
          proposalShares: undefined, // Placeholder
          proposalTitle: '', // Placeholder
          tokenAddress,
          tokenDecimals,
          tokenSymbol,
          txExplorerLink: `https://blockscout.com/xdai/mainnet/tx/${t.txHash}`,
          type: t.txType,
        };
      }),
    [transactions, withPrices]
  );

  const transactionsWithPricesAndMembers = useMemo(
    () =>
      transactionsWithPrices.map((t) => {
        const ethAddress = t.proposalApplicant?.toLowerCase();
        const m = members[ethAddress];
        const memberLink = m?.ethAddress?.match(REGEX_ETH_ADDRESS)
          ? `/members/${ethAddress}`
          : undefined;

        return {
          balance: t.balance,
          counterparty: t.counterparty,
          date: t.date,
          elapsedDays: t.elapsedDays,
          in: t.in,
          memberEnsName: m?.ensName,
          memberLink,
          memberName: m?.name,
          net: t.net,
          out: t.out,
          proposalApplicant: t.proposalApplicant,
          proposalId: t.proposalId,
          proposalLink: t.proposalLink,
          proposalLoot: t.proposalLoot,
          proposalShares: t.proposalShares,
          proposalTitle: t.proposalTitle,
          tokenAddress: t.tokenAddress,
          tokenDecimals: t.tokenDecimals,
          tokenSymbol: t.tokenSymbol,
          txExplorerLink: t.txExplorerLink,
          type: t.type,
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
