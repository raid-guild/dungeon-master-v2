import { useState } from 'react';
import _ from 'lodash';
import {
  Stack,
  Heading,
  Spinner,
  Flex,
  // Select
} from '@raidguild/design-system';
import { Select as ChakraSelect } from '@chakra-ui/react';
import { NextSeo } from 'next-seo';
import InfiniteScroll from 'react-infinite-scroller';
import useDefaultTitle from '../hooks/useDefaultTitle';
import useRaidList from '../hooks/useRaidList';
import RaidCard from '../components/RaidCard';
import { IRaid } from '../utils';
import SiteLayout from '../components/SiteLayout';
import { useSession } from 'next-auth/react';
import { RAID_STATUS } from '../utils';

const raidStatusMapped = RAID_STATUS.map((status) => ({
  label: status,
  value: status.toUpperCase(),
}));

const raidStatusOptions = [
  ...[{ label: 'Active', value: 'ACTIVE' }],
  ...raidStatusMapped,
];

console.log('raidStatusOptions', raidStatusOptions);

const RaidList = () => {
  // const [raidStatusFilter, setRaidStatusFilter] = useState(
  //   raidStatusMapped[0].value
  // );
  const [raidStatusFilter, setRaidStatusFilter] = useState<string>('ACTIVE');
  const title = useDefaultTitle();
  const { data: session } = useSession();
  const token = _.get(session, 'token');

  const handleRaidStatusFilterChange = async (status: string) => {
    setRaidStatusFilter(status);
  };

  const { data, error, fetchNextPage, hasNextPage } = useRaidList({
    token,
    raidStatusFilterKey: raidStatusFilter,
  });

  const raids = _.flatten(_.get(data, 'pages'));

  return (
    <>
      <NextSeo title="Raids List" />

      <SiteLayout
        isLoading={!data}
        data={raids}
        subheader={<Heading>{title}</Heading>}
        error={error}
      >
        <ChakraSelect
          name="raidCategory"
          value={raidStatusFilter}
          defaultValue={raidStatusOptions['Active']}
          onChange={(e) => {
            console.log('e', e.target.value);
            handleRaidStatusFilterChange(e.target.value);
          }}
        >
          {raidStatusOptions.map((status) => (
            <option key={status.value}>{status.value}</option>
          ))}
        </ChakraSelect>
        <InfiniteScroll
          pageStart={0}
          loadMore={fetchNextPage}
          hasMore={hasNextPage}
          loader={
            <Flex my={25} w="100%" justify="center" key={1}>
              <Spinner size="xl" my={50} />
            </Flex>
          }
        >
          <Stack spacing={4} mx="auto" key={2}>
            {_.map(raids, (raid: IRaid) => (
              <RaidCard
                raid={raid}
                consultation={_.get(raid, 'consultation')}
                key={_.get(raid, 'id')}
              />
            ))}
          </Stack>
        </InfiniteScroll>
      </SiteLayout>
    </>
  );
};

export default RaidList;
