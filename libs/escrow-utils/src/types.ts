import { Hex } from 'viem';

export interface Invoice {
  network: string;
  address: Hex;
  // onchain
  client: Hex;
  provider: Hex;
  providerReceiver?: Hex;
  token: Hex;
  tokenMetadata: {
    decimals: number;
  };
  isLocked: boolean;
  disputes: any[]; // Dispute[];
  resolutions: any[]; // Resolution[];
  deposits: any[]; // Deposit[];
  releases: any[]; // Release[];
  terminationTime: number;
  currentMilestone: number;
  amounts: number[];
  released: number;
  total: number;
  resolver: Hex;
  resolutionRate: number;
  // form
  safetyValveDate?: Date; // converts to terminationTime
  milestones?: number[]; // convert to amounts & total
  // split zap
  raidPartySplit?: boolean;
  daoSplit?: boolean;
}

export type ProjectDetails = {
  projectName: string;
  projectDescription: string;
  projectAgreement: string;
  startDate: number;
  endDate: number;
};

export type FormInvoice = {
  title: string;
  description: string;
  document: string;
  milestones: {
    value: string;
    title?: string | undefined;
    description?: string | undefined;
  }[];
  startDate: string;
  endDate: string;
  resolverType: string;
  resolverAddress?: string;
  isResolverTermsChecked?: boolean;
  klerosCourt?: number;
  safetyValveDate?: Date;
  deadline?: Date;
  token: string;
  client: string;
  clientReceiver?: string;
  provider: string;
  providerReceiver?: string;
  paymentDue?: string;
  lateFee?: string;
  lateFeeTimeInterval?: string;
};
