import { gql } from '@apollo/client';

export const RAIDS_LIST_QUERY = gql`
  query RaidsListQuery($offset: Int!, $limit: Int!, $where: raids_bool_exp) {
    raids(limit: $limit, offset: $offset, where: $where) {
      ...RaidDetail
    }
  }
  fragment RaidDetail on raids {
    id
    name
    status
    category
    roles_required {
      role
    }
    consultationByConsultation {
      project_desc
      budget
      consultations_services_reqs {
        guild_service
      }
      submission_type
      project_type
    }
    created_at
    updated_at
  }
`;

export const RAID_DETAIL_QUERY = gql`
  query RaidDetailQuery($id: uuid!) {
    raids_by_pk(id: $id) {
      id
      name
      status
      category
      created_at
      roles_required {
        role
      }
      consultationByConsultation {
        budget
        consultation_hash
        consultations_services_reqs {
          guild_service
        }
        contact_name
        contact_bio
        contact_email
        desired_delivery
        delivery_priorities
        project_desc
        project_link
        project_specs
        project_type
        submission_type
      }
      locker_hash
      invoice_address
      escrow_index
      airtable_id
      v1_id
      raid_party {
        memberByMember {
          ens_name
          eth_address
          name
          id
          guild_class
        }
      }
      created_at
      updated_at
    }
  }
`;
