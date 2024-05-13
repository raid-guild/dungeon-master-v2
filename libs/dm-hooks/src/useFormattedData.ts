import {
  IMappedTokenPrice,
  IMember,
  ITokenBalanceLineItem,
  IVaultTransaction,
} from '@raidguild/dm-types';
import { formatDate, REGEX_ETH_ADDRESS } from '@raidguild/dm-utils';
import { InfiniteData } from '@tanstack/react-query';
import _ from 'lodash';
import { useCallback, useMemo } from 'react';

const useFormattedData = (
  memberData: InfiniteData<IMember[][]>,
  balances: ITokenBalanceLineItem[],
  transactions: IVaultTransaction[],
  tokenPrices: IMappedTokenPrice
) => {
  const members = useMemo(() => {
    const memberArray = _.flatten(
      _.get(memberData, 'pages')
    ) as unknown as IMember[];
    return _.keyBy(memberArray, (m: IMember) => m.ethAddress?.toLowerCase());
  }, [memberData]);

  const withPrices = useCallback(
    <T extends ITokenBalanceLineItem | IVaultTransaction>(items: T[]) =>
      items.map((t) => {
        const formattedDate = formatDate(t.date);
        const tokenSymbol = t.tokenSymbol?.toLowerCase();
        if (
          tokenPrices[tokenSymbol] &&
          tokenPrices[tokenSymbol][formattedDate]
        ) {
          return {
            ...t,
            priceConversion: tokenPrices[tokenSymbol][formattedDate],
          };
        }
        if (tokenSymbol.includes('xdai')) {
          return {
            ...t,
            priceConversion: 1,
          };
        }
        return t;
      }),
    [tokenPrices]
  );

  const balancesWithPrices = useMemo(
    () => withPrices(balances),
    [balances, withPrices]
  );

  const transactionsWithPrices = useMemo(
    () => withPrices(transactions),
    [transactions, withPrices]
  );

  const transactionsWithPricesAndMembers = useMemo(
    () =>
      transactionsWithPrices.map((t) => {
        const ethAddress = t.proposalApplicant.toLowerCase();
        const m = members[ethAddress];
        const memberLink = m?.ethAddress.match(REGEX_ETH_ADDRESS)
          ? `/members/${ethAddress}`
          : undefined;

        return {
          ...t,
          memberLink,
          memberName: m?.name,
          memberEnsName: m?.ensName,
        };
      }),
    [transactionsWithPrices, members]
  );

  return {
    members,
    balancesWithPrices,
    transactionsWithPrices,
    transactionsWithPricesAndMembers,
  };
};

export default useFormattedData;
