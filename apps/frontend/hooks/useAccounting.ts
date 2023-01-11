// All credit to @midgerate, @xivanc, @daniel-ivanco, and the DAOHaus team for the original code
import _ from 'lodash';
import { BigNumber } from 'ethers';
import { useInfiniteQuery } from '@tanstack/react-query';
import { client, TRANSACTIONS_QUERY, MOLOCH_QUERY, TOKEN_PRICES_QUERY } from '../gql';
import { camelize } from '../utils';
import { useEffect, useState } from 'react';
import {
  ICalculatedTokenBalances,
  IVaultTransaction,
  IMolochStatsBalance,
  ITokenBalance,
  ITokenBalanceLineItem,
  ITokenPrice,
  IMappedTokenPrice,
} from '../types'

const RG_GNOSIS_DAO_ADDRESS = '0xfe1084bc16427e5eb7f13fc19bcd4e641f7d571f';
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

class CalculateTokenBalances {
  calculatedTokenBalances: ICalculatedTokenBalances;

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
        out: BigNumber.from(0),
        in: BigNumber.from(0),
        balance: BigNumber.from(0),
      };
    }
  }

  incrementInflow(tokenAddress: string, inValue: BigNumber) {
    this.initTokenBalance(tokenAddress);
    const tokenStats = this.calculatedTokenBalances[tokenAddress];
    this.calculatedTokenBalances[tokenAddress] = {
      ...tokenStats,
      in: tokenStats.in.add(inValue),
      balance: tokenStats.balance.add(inValue),
    };
  }

  incrementOutflow(tokenAddress: string, outValue: BigNumber) {
    this.initTokenBalance(tokenAddress);
    const tokenStats = this.calculatedTokenBalances[tokenAddress];
    this.calculatedTokenBalances[tokenAddress] = {
      ...tokenStats,
      out: tokenStats.out.add(outValue),
      balance: tokenStats.balance.sub(outValue),
    };
  }

  getBalances() {
    return this.calculatedTokenBalances;
  }
}

// used to store all the inflow and outflow of each token when iterating over the list of moloch stats
const calculatedTokenBalances = new CalculateTokenBalances();

const formatBalancesAsTransactions = async (
  balances: Array<IMolochStatsBalance>
) => {
  try {
    const mapMolochStatsToTreasuryTransaction = async (
      molochStatsBalances: Array<IMolochStatsBalance>
    ): Promise<Array<IVaultTransaction>> => {
      const treasuryTransactions = await Promise.all(
        molochStatsBalances.map(async (molochStatBalance) => {
          /**
           * molochStatBalance.amount is incorrect because ragequit does not return the correct amount
           * so instead, we track the previous balance of the token in the calculatedTokenBalances class state
           * and subtract from current balance to get the amount.
           */
          const tokenValue = calculatedTokenBalances
            .getBalance(molochStatBalance.tokenAddress)
            .sub(BigNumber.from(molochStatBalance.balance))
            .abs();

          const balances = (() => {
            if (
              molochStatBalance.payment === false &&
              molochStatBalance.tribute === false
            ) {
              return {
                in: BigNumber.from(0),
                out: BigNumber.from(0),
                net: BigNumber.from(0),
                balance: calculatedTokenBalances.getBalance(
                  molochStatBalance.tokenAddress
                ),
              };
            }
            if (
              molochStatBalance.payment === false &&
              molochStatBalance.tribute === true
            ) {
              calculatedTokenBalances.incrementInflow(
                molochStatBalance.tokenAddress,
                tokenValue
              );
              return {
                in: tokenValue,
                out: BigNumber.from(0),
                net: tokenValue,
                balance: calculatedTokenBalances.getBalance(
                  molochStatBalance.tokenAddress
                ),
              };
            }

            if (
              molochStatBalance.payment === true &&
              molochStatBalance.tribute === false
            ) {
              calculatedTokenBalances.incrementOutflow(
                molochStatBalance.tokenAddress,
                tokenValue
              );
              return {
                in: BigNumber.from(0),
                out: tokenValue,
                net: BigNumber.from(0).sub(tokenValue),
                balance: calculatedTokenBalances.getBalance(
                  molochStatBalance.tokenAddress
                ),
              };
            }

            return {
              in: BigNumber.from(0),
              out: BigNumber.from(0),
              net: BigNumber.from(0),
              balance: calculatedTokenBalances.getBalance(
                molochStatBalance.tokenAddress
              ),
            };
          })();

          const proposalTitle = (() => {
            try {
              return JSON.parse(
                molochStatBalance.proposalDetail?.details ?? '{}'
              ).title;
            } catch (error) {
              return '';
            }
          })();

          const txExplorerLink = `https://blockscout.com/xdai/mainnet/tx/${molochStatBalance.transactionHash}`;
          const proposalLink = molochStatBalance.proposalDetail
            ? `https://app.daohaus.club/dao/0x64/${RG_GNOSIS_DAO_ADDRESS}/proposals/${molochStatBalance.proposalDetail.proposalId}`
            : '';
          const epochTimeAtIngressMs =
            Number(molochStatBalance.timestamp) * 1000;
          const date = new Date(epochTimeAtIngressMs);
          const elapsedDays = Math.floor(
            (Date.now() - epochTimeAtIngressMs) / MILLISECONDS_PER_DAY
          );

          return {
            date,
            elapsedDays,
            type: _.startCase(molochStatBalance.action),
            tokenSymbol: molochStatBalance.tokenSymbol,
            tokenDecimals: Number(molochStatBalance.tokenDecimals),
            tokenAddress: molochStatBalance.tokenAddress,
            txExplorerLink,
            counterparty: molochStatBalance.counterpartyAddress,
            proposal: {
              id: molochStatBalance.proposalDetail?.proposalId ?? '',
              link: proposalLink,
              shares: molochStatBalance.proposalDetail?.sharesRequested
                ? BigNumber.from(
                    molochStatBalance.proposalDetail.sharesRequested
                  )
                : BigNumber.from(0),
              loot: molochStatBalance.proposalDetail?.lootRequested
                ? BigNumber.from(molochStatBalance.proposalDetail.lootRequested)
                : BigNumber.from(0),
              applicant: molochStatBalance.proposalDetail?.applicant ?? '',
              title: proposalTitle,
            },
            priceConversion: 1,
            ...balances,
          };
        })
      );
      return treasuryTransactions;
    };

    const treasuryTransactions = await mapMolochStatsToTreasuryTransaction(
      balances
    );

    return {
      transactions: _.orderBy(
        treasuryTransactions,
        'date',
        'desc'
      ) as Array<IVaultTransaction>,
    };
  } catch (error) {
    return {
      error: {
        message: (error as Error).message,
      },
    };
  }
};

export const useTransactions = ({ token }) => {
  const [transactions, setTransactions] = useState<Array<IVaultTransaction>>(
    []
  );
  const limit = 1000;

  const transactionQueryResult = async (pageParam: number) => {
    if (!token) return;
    // TODO handle filters
    const response = await client({ token }).request(TRANSACTIONS_QUERY, {
      first: limit,
      skip: pageParam * limit,
      molochAddress: RG_GNOSIS_DAO_ADDRESS,
    });

    return camelize(_.get(response, 'daohaus_stats_xdai.balances'));
  };
  

  const {
    status,
    error,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<Array<IMolochStatsBalance>, Error>(
    ['transactions'],
    ({ pageParam = 0 }) => transactionQueryResult(pageParam),
    {
      getNextPageParam: (lastPage, allPages) => {
        return _.isEmpty(lastPage)
          ? undefined
          : _.divide(_.size(_.flatten(allPages)), limit);
      },
      enabled: Boolean(token),
    }
  );

  useEffect(() => {
    (async () => {
      if (status === 'success') {
        const formattedData = await formatBalancesAsTransactions(data.pages[0]);
        setTransactions(formattedData.transactions || []);
      }
    })();
  }, [data, status]);

  return {
    status,
    error,
    data: transactions,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};

const mapMolochTokenBalancesToTokenBalanceLineItem = async (
  molochTokenBalances: ITokenBalance[],
  calculatedTokenBalances: ICalculatedTokenBalances
): Promise<ITokenBalanceLineItem[]> => {
  const tokenBalanceLineItems = await Promise.all(
    molochTokenBalances.map(async (molochTokenBalance) => {
      const tokenValue = BigNumber.from(molochTokenBalance.tokenBalance)
      const tokenExplorerLink = `https://blockscout.com/xdai/mainnet/token/${molochTokenBalance.token.tokenAddress}`;

      return {
        ...molochTokenBalance,
        tokenExplorerLink,
        inflow: {
          tokenValue:
            calculatedTokenBalances[molochTokenBalance.token.tokenAddress]
              ?.in || BigNumber.from(0),
        },
        outflow: {
          tokenValue:
            calculatedTokenBalances[molochTokenBalance.token.tokenAddress]
              ?.out || BigNumber.from(0),
        },
        closing: {
          tokenValue,
        },
      }
    })
  )
  return tokenBalanceLineItems
}

export const useBalances = ({ token }) => {
  const [balances, setBalances] = useState<Array<ITokenBalanceLineItem>>([])
  const limit = 1000;

  const balancesQueryResult = async () => {
    if (!token) return;
    // TODO handle filters

    const response = await client({ token }).request(MOLOCH_QUERY, {
      contractAddr: RG_GNOSIS_DAO_ADDRESS,
    });


    return camelize(_.get(response, 'daohaus_xdai.moloch'));
  };

  const {
    status,
    error,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<{ tokenBalances: Array<ITokenBalance> }, Error>(
    ['balances'],
    () => balancesQueryResult(),
    {
      getNextPageParam: (lastPage, allPages) => {
        return _.isEmpty(lastPage)
          ? undefined
          : _.divide(_.size(_.flatten(allPages)), limit);
      },
      enabled: Boolean(token),
    }
  );

  useEffect(() => {
    (async () => {
      if (status === 'success') {
        const tokenBalances = await mapMolochTokenBalancesToTokenBalanceLineItem(
          data.pages[0]?.tokenBalances || [],
          calculatedTokenBalances.getBalances()
        )
        setBalances(tokenBalances)
      };
    })()   
  }, [data, status])

  return {
    status,
    error,
    data: balances,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};

export const useTokenPrices = ({ token }) => {
  const [tokenPrices, setTokenPrices] = useState<IMappedTokenPrice>({})

  const tokenPricesQueryResult = async () => {
    if (!token) return;
    // TODO handle filters

    const response = await client({ token }).request(TOKEN_PRICES_QUERY);

    return camelize(_.get(response, 'treasury_token_history'));
  };

  const {
    status,
    error,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<Array<ITokenPrice>, Error>(
    ['tokenPrices'],
    () => tokenPricesQueryResult(),
    {
      getNextPageParam: (lastPage, allPages) => {
        return _.isEmpty(lastPage)
          ? undefined
          : _.divide(_.size(_.flatten(allPages)));
      },
      enabled: Boolean(token),
    }
  );

  useEffect(() => {
    (async () => {
      if (status === 'success') {
        const prices = data.pages[0];
        const mappedPrices = {};
        prices.forEach(price => {
          if (!mappedPrices[price.symbol]) {
            mappedPrices[price.symbol] = {}
            mappedPrices[price.symbol][price.date] = price.priceUsd
          } else {
            mappedPrices[price.symbol][price.date] = price.priceUsd
          }
        })
        setTokenPrices(mappedPrices)
      };
    })()   
  }, [data, status])

  return {
    status,
    error,
    data: tokenPrices,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
