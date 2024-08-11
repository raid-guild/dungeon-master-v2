/* eslint-disable import/prefer-default-export */
import { gql } from 'graphql-request';

export const INVOICE_DETAILS_FRAGMENT = gql`
  fragment InvoiceDetails on Invoice {
    id
    address
    network
    token
    tokenMetadata {
      decimals
    }
    client
    provider
    resolverType
    resolver
    resolutionRate
    isLocked
    amounts
    numMilestones
    currentMilestone
    total
    disputeId
    released
    createdAt
    terminationTime
    projectName
    projectDescription
    projectAgreement
    startDate
    endDate
    deposits(orderBy: timestamp, orderDirection: asc) {
      txHash
      sender
      amount
      timestamp
    }
    releases(orderBy: timestamp, orderDirection: asc) {
      txHash
      milestone
      amount
      timestamp
    }
    disputes(orderBy: timestamp, orderDirection: asc) {
      txHash
      ipfsHash
      sender
      details
      timestamp
    }
    resolutions(orderBy: timestamp, orderDirection: asc) {
      txHash
      ipfsHash
      clientAward
      providerAward
      resolutionFee
      timestamp
    }
  }
`;
