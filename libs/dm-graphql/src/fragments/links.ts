/* eslint-disable import/prefer-default-export */
import { gql } from "graphql-request";

export const LINKS_FRAGMENT = gql`
fragment LinksFragment on links {
  application {
    application_id
  }
  consultation {
    consultation_id
  }
  id
  link
  link_type
  member {
    member_id
  }
  raid {
    raid_id
  }
  type
}
`;
