import _ from 'lodash';
import { Stack, Heading, HStack } from '@raidguild/design-system';
import { NextSeo } from 'next-seo';
import useRaidDetail from '../../hooks/useRaidDetail';
import RaidDetailsCard from '../../components/RaidDetailsCard';

const Raid = () => {
  const { data: raid } = useRaidDetail();
  console.log(raid);

  return (
    <>
      <NextSeo title="Raid" />

      <Stack w="60%" mx="auto">
        <Heading>{_.get(raid, 'name')}</Heading>
        <HStack>
          <RaidDetailsCard
            id={_.get(raid, 'id')}
            category={_.get(raid, 'category')}
            consultation={_.get(raid, 'consultationByConsultation')}
          />
        </HStack>
      </Stack>
    </>
  );
};

export default Raid;
