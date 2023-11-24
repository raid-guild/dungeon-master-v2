import { Hex } from 'viem';

export interface Invoice {
  address: Hex;
  clientName: string;
  projectName: string;
  raidId: string;
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
}
