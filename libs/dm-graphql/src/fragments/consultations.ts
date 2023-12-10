/* eslint-disable import/prefer-default-export */
import { gql } from 'graphql-request';

const CONSULTATION_ENUM_FRAGMENT = gql`
  fragment ConsultationEnumFragment on consultations {
    budget_option {
      budget_option
    }
    consultation_status {
      consultation_status
    }
    delivery_priority {
      delivery_priority
    }
    available_project_spec {
      available_project_spec
    }
    project_type {
      project_type
    }
    submission_type {
      submission_type
    }
  }
`;

export const CONSULTATION_DETAIL_FRAGMENT = gql`
  fragment ConsultationDetail on consultations {
    id

    name
    description
    link
    links {
      link
      link_type {
        type
      }
    }
    desired_delivery_date
    consultation_hash
    ...ConsultationEnumFragment

    consultations_services_required {
      guild_service {
        guild_service
      }
    }

    consultations_contacts {
      contact {
        id
        name
        bio
        contact_info_id
        contact_info {
          email
        }
      }
    }
  }
  ${CONSULTATION_ENUM_FRAGMENT}
`;
