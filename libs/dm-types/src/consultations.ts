import { IContact } from './contacts';

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

export interface IConsultationUpdate {
  consultation_update: {
    id: string;
    consultation_status_key?: string;
    budget_key?: string;
  };
}
