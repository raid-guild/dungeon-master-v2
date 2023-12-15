/* eslint-disable import/prefer-default-export */
import { gql } from 'graphql-request';

export const RIP_DETAIL_QUERY = gql`
  query RipDetailQuery(
    $repository_owner: String!
    $repository_name: String!
    $project_number: Int!
    $project_columns: Int
    $cards_to_get: Int
  ) {
    repository(owner: $repository_owner, name: $repository_name) {
      project(number: $project_number) {
        columns(first: $project_columns) {
          nodes {
            name
            cards(last: $cards_to_get) {
              totalCount
              edges {
                node {
                  content {
                    ... on Issue {
                      number
                      title
                      url
                      createdAt
                      author {
                        login
                      }
                      bodyText
                      # body
                      # bodyHTML
                      comments {
                        totalCount
                      }
                      comments {
                        nodes {
                          bodyText
                          createdAt
                          author {
                            login
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
