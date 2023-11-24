import { client, MEMBER_ADDRESS_LOOKUP_QUERY } from '@raidguild/dm-graphql';
import { IMember, IRaid } from '@raidguild/dm-types';
import { camelize } from '@raidguild/dm-utils';
import { useQuery } from '@tanstack/react-query';
import _ from 'lodash';

const activeStatus = ['AWAITING', 'PREPARING', 'RAIDING'];

const useMemberDetail = ({
  memberAddress,
  token,
}: {
  memberAddress: string;
  token: string;
}) => {
  const memberQueryResult = async () => {
    if (!memberAddress || !token) return null;
    // TODO handle filters

    const result = await client({ token }).request(
      MEMBER_ADDRESS_LOOKUP_QUERY,
      { address: _.toLower(memberAddress) }
    );

    const member = camelize(_.first(_.get(result, 'members')));
    const raids = _.concat(
      camelize(_.get(result, 'cleric_raids')),
      _.map(_.get(member, 'raidParties'), 'raid')
    );

    const pastAndActiveRaids = {
      active: _.filter(raids, (r: IRaid) =>
        _.includes(activeStatus, _.get(r, 'raidStatus.raidStatus'))
      ),
      past: _.filter(
        raids,
        (r: IRaid) =>
          !_.includes(activeStatus, _.get(r, 'raidStatus.raidStatus'))
      ),
    };

    return {
      member,
      raids: pastAndActiveRaids,
    };
  };

  const { isLoading, isFetching, isError, error, data } = useQuery<
    { member: IMember; raids: { active: IRaid[]; past: IRaid[] } },
    Error
  >({
    queryKey: ['memberDetail', memberAddress],
    queryFn: memberQueryResult,
    enabled: Boolean(token) && Boolean(memberAddress),
  });

  return { isLoading, isFetching, isError, error, data };
};

export default useMemberDetail;
