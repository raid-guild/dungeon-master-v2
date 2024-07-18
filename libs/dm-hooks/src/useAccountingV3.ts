/* eslint-disable no-await-in-loop */
import {
  client as dmGraphQlClient,
  TRANSACTIONS_QUERY_V3,
} from '@raidguild/dm-graphql';
import {
  IAccountingRaid,
  Invoice,
  ISpoils,
  Proposal,
  RageQuit,
} from '@raidguild/dm-types';
import {
  camelize,
  formatUnitsAsNumber,
  GNOSIS_SAFE_ADDRESS,
  GUILD_GNOSIS_DAO_ADDRESS,
} from '@raidguild/dm-utils';
import { NETWORK_CONFIG } from '@raidguild/escrow-utils';
import { useInfiniteQuery, useQueries, useQuery } from '@tanstack/react-query';
import { GraphQLClient } from 'graphql-request';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { getAddress } from 'viem';

const graphUrl = (chainId: number = 4) =>
  `https://api.thegraph.com/subgraphs/name/${_.get(NETWORK_CONFIG, [
    chainId,
    'SUBGRAPH',
  ])}`;

export const SUPPORTED_NETWORKS = _.map(_.keys(NETWORK_CONFIG), _.toNumber);

export const client = (chainId: number) => new GraphQLClient(graphUrl(chainId));

const API_URL = 'https://safe-transaction-gnosis-chain.safe.global/api/v1';

const transformTokenBalances = (tokenBalanceRes, safeAddress: string) => {
  const fiatTotal = _.reduce(
    tokenBalanceRes,
    (sum: number, balance) => sum + Number(balance.balance),
    0
  );
  return { safeAddress, tokenBalances: tokenBalanceRes, fiatTotal };
};

const listTokenBalances = async ({ safeAddress }: { safeAddress: string }) => {
  try {
    const res = await fetch(`${API_URL}/safes/${safeAddress}/balances/`);
    const data = await res.json();
    const filteredTokenBalanceRes = _.filter(data, 'tokenAddress');

    return {
      data: transformTokenBalances(filteredTokenBalanceRes, safeAddress),
    };
  } catch (err) {
    return { error: `Error fetching token balances. Please try again. ${err}` };
  }
};

const getSafeTransactionProposals = async ({
  safeAddress,
}: {
  safeAddress: string;
}) => {
  try {
    const limit = 100;
    let offset = 0;
    let allTxData = [];

    let hasNext = true;
    while (hasNext) {
      const res = await fetch(
        `${API_URL}/safes/${safeAddress}/all-transactions/?limit=${limit}&offset=${offset}`
      );
      const txData = await res.json();
      allTxData = _.concat(allTxData, txData.results);

      hasNext = !!txData.next;
      if (hasNext) offset += limit;
    }

    return { txData: allTxData };
  } catch (err) {
    return {
      error: `Error fetching safe transactions. Please try again. ${err}`,
    };
  }
};

const getRageQuits = async (v3client: GraphQLClient): Promise<RageQuit[]> => {
  try {
    const rageQuits: { rageQuits: RageQuit[] } = await v3client.request(`
      {
        rageQuits(where: { dao: "${GNOSIS_SAFE_ADDRESS}" }) { 
          shares
          txHash
        }
      }
    `);

    return rageQuits.rageQuits;
  } catch (error) {
    return [];
  }
};

const getSmartInvoice = async (
  v3ClientInvoices: GraphQLClient
): Promise<Invoice[]> => {
  try {
    const invoices: { invoices: Invoice[] } = await v3ClientInvoices.request(`
        {
          invoices (where: { provider: "${GUILD_GNOSIS_DAO_ADDRESS}" }) {
            token
            address
            releases {
              timestamp
              amount
            }
          }
        }
    `);

    return invoices.invoices;
  } catch (error) {
    return [];
  }
};

const accountingQueryResult = async (token: string) => {
  const response = await dmGraphQlClient({ token }).request(
    TRANSACTIONS_QUERY_V3
  );

  return {
    raids: camelize(_.get(response, 'raids')),
  };
};

const formatSpoils = async (
  Raids: IAccountingRaid[],
  Invoices: Invoice[]
): Promise<ISpoils[]> => {
  const wxDAI = '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d';
  const [raids, invoices] = await Promise.all([Raids, Invoices]);
  console.log('raids', raids);

  const filteredInvoices = invoices.filter(
    (invoice) => invoice.token === wxDAI
  );

  const spoils = filteredInvoices.map((invoice) => {
    const totalReleased = invoice.releases.reduce(
      (acc, release) => acc + parseFloat(release.amount),
      0
    );
    const latestTimestamp = Math.max(
      ...invoice.releases.map((release) =>
        new Date(release.timestamp).getTime()
      )
    );
    const spoilsAmount = totalReleased * 0.1;
    const childShare = totalReleased - spoilsAmount;
    const Raid = raids.find((raid) => raid.invoiceAddress === invoice.address);
    console.log('Raid', Raid);

    return {
      raidLink: `/raids/${Raid?.id}`,
      raidName: Raid?.name || '',
      childShare,
      parentShare: spoilsAmount,
      priceConversion: 1,
      date: new Date(latestTimestamp),
      tokenSymbol: 'wxDAI',
    };
  });
  return spoils.sort((a, b) => b.date.getTime() - a.date.getTime());
};

// const formatSpoilsV2 = async (
//   raids: IAccountingRaid[],
//   invoices: Invoice[]
// ): Promise<ISpoils[]> => {
//   const wxDAI = '0xe91d153e0b41518a2ce8dd3d7944fa863463a97d';
//   const filteredInvoices = invoices.filter(
//     (invoice) => invoice.token === wxDAI
//   );

//   // Assuming an asynchronous operation is needed inside the map
//   const spoilsPromises = filteredInvoices.map(async (invoice) => {
//     const totalReleased = invoice.releases.reduce(
//       (acc, release) => acc + parseFloat(release.amount),
//       0
//     );
//     const latestTimestamp = Math.max(
//       ...invoice.releases.map((release) =>
//         new Date(release.timestamp).getTime()
//       )
//     );
//     const spoilsAmount = totalReleased * 0.1;
//     const childShare = totalReleased - spoilsAmount;

//     const Raid = raids.find((raid) => raid.invoiceAddress === invoice.token);
//     // if (!Raid) return;

//     return {
//       raidLink: `/raids/${Raid?.id}`,
//       raidName: Raid?.name || '',
//       childShare,
//       parentShare: spoilsAmount,
//       priceConversion: 1,
//       date: new Date(latestTimestamp),
//       tokenSymbol: 'wxDAI',
//     };
//   });

//   const spoils = await Promise.all(spoilsPromises);

//   return spoils.sort((a, b) => b.date.getTime() - a.date.getTime());
// };

const useAccountingV3 = () => {
  const [spoils, setSpoils] = useState<ISpoils[]>([]);

  const { data: session } = useSession();
  const token = _.get(session, 'token') as string;

  const checksum = getAddress(GNOSIS_SAFE_ADDRESS);

  const v3client = new GraphQLClient(
    `https://gateway-arbitrum.network.thegraph.com/api/${process.env.NEXT_PUBLIC_THE_GRAPH_API_KEY}/subgraphs/id/6x9FK3iuhVFaH9sZ39m8bKB5eckax8sjxooBPNKWWK8r`
  );

  const v3ClientInvoices = new GraphQLClient(
    `https://api.studio.thegraph.com/proxy/78711/smart-invoice-gnosis/v0.0.1/`
  );

  const {
    isError: accountingIsError,
    isLoading: accountingIsLoading,
    error: accountingDataError,
    data: accountingData,
  } = useInfiniteQuery<
    {
      raids: Array<IAccountingRaid>;
    },
    Error
  >(['accounting'], () => accountingQueryResult(token), {
    getNextPageParam: (lastPage, allPages) =>
      _.isEmpty(lastPage)
        ? undefined
        : _.divide(_.size(_.flatten(allPages)), 100),
    enabled: Boolean(token),
  });

  console.log('accountingData', accountingData);

  const {
    data: tokenBalances,
    error: tokenBalancesError,
    isLoading: tokenBalancesLoading,
    isError: tokenBalancesIsError,
  } = useQuery(['tokenBalances', checksum], () =>
    listTokenBalances({ safeAddress: checksum })
  );

  const {
    data: txResponse,
    error: txResponseError,
    isLoading: txResponseLoading,
    isError: txResponseIsError,
  } = useQuery(['transactions', checksum], () =>
    getSafeTransactionProposals({ safeAddress: checksum })
  );

  const {
    data: rageQuitsData,
    error: rageQuitsError,
    isLoading: rageQuitsDataLoading,
    isError: rageQuitsIsError,
  } = useQuery(['rageQuits'], () => getRageQuits(v3client));

  const {
    data: smartInvoiceData,
    error: smartInvoiceError,
    isLoading: smartInvoiceLoading,
    isError: smartInvoiceIsError,
  } = useQuery(['smartInvoice'], () => getSmartInvoice(v3ClientInvoices));

  console.log('smartInvoiceData', smartInvoiceData);

  const proposalQueries =
    _.map(txResponse?.txData, (tx) => {
      const txHash = tx.transactionHash || tx.txHash;
      return {
        queryKey: ['proposal', txHash],
        queryFn: async (): Promise<Proposal | null> => {
          try {
            const proposal: { proposals: Proposal[] } = await v3client.request(`
            {
              proposals(where: { processTxHash: "${txHash}"}) {
                id
                createdAt
                createdBy
                proposedBy
                processTxHash
                proposalType
                description
                title
                txHash
              }
            }
          `);
            if (!_.size(proposal.proposals)) {
              return null;
            }
            return _.first(proposal.proposals) || null;
          } catch (error) {
            return null;
          }
        },
        onError: (error: Error) => {
          console.error(
            `Error in query proposal with txHash: ${txHash}`,
            error
          );
        },
      };
    }) || [];

  useEffect(() => {
    (async () => {
      if (!accountingIsLoading && !smartInvoiceLoading) {
        const FormattedSpoils = await formatSpoils(
          accountingData?.pages[0].raids,
          smartInvoiceData
        );

        setSpoils(FormattedSpoils);
      } else if (!accountingIsError && !smartInvoiceIsError) {
        // eslint-disable-next-line no-console
        console.error(
          'accounting data fetching failed with: ',
          accountingDataError
        );
        console.error(
          'invoices data fetching failed with: ',
          smartInvoiceError
        );
      }
    })();
  }, [
    accountingData,
    smartInvoiceData,
    accountingIsError,
    smartInvoiceIsError,
  ]);

  console.log('spoils', spoils);

  const proposalsInfo = useQueries({ queries: proposalQueries });
  const error = tokenBalancesError || txResponseError || rageQuitsError;
  const isError = tokenBalancesIsError || txResponseIsError || rageQuitsIsError;
  const loading =
    tokenBalancesLoading || txResponseLoading || rageQuitsDataLoading;
  const transformProposals = proposalsInfo
    .filter((query) => query.data)
    .map((query) => query.data as Proposal)
    .reduce((acc, proposal) => {
      const { processTxHash, ...rest } = proposal;
      acc[processTxHash] = rest;
      return acc;
    }, {} as Record<string, Omit<Proposal, 'processTxHash'>>);

  const data = {
    smartInvoice: smartInvoiceData || [],
    tokens: tokenBalances?.data,
    transactions: txResponse?.txData,
    rageQuits: rageQuitsData || [],
    proposalsInfo: transformProposals,
  };

  return { data, error, isError, loading };
};

export default useAccountingV3;
