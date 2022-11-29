import _ from 'lodash';
import { IMember } from './definitions';

export const membersExceptRaidParty = (
  members: Partial<IMember>[],
  raidParty?: any,
  cleric?: Partial<IMember>
): IMember[] | null => {
  if (!members) return null;
  let filteredMembers = members;
  let raidPartyIds = [];

  if (raidParty) {
    raidPartyIds = _.map(raidParty, (m: any) => _.get(m, 'id'));
  }
  if (cleric) {
    raidPartyIds = _.concat(raidPartyIds, _.get(cleric, 'id'));
  }
  filteredMembers = _.filter(
    members,
    (m: IMember) => !_.includes(raidPartyIds, _.get(m, 'id'))
  );

  return _.orderBy(filteredMembers, 'name');
};
