import _ from 'lodash';
import { Stack, Heading } from '@raidguild/design-system';
import { NextSeo } from 'next-seo';
import { useSession } from 'next-auth/react';
import useMemberDetail from '../../hooks/useMemberDetail';
import useDefaultTitle from '../../hooks/useDefaultTitle';

const Member = () => {
  const title = useDefaultTitle();
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { data: member } = useMemberDetail({ token });
  console.log(member);

  return (
    <>
      <NextSeo title="Member" />

      <Stack spacing={8} align="center">
        <Heading>{title} Detail</Heading>
        <Heading size="md">{_.get(member, 'name')}</Heading>
      </Stack>
    </>
  );
};

export default Member;
