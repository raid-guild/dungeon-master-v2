import { gql } from 'graphql-request';

export const TRANSACTIONS_QUERY = gql`
  query MolochBalances($molochAddress: Bytes!, $first: Int, $skip: Int) {
    balances(
      first: $first
      skip: 10
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
`;
