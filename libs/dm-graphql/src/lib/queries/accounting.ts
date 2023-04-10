/* eslint-disable import/prefer-default-export */
import { gql } from 'graphql-request';

export const TRANSACTIONS_QUERY = gql`
  query AccountingQuery(
    $molochAddress: daohaus_stats_xdaiBytes!
    $first: Int
    $skip: Int
    $contractAddr: ID!
    $escrowParentAddress: gnosis_smart_escrowsBytes!
  ) {
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
    daohaus_xdai {
      moloch(id: $contractAddr) {
        id
        minions {
          minionAddress
        }
        tokenBalances(where: { guildBank: true }) {
          token {
            tokenAddress
            symbol
            decimals
          }
          tokenBalance
        }
      }
    }
    gnosis_smart_escrows {
      wrappedInvoices(first: $first, where: { parent: $escrowParentAddress }) {
        id
        withdraws {
          childShare
          parentShare
          timestamp
          token
        }
      }
    }
    raids {
      id
      invoice_address
      name
    }
    treasury_token_history {
      date
      price_usd
      symbol
    }
    current_token_prices {
      price_usd
      symbol
    }
  }
`;
