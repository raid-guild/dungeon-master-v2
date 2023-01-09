import { gql } from 'graphql-request';

export const CONSULTATION_DETAIL_FRAGMENT = gql`
  fragment ConsultationDetail on consultations {
    id
    budget_option {
      budget_option
    }
    consultation_status {
      consultation_status
    }
    consultation_hash
    consultations_services_required {
      guild_service {
        guild_service
      }
    }
    consultations_contacts {
      contact {
        name
        bio
        contact_info {
          email
        }
      }
    }
    desired_delivery_date
    delivery_priority {
      delivery_priority
    }
    name
    description
    link
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

export const CONSULTATION_LIST_QUERY = gql`
  query ConsultationsList(
    $offset: Int!
    $limit: Int!
    $where: consultations_bool_exp
  ) {
    consultations(limit: $limit, offset: $offset, where: $where) {
      id
      budget_option {
        budget_option
      }
      consultation_hash
      consultations_services_required {
        guild_service {
          guild_service
        }
      }
      consultation_status {
        consultation_status
      }
      consultations_contacts {
        contact {
          name
          bio
          contact_info {
            email
          }
        }
      }
      desired_delivery_date
      delivery_priority {
        delivery_priority
      }
      name
      description
      link
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
  }
`;

export const CONSULTATION_DETAIL_QUERY = gql`
  query ConsultationDetail($id: uuid!) {
    consultations_by_pk(id: $id) {
      ...ConsultationDetail
    }
  }
  ${CONSULTATION_DETAIL_FRAGMENT}
`;
