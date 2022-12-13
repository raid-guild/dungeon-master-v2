/* eslint-disable camelcase */

// * these should be post `camelize` types, db uses snake_case

export interface IRaid {
  id: string;
  raidName: string;
  status: string;
  category: string;
  invoiceAddress: string;

  // RELATIONSHIPS
  rolesRequired: {
    role: string; // ENUM
  }[];
  raidParty: {
    memberbyMember: IMember;
  }[];
  memberByCleric: IMember;
  consultationByConsultation: IConsultation;
  comments: IComment[];

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
  email?: string;
  discordHandle?: string;
  githubHandle?: string;
  twitterHandle?: string;
  telegramHandle?: string;
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
  guildClass: string;
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

export interface IComment {
  id: string;
  comment: string;
  commentedBy: IMember;
  commentedRaid: IRaid;
  createdAt: string;
  modifiedAt: string;
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
