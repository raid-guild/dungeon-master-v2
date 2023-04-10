import { IMember } from './members';
import { IRaid } from './raids';

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
