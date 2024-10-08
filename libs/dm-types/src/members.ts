import { Hex } from 'viem';

import { IApplication } from './applications';
import { IContactInfo } from './index';
import { Skills } from './misc';

export interface IMember {
  id: string;
  name: string;
  isRaiding: boolean;
  description?: string;
  skills: Skills[];
  membersGuildClasses: {
    guildClassKey: string;
  }[];

  // CONTACT
  email?: string;
  discordHandle?: string;
  githubHandle?: string;
  twitterHandle?: string;
  telegramHandle?: string;

  contactInfo: IContactInfo;

  // ETH
  ensName?: string;
  ethAddress?: Hex;

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
  id?: string;

  member_updates?: {
    name?: string;
    is_raiding?: boolean;
    description?: string;
  };

  skills_updates?: {
    skill_key: string;
    skill_type_key: string;
    member_id: string;
  }[];

  guild_classes_updates?: {
    member_id: string;
    guild_class_key: string;
  }[];

  contact_info_id: string;

  contact_info_updates?: {
    email?: string;
    discord?: string;
    github?: string;
    twitter?: string;
    telegram?: string;
  };
}
