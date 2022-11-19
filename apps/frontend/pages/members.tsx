import _ from 'lodash';
import { Stack, Heading } from '@raidguild/design-system';
import { NextSeo } from 'next-seo';
import useMemberList from '../hooks/useMemberList';
import useDefaultTitle from '../hooks/useDefaultTitle';
import Link from '../components/ChakraNextLink';

const MemberList = () => {
  const title = useDefaultTitle();
  const { data: members } = useMemberList();

  return (
    <>
      <NextSeo title="Members List" />

      <Stack spacing={8} align="center">
        <Heading>{title} List</Heading>
        <Stack spacing={4}>
          {_.map(members, (member) => (
            <Link
              href={`/members/${_.get(member, 'eth_address')}`}
              key={_.get(member, 'id')}
            >
              <Heading size="md">{_.get(member, 'name')}</Heading>
            </Link>
          ))}
        </Stack>
      </Stack>
    </>
  );
};

export default MemberList;
