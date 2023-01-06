// import { useRouter } from 'next/router';
import _ from 'lodash';
import { useQuery } from '@tanstack/react-query';
import { client, MEMBER_ADDRESS_LOOKUP_QUERY } from '../gql';
import { camelize, IMember, IRaid } from '../utils';

const activeStatus = ['AWAITING', 'PREPARING', 'RAIDING'];

const useMemberDetail = ({ token, memberAddress }) => {
  const memberQueryResult = async () => {
    if (!memberAddress || !token) return;
    // TODO handle filters

    const result = await client({ token }).request(
      MEMBER_ADDRESS_LOOKUP_QUERY,
      {
        address: memberAddress,
      }
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
  >(['memberDetail', memberAddress], memberQueryResult, {
    enabled: Boolean(token) && Boolean(memberAddress),
  });

  return { isLoading, isFetching, isError, error, data };
};

export default useMemberDetail;
