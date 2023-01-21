import { gql } from 'graphql-request';

export const TRANSACTIONS_QUERY = gql`
  query MolochBalances($molochAddress: daohaus_stats_xdaiBytes!, $first: Int, $skip: Int) {
    daohaus_stats_xdai {
      balances(
        first: $first
        skip: $skip
        where: { molochAddress: $molochAddress, action_not: "summon" }
        orderBy: timestamp
        orderDirection: asc
      ) {
        id
        timestamp
        balance
        tokenSymbol
        tokenAddress
        transactionHash
        tokenDecimals
        action
        payment
        tribute
        amount
        counterpartyAddress
        proposalDetail {
          proposalId
          applicant
          details
          sharesRequested
          lootRequested
        }
      }
    }
  }
`;
