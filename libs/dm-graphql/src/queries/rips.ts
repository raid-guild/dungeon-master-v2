// Copied from raids.ts

import { gql } from 'graphql-request';

export const RIP_DETAIL_QUERY = gql`
  query {
    repository(owner: "raid-guild", name: "RIPs") {
      issues(last: 10, states: OPEN) {
        edges {
          node {
            title
            number
            state
            author {
              url
            }
            labels(first: 5) {
              edges {
                node {
                  name
                }
              }
            }
            body
          }
        }
      }
    }
  }
`;
