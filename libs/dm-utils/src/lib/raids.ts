/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from 'lodash';
import { IMember, IRaid } from '@raidguild/dm-types';

export const membersExceptRaidParty = (
  members: Partial<IMember>[],
  raidParty?: any,
  cleric?: Partial<IMember>
): IMember[] | null => {
  if (!members) return null;
  let filteredMembers = members;
  let raidPartyIds: string[] = [];

  if (raidParty) {
    raidPartyIds = _.map(raidParty, (m: any) => _.get(m, 'id'));
  }
  if (cleric) {
    raidPartyIds = _.concat(raidPartyIds, _.get(cleric, 'id')) as string[];
  }
  filteredMembers = _.filter(
    members,
    (m: IMember) => !_.includes(raidPartyIds, _.get(m, 'id'))
  ) as IMember[];

  return _.orderBy(filteredMembers, 'name') as IMember[];
};

export const rolesExceptRequiredRoles = (
  roles: string[],
  raid: Partial<IRaid>
) => {
  if (!roles || !raid) return null;

  const requiredRoles = _.map(_.get(raid, 'raidsRolesRequired'), 'role');

  return _.difference(roles, requiredRoles);
};
