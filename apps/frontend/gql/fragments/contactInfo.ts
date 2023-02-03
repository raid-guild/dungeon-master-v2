/* eslint-disable import/prefer-default-export */
import { gql } from 'graphql-request';

export const CONTACT_INFO_FRAGMENT = gql`
  fragment ContactInfo on contact_infos {
    id
    email
    discord
    github
    telegram
    twitter
  }
`;
