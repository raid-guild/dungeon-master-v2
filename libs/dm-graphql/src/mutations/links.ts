/* eslint-disable import/prefer-default-export */

import { gql } from "graphql-request";

export const DELETE_AND_UPDATE_LINKS_BY_CONSULTATION = gql`
  mutation Update_links($insertLinks: [links_insert_input!]!, $consultationId: uuid!) {
    delete_links(where: {consultation_id: {_eq: $consultationId}}) {
      affected_rows
    }
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


