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
  id?: string;
  consultation_updates: {
      id?: string;
      name?: string;
      description?: string;
      link?: string;
      type_key?: string;
      specs_key?: string;
      submission_type_key?: string;
      submission_hash?: string;
      consultation_status_key?: string;
      consultation_hash?: string;
      budget_key?: string;
      delivery_priorities_key?: string;
      desired_delivery_date?: Date;
      created_at?: Date;
      updated_at?: Date;
      v1_id?: string;
      additional_info?: string;
  }
}
