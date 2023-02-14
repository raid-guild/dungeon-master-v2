/* eslint-disable import/prefer-default-export */
import { gql } from 'graphql-request';

export const CONTACT_INFOS_FRAGMENT = gql`
  fragment ContactInfos on contact_infos {
    id
    email
    discord
    github
    telegram
    twitter
  }
`;
