import { Hex } from 'viem';

import { IConsultation } from './consultations';
import { IMember } from './members';
import { ILink } from './misc';
import { IPortfolio } from './portfolios';
import { ISignalInterest } from './signalInterest';
import { IStatusUpdate } from './statusUpdates';

export type raidSortKeys =
  | 'oldestComment'
  | 'recentComment'
  | 'name'
  | 'createDate'
  | 'startDate'
  | 'endDate'
  | 'recentlyUpdated';

export interface IRaid {
  id: string;
  name: string;
  raidName: string;
  status: string;
  category: string;
  invoice?: {
    chainId: number;
    invoiceAddress: Hex;
  };

  // RELATIONSHIPS
  rolesRequired: {
    role: string; // ENUM
  }[];
  raidCategory: {
    raidCategory: string; // ENUM
  };
  raidParty: {
    memberbyMember: IMember;
  }[];
  memberByCleric: IMember;
  consultation: IConsultation;
  updates: IStatusUpdate[];

  // LEGACY
  v1Id?: string;
  airtableId: string;
  escrowIndex: number;
  lockerHash: string;

  // TIMELINE - ISO STRINGS
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;

  signalledInterests?: ISignalInterest[];
  // LINKS
  links: ILink[];
  portfolios?: IPortfolio[];
}

export interface IRaidCreate {
  consultation_id: string;
  name: string;
  status_key: string;
  category_key: string;
}

export interface IRaidUpdate {
  id?: string;
  raid_updates?: {
    name?: string;
    status_key?: string;
    category_key?: string;
    start_date?: string;
    end_date?: string;
    cleric_id?: string;
    escrow_index?: string;
    locker_hash?: string;
    invoice?: {
      chain_id: number;
      invoice_address: Hex;
    };
    raids_roles_required?: {
      role: string; // ENUM
    }[];
  };

  // // RELATIONSHIPS
  // rolesRequired: {
  //   role: string; // ENUM
  // }[];
  // raidCategory: {
  //   raidCategory: string; // ENUM
  // };
  // raidParty: {
  //   memberbyMember: IMember;
  // }[];
  // memberByCleric: IMember;
  // consultationByConsultation: IConsultation;
  // updates: IUpdate[];

  // // LEGACY
  // v1Id?: string;
  // airtableId: string;
  // escrowIndex: number;
  // lockerHash: string;

  // TIMELINE - ISO STRINGS
}

export interface IRaidPartyInsert {
  raidId: string;
  memberId: string;
  raiderClassKey: string; // ENUM
}

export interface IRoleRequiredInsert {
  raidId: string;
  role: string;
}

export interface IRoleRequiredInsertDb {
  raid_id: string;
  role: string;
}

export interface IRoleRemoveMany {
  _and: {
    role: { _in: string[] }; // ENUM
    raid_id: { _eq: string };
  };
}
