import { gql } from '@apollo/client';

export const MOLOCH_QUERY = gql`
  query moloch($contractAddr: String!) {
    moloch(id: $contractAddr) {
      id
      minions {
        minionAddress
      }
      tokenBalances(where: {guildBank: true}) {
        token {
          tokenAddress
          symbol
          decimals
        }
        tokenBalance
      }
    }
  }
`