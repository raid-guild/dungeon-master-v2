/* eslint-disable import/prefer-default-export */

import { gql } from "graphql-request";

export const INSERT_LINKS_MUTATION = gql`
  mutation InsertLinks($insertLinks: [links_insert_input!]!) {
    insert_links(objects: $insertLinks) {
      affected_rows
      returning {
        id
        link
        type
      }
    }
  }
`;

export const UPDATE_LINKS_MUTATION = gql`
  mutation UpdateLinks(updates: [links_updates!]!) {
    update_links_many(updates: $updates) {
      affected_rows
      returning {
        id
        link
        type
      }
    }
  }
`;

export const DELETE_LINKS_MUTATION = gql`
  mutation DeleteLinks(id: uuid!) {
    delete_links(where: {id: {_eq: $id}}) {
      affected_rows
    }
  }
`;

