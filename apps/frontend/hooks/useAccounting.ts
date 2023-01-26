/* eslint-disable no-shadow */
/* eslint-disable no-use-before-define */
// All credit to @midgerate, @xivanc, @daniel-ivanco, and the DAOHaus team for the original code
import _ from 'lodash';
import { useEffect, useState } from 'react';
import { BigNumber } from 'ethers';
import { useInfiniteQuery } from '@tanstack/react-query';
import { client, TRANSACTIONS_QUERY } from '../gql';
import {
  camelize,
  GUILD_GNOSIS_DAO_ADDRESS,
  formatUnitsAsNumber,
} from '../utils';
import {
  ICalculatedTokenBalances,
  IVaultTransaction,
  IMolochStatsBalance,
  ITokenBalance,
  ITokenBalanceLineItem,
  ITokenPrice,
  IMappedTokenPrice,
} from '../types';

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
          const tokenFormattedValue = formatUnitsAsNumber(
            tokenValue,
            molochStatBalance.tokenDecimals
          );

          const balances = (() => {
            if (
              molochStatBalance.payment === false &&
              molochStatBalance.tribute === false
            ) {
              const balance = formatUnitsAsNumber(
                calculatedTokenBalances.getBalance(
                  molochStatBalance.tokenAddress
                ),
                molochStatBalance.tokenDecimals
              );

              return {
                in: 0,
                out: 0,
                net: 0,
                balance,
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

              const balance = formatUnitsAsNumber(
                calculatedTokenBalances.getBalance(
                  molochStatBalance.tokenAddress
                ),
                molochStatBalance.tokenDecimals
              );

              return {
                in: tokenFormattedValue,
                out: 0,
                net: tokenFormattedValue,
                balance,
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

              const balance = formatUnitsAsNumber(
                calculatedTokenBalances.getBalance(
                  molochStatBalance.tokenAddress
                ),
                molochStatBalance.tokenDecimals
              );

              return {
                in: 0,
                out: tokenFormattedValue,
                net: -tokenFormattedValue,
                balance,
              };
            }

            const balance = formatUnitsAsNumber(
              calculatedTokenBalances.getBalance(
                molochStatBalance.tokenAddress
              ),
              molochStatBalance.tokenDecimals
            );

            return {
              in: 0,
              out: 0,
              net: 0,
              balance,
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
            ? `https://app.daohaus.club/dao/0x64/${GUILD_GNOSIS_DAO_ADDRESS}/proposals/${molochStatBalance.proposalDetail.proposalId}`
            : '';
          const epochTimeAtIngressMs =
            Number(molochStatBalance.timestamp) * 1000;
          const date = new Date(epochTimeAtIngressMs);
          const elapsedDays =
            balances.net > 0
              ? Math.floor(
                  (Date.now() - epochTimeAtIngressMs) / MILLISECONDS_PER_DAY
                )
              : undefined;

          const proposal = molochStatBalance.proposalDetail;

          return {
            date,
            elapsedDays,
            type: _.startCase(molochStatBalance.action),
            tokenSymbol: molochStatBalance.tokenSymbol,
            tokenDecimals: Number(molochStatBalance.tokenDecimals),
            tokenAddress: molochStatBalance.tokenAddress,
            txExplorerLink,
            counterparty: molochStatBalance.counterpartyAddress,
            proposalId: proposal?.proposalId ?? '',
            proposalLink,
            proposalShares: proposal?.sharesRequested
              ? BigNumber.from(proposal.sharesRequested)
              : undefined,
            proposalLoot: proposal?.lootRequested
              ? BigNumber.from(proposal.lootRequested)
              : undefined,
            proposalApplicant: proposal?.applicant ?? '',
            proposalTitle,
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

const mapMolochTokenBalancesToTokenBalanceLineItem = async (
  molochTokenBalances: ITokenBalance[],
  calculatedTokenBalances: ICalculatedTokenBalances
): Promise<ITokenBalanceLineItem[]> => {
  const tokenBalanceLineItems = await Promise.all(
    molochTokenBalances.map(async (molochTokenBalance) => {
      const tokenExplorerLink = `https://blockscout.com/xdai/mainnet/address/${molochTokenBalance.token.tokenAddress}`;
      const calculatedTokenBalance =
        calculatedTokenBalances[molochTokenBalance.token.tokenAddress];

      return {
        ...molochTokenBalance,
        date: new Date(),
        tokenSymbol: molochTokenBalance.token.symbol,
        tokenExplorerLink,
        inflow: {
          tokenValue: formatUnitsAsNumber(
            calculatedTokenBalance?.in || BigNumber.from(0),
            molochTokenBalance.token.decimals
          ),
        },
        outflow: {
          tokenValue: formatUnitsAsNumber(
            calculatedTokenBalance?.out || BigNumber.from(0),
            molochTokenBalance.token.decimals
          ),
        },
        closing: {
          tokenValue: formatUnitsAsNumber(
            molochTokenBalance.tokenBalance,
            molochTokenBalance.token.decimals
          ),
        },
      };
    })
  );

  return tokenBalanceLineItems;
};

export const useAccounting = ({ token }) => {
  const [transactions, setTransactions] = useState<Array<IVaultTransaction>>(
    []
  );
  const [balances, setBalances] = useState<Array<ITokenBalanceLineItem>>([]);
  const [tokenPrices, setTokenPrices] = useState<IMappedTokenPrice>({});

  const limit = 1000;

  const accountingQueryResult = async (pageParam: number) => {
    if (!token) return null;
    // TODO handle filters
    const response = await client({ token }).request(TRANSACTIONS_QUERY, {
      first: limit,
      skip: pageParam * limit,
      molochAddress: GUILD_GNOSIS_DAO_ADDRESS,
      contractAddr: GUILD_GNOSIS_DAO_ADDRESS,
    });

    return {
      transactions: camelize(_.get(response, 'daohaus_stats_xdai.balances')),
      balances: camelize(_.get(response, 'daohaus_xdai.moloch.tokenBalances')),
      tokenPrices: camelize(_.get(response, 'treasury_token_history')),
    };
  };

  const { status, error, data } = useInfiniteQuery<
    {
      transactions: Array<IMolochStatsBalance>;
      balances: Array<ITokenBalance>;
      tokenPrices: Array<ITokenPrice>;
    },
    Error
  >(['accounting'], ({ pageParam = 0 }) => accountingQueryResult(pageParam), {
    getNextPageParam: (lastPage, allPages) =>
      _.isEmpty(lastPage)
        ? undefined
        : _.divide(_.size(_.flatten(allPages)), limit),
    enabled: Boolean(token),
  });

  // TODO use onSuccess/onError instead of useEffect
  useEffect(() => {
    (async () => {
      if (status === 'success') {
        const formattedData = await formatBalancesAsTransactions(
          data.pages[0].transactions
        );
        const tokenBalances =
          await mapMolochTokenBalancesToTokenBalanceLineItem(
            data.pages[0].balances,
            calculatedTokenBalances.getBalances()
          );
        const prices = data.pages[0].tokenPrices;
        const mappedPrices = {};
        prices.forEach((price) => {
          if (!mappedPrices[price.symbol]) {
            mappedPrices[price.symbol] = {};
            mappedPrices[price.symbol][price.date] = price.priceUsd;
          } else {
            mappedPrices[price.symbol][price.date] = price.priceUsd;
          }
        });
        setTransactions(formattedData.transactions || []);
        setBalances(tokenBalances);
        setTokenPrices(mappedPrices);
      } else if (status === 'error') {
        // eslint-disable-next-line no-console
        console.error('accounting data fetching failed with: ', status);
      }
    })();
  }, [data, status]);

  return {
    status,
    error,
    data: {
      transactions,
      balances,
      tokenPrices,
    },
    loading: status === 'loading',
  };
};

export default useAccounting;
