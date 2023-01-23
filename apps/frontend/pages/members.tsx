/* eslint-disable dot-notation */
/* eslint-disable react/no-unstable-nested-components */
import { useState } from 'react';
import _ from 'lodash';
import {
  Stack,
  Heading,
  Flex,
  FormLabel,
  Spinner,
  ChakraSelect,
  SimpleGrid,
} from '@raidguild/design-system';
import { useSession } from 'next-auth/react';
import { NextSeo } from 'next-seo';
import InfiniteScroll from 'react-infinite-scroller';

import useMemberList from '../hooks/useMemberList';
import useDefaultTitle from '../hooks/useDefaultTitle';
import MemberCard from '../components/MemberCard';
import SiteLayout from '../components/SiteLayout';

import { IMember } from '../types';
import { GUILD_CLASS_OPTIONS } from '../utils';

const memberStatusOptions = [
  { label: 'Show All', value: 'ALL' },
  { label: 'Is Raiding', value: 'true' },
  { label: 'Is Not Raiding', value: 'false' },
];

const memberRolesOptions = [
  { label: 'Show All', value: 'ALL' },
  ...GUILD_CLASS_OPTIONS,
];

const memberSortOptions = [{ label: 'Name', value: 'name' }];

const MemberList = () => {
  const title = useDefaultTitle();
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const [memberStatusFilter, setMemberStatusFilter] = useState<string>('ALL'); // Is Raiding
  const [memberSort, setMemberSort] = useState<string>('name'); // Name
  const [memberRolesFilter, setMemberRolesFilter] = useState<string>('ALL'); // All Roles

  const handleMemberRolesFilterChange = async (role: string) => {
    setMemberRolesFilter(role);
  };

  const handleMemberStatusFilterChange = async (status: string) => {
    setMemberStatusFilter(status);
  };

  const handleMemberSortChange = async (sortOption: string) => {
    setMemberSort(sortOption);
  };

  // TODO: generalize and move to separate file -- will need to pass options and filter state
  const MemberControls = () => (
    <Flex
      direction={{ base: 'column', md: 'row' }}
      justifyContent='space-between'
      width='100%'
      gap={[4, null, null, 8]}
      paddingX={6}
    >
      <Flex direction='column' flexBasis='25%'>
        <FormLabel
          htmlFor='memberRole'
          maxWidth='720px'
          fontFamily='texturina'
          lineHeight='1.8'
          color='white'
          textAlign='left'
        >
          Member Role
        </FormLabel>
        <ChakraSelect
          width='100%'
          name='memberRole'
          value={memberRolesFilter}
          defaultValue={memberRolesFilter['Frontend Dev']}
          onChange={(e) => {
            handleMemberRolesFilterChange(e.target.value);
          }}
        >
          {memberRolesOptions.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </ChakraSelect>
      </Flex>
      <Flex direction='column' flexBasis='25%'>
        <FormLabel
          htmlFor='memberStatus'
          maxWidth='720px'
          fontFamily='texturina'
          lineHeight='1.8'
          color='white'
          textAlign='left'
        >
          Member Status
        </FormLabel>
        <ChakraSelect
          // width='100%'
          name='memberStatus'
          id='raidRoles'
          value={memberStatusFilter}
          defaultValue='ALL'
          onChange={(e) => {
            handleMemberStatusFilterChange(e.target.value);
          }}
        >
          {memberStatusOptions.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </ChakraSelect>
      </Flex>
      <Flex direction='column' flexBasis='25%'>
        <FormLabel
          htmlFor='memberSort'
          maxWidth='720px'
          fontFamily='texturina'
          lineHeight='1.8'
          color='white'
          textAlign='left'
        >
          Sort
        </FormLabel>
        <ChakraSelect
          width='100%'
          name='memberSort'
          value={memberSort}
          defaultValue={memberSortOptions['Name']}
          onChange={(e) => {
            handleMemberSortChange(e.target.value);
          }}
        >
          {memberSortOptions.map((sortOption) => (
            <option key={sortOption.value} value={sortOption.value}>
              {sortOption.label}
            </option>
          ))}
        </ChakraSelect>
      </Flex>
    </Flex>
  );

  const { data, error, fetchNextPage, hasNextPage } = useMemberList({
    token,
    memberRolesFilterKey: memberRolesFilter,
    memberStatusFilterKey: memberStatusFilter,
    memberSortKey: memberSort,
  });
  const members = _.flatten(_.get(data, 'pages'));

  return (
    <>
      <NextSeo title='Members List' />

      <SiteLayout
        isLoading={!data}
        data={members}
        subheader={
          <>
            <Heading>{title} List</Heading>
            <MemberControls />
          </>
        }
        emptyDataPhrase='No members found'
        error={error}
      >
        <InfiniteScroll
          pageStart={0}
          loadMore={fetchNextPage}
          hasMore={hasNextPage}
          loader={
            <Flex my={25} w='100%' justify='center'>
              <Spinner size='xl' />
            </Flex>
          }
        >
          <SimpleGrid gap={4} columns={[1, null, null, 2]}>
            {_.map(members, (member: IMember) => (
              <MemberCard
                member={member}
                application={_.get(member, 'application')}
                key={_.get(member, 'id')}
              />
            ))}
          </SimpleGrid>
        </InfiniteScroll>
      </SiteLayout>
    </>
  );
};

export default MemberList;
