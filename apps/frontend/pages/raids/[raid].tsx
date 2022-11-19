import _ from 'lodash';
import { Stack, Heading } from '@raidguild/design-system';
import { NextSeo } from 'next-seo';
import useDefaultTitle from '../../hooks/useDefaultTitle';
import useRaidDetail from '../../hooks/useRaidDetail';

const Raid = () => {
  const title = useDefaultTitle();
  const { data: raid } = useRaidDetail();
  console.log(raid);

  return (
    <>
      <NextSeo title="Raid" />

      <Stack spacing={8} align="center">
        <Heading>{title} Detail</Heading>
        <Heading size="md">{_.get(raid, 'name')}</Heading>
      </Stack>
    </>
  );
};

export default Raid;
