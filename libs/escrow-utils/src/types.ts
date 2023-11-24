import { Hex } from 'viem';

// clientName: string;
// projectName: string;
// raidId: string;

export interface Invoice {
  address: Hex;
  // onchain
  client: Hex;
  provider: Hex;
  token: Hex;
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
  safetyValveDate?: Date;
  milestones?: number;
  payments?: number[];
}
