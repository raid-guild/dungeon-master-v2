import _ from 'lodash';
import { Heading, HStack } from '@raidguild/design-system';
import { NextSeo } from 'next-seo';
import useRaidDetail from '../../hooks/useRaidDetail';
import RaidDetailsCard from '../../components/RaidDetailsCard';
import SiteLayout from '../../components/SiteLayout';
import { useSession } from 'next-auth/react';

const Raid = () => {
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { data: raid } = useRaidDetail({ token });
  console.log(raid);

  return (
    <>
      <NextSeo title="Raid" />

      <SiteLayout
        subheader={<Heading>{_.get(raid, 'name')}</Heading>}
        isLoading={!raid}
        data={raid}
      >
        <HStack maxW="60%" mx="auto">
          <RaidDetailsCard
            id={_.get(raid, 'id')}
            category={_.get(raid, 'category')}
            consultation={_.get(raid, 'consultationByConsultation')}
          />
        </HStack>
      </SiteLayout>
    </>
  );
};

export default Raid;
