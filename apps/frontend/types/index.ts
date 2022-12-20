/* eslint-disable camelcase */

// * these should be post `camelize` types, db uses snake_case

export interface IRaid {
  id: string;
  name: string;
  raidName: string;
  status: string;
  category: string;
  invoiceAddress: string;

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
  consultationByConsultation: IConsultation;
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
}

type IContactInfo = {
  id: string;
  email?: string;
  discord?: string;
  github?: string;
  twitter?: string;
  telegram?: string;
};

type IContact = {
  name: string;
  bio: string;
  contactInfo: IContactInfo;
};

export interface IMember {
  id: string;
  name: string;
  isRaiding: boolean;
  guildClass: {
    guildClass: string;
  };
  skills: Skills[];

  // CONTACT
  email?: string;
  discordHandle?: string;
  githubHandle?: string;
  twitterHandle?: string;
  telegramHandle?: string;

  contactInfo: IContactInfo;

  // ETH
  ensName?: string;
  ethAddress?: string;

  // RELATIONSHIPS
  application: IApplication;

  // TIMELINE - ISO STRINGS
  createdAt: string;
  updatedAt: string;
}

export interface IConsultation {
  id: string;
  name: string;
  projectType: {
    projectType: string;
  };
  availableProjectSpec: {
    availableProjectSpec: string;
  };
  description: string;
  link: string;
  servicesRequired: {
    guildService: {
      guildService: string; // ENUM
    };
  }[];
  desiredDeliveryDate: string;
  budgetOption: {
    budgetOption: string;
  };
  additionalInfo: string;
  deliveryPriority: {
    deliveryPriority: string;
  };
  submissionType: {
    submissionType: string;
  };

  // RAID OPS
  consultationHash: string;

  // CONTACT INFO
  consultationContacts: {
    contact: IContact;
  };

  // ETC
  heardRaidguild: string;
  feedback: string;
  rating: string;

  // TIMELINE - ISO STRINGS
  createdAt: string;
  updatedAt: string;
}

// SKILLS M2M ENUM
type Skills = {
  skill: string;
  skill_type: string;
};

export interface IApplication {
  id: string;
  name: string;
  guildClass: {
    guildClass: string;
  };
  skills: Skills[];

  // CONTACT
  contactInfo: IContactInfo;

  // ETH
  ethAddress: string;
  pledgeReadiness?: string;

  // ABOUT
  introduction?: string;
  status?: string;
  learningGoals?: string;
  skillType: {
    skillType: string;
  };
  passion?: string;
  favoriteMedia?: string;

  // CRYPTO
  cryptoExp?: string;
  daoFamiliarity?: {
    daoFamiliarity: string;
  };
  cryptoThrills?: string;
  whyRaidguild?: string;
  handbookRead?: boolean;

  // COHORT
  cohortAvailability?: {
    cohortAvailability: string;
  };
  availability?: string;
  comments?: string;

  // TIMELINE - ISO STRINGS
  createdAt?: string;
  updatedAt?: string;
}

export interface IStatusUpdate {
  id: string;
  update: string;
  member: IMember;
  memberId?: string;
  raid: IRaid;
  raidId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Chain {
  name: string;
  short_name: string;
  chain: string;
  network: string;
  network_id: number;
  chain_id: string;
  providers: string[];
  rpc_url: string;
  block_explorer: string;
}

export interface ChainList {
  [key: string]: Chain;
}

export interface ChainIdMapping {
  [key: number]: Chain;
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
}

export interface IRoleRequiredInsert {
  raidId: string;
  role: string;
}

export interface IMemberUpdate {
  // for the mutation
  id?: string;
  member_updates?: {
    name?: string;
    primary_class_key?: string;
    skills?: Skills[];
  };

  // CONTACT
  contact_info_id: string;
  contact_info_updates?: {
    email?: string;
    discord?: string;
    github?: string;
    twitter?: string;
    telegram?: string;
  };
}
