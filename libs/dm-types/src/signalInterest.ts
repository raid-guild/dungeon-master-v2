import { IMember } from "./members";

export interface ISignalInterest {
    id?: string;
    consultationId?: string;
    memberId?: string;
    raidId?: string;
    member?: IMember;
}