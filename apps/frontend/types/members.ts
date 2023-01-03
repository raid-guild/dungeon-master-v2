import { IContactInfo } from './index';
import { IApplication } from './applications';
import { Skills } from './misc';

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

export interface IMemberCreate {
  application_id?: string;
  name?: string;
  contact_info_id?: string;
  eth_address?: string;
  member_type_key?: string;
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
