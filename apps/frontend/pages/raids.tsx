import _ from 'lodash';
import { Stack, Heading } from '@raidguild/design-system';
import { NextSeo } from 'next-seo';
import useDefaultTitle from '../hooks/useDefaultTitle';
import useRaidList from '../hooks/useRaidList';
import Link from '../components/ChakraNextLink';

const RaidList = () => {
  const title = useDefaultTitle();
  const { data: raids } = useRaidList();

  return (
    <>
      <NextSeo title="Raids List" />

      <Stack spacing={8} align="center">
        <Heading>{title}</Heading>
        <Stack spacing={4}>
          {_.map(raids, (raid) => (
            <Link href={`/raids/${_.get(raid, 'id')}`} key={_.get(raid, 'id')}>
              <Heading size="md">{_.get(raid, 'name')}</Heading>
            </Link>
          ))}
        </Stack>
      </Stack>
    </>
  );
};

export default RaidList;
