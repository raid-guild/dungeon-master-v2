import { IContactInfo } from './contacts';
import { Skills } from './misc';

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
