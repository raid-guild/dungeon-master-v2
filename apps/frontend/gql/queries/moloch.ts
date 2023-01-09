import { gql } from 'graphql-request';

export const MOLOCH_QUERY = gql`
  query moloch($contractAddr: ID!) {
    daohaus_xdai {
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
  }
`