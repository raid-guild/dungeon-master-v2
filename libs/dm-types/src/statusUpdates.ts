import { IMember } from './members';
import { IRaid } from './raids';
import { Address } from 'viem';
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

export interface IEscrowEvent {
  amount: number;
  txHash: Address;
  createdAt: number | Date | string;
  sender?: Address;
  milestone?: number;
  totalMileStones?: number;
  type?: 'release' | 'deposit' | 'lock' | 'other';
}
