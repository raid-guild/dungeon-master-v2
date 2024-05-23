// import {
//   camelize,
//   formatDate,
//   formatUnitsAsNumber,
//   GUILD_GNOSIS_DAO_ADDRESS,
// } from '@raidguild/dm-utils';
// import { useState, useEffect } from 'react';
// import {
//   IAccountingRaid,
//   ICalculatedTokenBalances,
//   IMappedTokenPrice,
//   IMolochStatsBalance,
//   ISmartEscrow,
//   ISmartEscrowWithdrawal,
//   ISpoils,
//   ITokenBalance,
//   ITokenBalanceLineItem,
//   ITokenPrice,
//   IVaultTransaction,
// } from '@raidguild/dm-types';
// import _ from 'lodash';

// class CalculateTokenBalances {
//   calculatedTokenBalances: ICalculatedTokenBalances;

//   constructor() {
//     this.calculatedTokenBalances = {};
//   }

//   getBalance(tokenAddress: string) {
//     this.initTokenBalance(tokenAddress);
//     return this.calculatedTokenBalances[tokenAddress].balance;
//   }

//   initTokenBalance(tokenAddress: string) {
//     if (!(tokenAddress in this.calculatedTokenBalances)) {
//       this.calculatedTokenBalances[tokenAddress] = {
//         out: BigInt(0),
//         in: BigInt(0),
//         balance: BigInt(0),
//       };
//     }
//   }

//   incrementInflow(tokenAddress: string, inValue: bigint) {
//     this.initTokenBalance(tokenAddress);
//     const tokenStats = this.calculatedTokenBalances[tokenAddress];
//     this.calculatedTokenBalances[tokenAddress] = {
//       ...tokenStats,
//       in: tokenStats.in + inValue,
//       balance: tokenStats.balance + inValue,
//     };
//   }

//   incrementOutflow(tokenAddress: string, outValue: bigint) {
//     this.initTokenBalance(tokenAddress);
//     const tokenStats = this.calculatedTokenBalances[tokenAddress];
//     this.calculatedTokenBalances[tokenAddress] = {
//       ...tokenStats,
//       out: tokenStats.out + outValue,
//       balance: tokenStats.balance - outValue,
//     };
//   }

//   getBalances() {
//     return this.calculatedTokenBalances;
//   }
// }
// const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

// // used to store all the inflow and outflow of each token when iterating over the list of moloch stats
// const calculatedTokenBalances = new CalculateTokenBalances();
// const formatBalancesAsTransactions = async (
//   balances: Array<IMolochStatsBalance>
// ) => {
//   try {
//     const mapMolochStatsToTreasuryTransaction = async (
//       molochStatsBalances: Array<IMolochStatsBalance>
//     ): Promise<Array<IVaultTransaction>> => {
//       const treasuryTransactions = await Promise.all(
//         molochStatsBalances.map(async (molochStatBalance) => {
//           /**
//            * molochStatBalance.amount is incorrect because ragequit does not return the correct amount
//            * so instead, we track the previous balance of the token in the calculatedTokenBalances class state
//            * and subtract from current balance to get the amount.
//            */
//           let tokenValue =
//             calculatedTokenBalances.getBalance(molochStatBalance.tokenAddress) -
//             BigInt(molochStatBalance.balance);

//           // Ensure the value is absolute
//           tokenValue = tokenValue >= BigInt(0) ? tokenValue : -tokenValue;

//           const tokenFormattedValue = formatUnitsAsNumber(
//             tokenValue,
//             molochStatBalance.tokenDecimals
//           );

//           const balances = (() => {
//             if (
//               molochStatBalance.payment === false &&
//               molochStatBalance.tribute === false
//             ) {
//               const balance = formatUnitsAsNumber(
//                 calculatedTokenBalances.getBalance(
//                   molochStatBalance.tokenAddress
//                 ),
//                 molochStatBalance.tokenDecimals
//               );

//               return {
//                 in: 0,
//                 out: 0,
//                 net: 0,
//                 balance,
//               };
//             }
//             if (
//               molochStatBalance.payment === false &&
//               molochStatBalance.tribute === true
//             ) {
//               calculatedTokenBalances.incrementInflow(
//                 molochStatBalance.tokenAddress,
//                 tokenValue
//               );

//               const balance = formatUnitsAsNumber(
//                 calculatedTokenBalances.getBalance(
//                   molochStatBalance.tokenAddress
//                 ),
//                 molochStatBalance.tokenDecimals
//               );

//               return {
//                 in: tokenFormattedValue,
//                 out: 0,
//                 net: tokenFormattedValue,
//                 balance,
//               };
//             }

//             if (
//               molochStatBalance.payment === true &&
//               molochStatBalance.tribute === false
//             ) {
//               calculatedTokenBalances.incrementOutflow(
//                 molochStatBalance.tokenAddress,
//                 tokenValue
//               );

//               const balance = formatUnitsAsNumber(
//                 calculatedTokenBalances.getBalance(
//                   molochStatBalance.tokenAddress
//                 ),
//                 molochStatBalance.tokenDecimals
//               );

//               return {
//                 in: 0,
//                 out: tokenFormattedValue,
//                 net: -tokenFormattedValue,
//                 balance,
//               };
//             }

//             const balance = formatUnitsAsNumber(
//               calculatedTokenBalances.getBalance(
//                 molochStatBalance.tokenAddress
//               ),
//               molochStatBalance.tokenDecimals
//             );

//             return {
//               in: 0,
//               out: 0,
//               net: 0,
//               balance,
//             };
//           })();

//           const proposalTitle = (() => {
//             try {
//               return JSON.parse(
//                 molochStatBalance.proposalDetail?.details ?? '{}'
//               ).title;
//             } catch (error) {
//               return '';
//             }
//           })();

//           const txExplorerLink = `https://blockscout.com/xdai/mainnet/tx/${molochStatBalance.transactionHash}`;
//           const proposalLink = molochStatBalance.proposalDetail
//             ? `https://app.daohaus.club/dao/0x64/${GUILD_GNOSIS_DAO_ADDRESS}/proposals/${molochStatBalance.proposalDetail.proposalId}`
//             : '';
//           const epochTimeAtIngressMs =
//             Number(molochStatBalance.timestamp) * 1000;
//           const date = new Date(epochTimeAtIngressMs);
//           const elapsedDays =
//             balances.net > 0
//               ? Math.floor(
//                   (Date.now() - epochTimeAtIngressMs) / MILLISECONDS_PER_DAY
//                 )
//               : undefined;

//           const proposal = molochStatBalance.proposalDetail;

//           return {
//             date,
//             elapsedDays,
//             type: _.startCase(molochStatBalance.action),
//             tokenSymbol: molochStatBalance.tokenSymbol,
//             tokenDecimals: Number(molochStatBalance.tokenDecimals),
//             tokenAddress: molochStatBalance.tokenAddress,
//             txExplorerLink,
//             counterparty: molochStatBalance.counterpartyAddress,
//             proposalId: proposal?.proposalId ?? '',
//             proposalLink,
//             proposalShares: proposal?.sharesRequested
//               ? BigInt(proposal.sharesRequested)
//               : undefined,
//             proposalLoot: proposal?.lootRequested
//               ? BigInt(proposal.lootRequested)
//               : undefined,
//             proposalApplicant: proposal?.applicant ?? '',
//             proposalTitle,
//             ...balances,
//           };
//         })
//       );

//       return treasuryTransactions;
//     };

//     const treasuryTransactions = await mapMolochStatsToTreasuryTransaction(
//       balances
//     );

//     return {
//       transactions: _.orderBy(
//         treasuryTransactions,
//         'date',
//         'desc'
//       ) as Array<IVaultTransaction>,
//     };
//   } catch (error) {
//     return {
//       error: {
//         message: (error as Error).message,
//       },
//     };
//   }
// };

// const mapMolochTokenBalancesToTokenBalanceLineItem = async (
//   molochTokenBalances: ITokenBalance[],
//   calculatedTokenBalances: ICalculatedTokenBalances
// ): Promise<ITokenBalanceLineItem[]> => {
//   const tokenBalanceLineItems = await Promise.all(
//     molochTokenBalances.map(async (molochTokenBalance) => {
//       const tokenExplorerLink = `https://blockscout.com/xdai/mainnet/address/${molochTokenBalance.token.tokenAddress}`;
//       const calculatedTokenBalance =
//         calculatedTokenBalances[molochTokenBalance.token.tokenAddress];

//       return {
//         ...molochTokenBalance,
//         date: new Date(),
//         tokenSymbol: molochTokenBalance.token.symbol,
//         tokenExplorerLink,
//         inflow: {
//           tokenValue: formatUnitsAsNumber(
//             calculatedTokenBalance?.in || BigInt(0),
//             molochTokenBalance.token.decimals
//           ),
//         },
//         outflow: {
//           tokenValue: formatUnitsAsNumber(
//             calculatedTokenBalance?.out || BigInt(0),
//             molochTokenBalance.token.decimals
//           ),
//         },
//         closing: {
//           tokenValue: formatUnitsAsNumber(
//             molochTokenBalance.tokenBalance,
//             molochTokenBalance.token.decimals
//           ),
//         },
//       };
//     })
//   );

//   // TODO fix type
//   return tokenBalanceLineItems as unknown as any;
// };

// export const getTokenBalancesWithPrices = async (safeAddress: string) => {
//   const [transactions, setTransactions] = useState<Array<IVaultTransaction>>(
//     []
//   );
//   const [balances, setBalances] = useState<Array<ITokenBalanceLineItem>>([]);
//   const [tokenPrices, setTokenPrices] = useState<IMappedTokenPrice>({});

//   // TODO use onSuccess/onError instead of useEffect
//   useEffect(() => {
//     (async () => {
//       if (status === 'success') {
//         const formattedData = await formatBalancesAsTransactions(
//           data.pages[0].transactions
//         );
//         const tokenBalances =
//           await mapMolochTokenBalancesToTokenBalanceLineItem(
//             data.pages[0].balances,
//             calculatedTokenBalances.getBalances()
//           );
//         const spoils = await formatSpoils(
//           data.pages[0].smartEscrows,
//           data.pages[0].raids
//         );
//         const { historicalPrices, currentPrices } = data.pages[0];
//         // using any because not sure how to type this
//         const mappedPrices: { [key: string]: any } = {};
//         historicalPrices.forEach((price) => {
//           if (!mappedPrices[price.symbol]) {
//             mappedPrices[price.symbol] = {};
//             mappedPrices[price.symbol][price.date] = price.priceUsd;
//           } else {
//             mappedPrices[price.symbol][price.date] = price.priceUsd;
//           }
//         });
//         currentPrices.forEach((price) => {
//           const date = new Date();
//           if (!mappedPrices[price.symbol]) {
//             mappedPrices[price.symbol] = {};
//             mappedPrices[price.symbol][formatDate(date)] = price.priceUsd;
//           } else {
//             mappedPrices[price.symbol][formatDate(date)] = price.priceUsd;
//           }
//         });
//         setTransactions(formattedData.transactions || []);
//         setBalances(tokenBalances);
//         setSpoils(spoils);
//         setTokenPrices(mappedPrices);
//       } else if (status === 'error') {
//         // eslint-disable-next-line no-console
//         console.error('accounting data fetching failed with: ', status);
//       }
//     })();
//   }, [data, status]);
// };