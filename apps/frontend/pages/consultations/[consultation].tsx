import _ from 'lodash';
import { Flex, Heading, Button } from '@raidguild/design-system';
import { useMediaQuery } from '@chakra-ui/react';
import { NextSeo } from 'next-seo';
import { useSession } from 'next-auth/react';
import useConsultationDetail from '../../hooks/useConsultationDetail';
import SiteLayout from '../../components/SiteLayout';
import RaidDetailsCard from '../../components/RaidDetailsCard';

const Consultation = () => {
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const { data: consultation } = useConsultationDetail({ token });

  const [upTo780] = useMediaQuery('(max-width: 780px)');

  return (
    <>
      <NextSeo title={_.get(consultation, 'name')} />

      <SiteLayout
        subheader={<Heading>{_.get(consultation, 'name')}</Heading>}
        isLoading={false}
      >
        <Flex
          align="flex-start"
          width="100%"
          direction={['column', null, null, 'row']}
          gap={6}
        >
          {upTo780 && <Button>Create Raid</Button>}
          <RaidDetailsCard consultation={consultation} />
          {!upTo780 && <Button>Create Raid</Button>}
        </Flex>
      </SiteLayout>
    </>
  );
};

export default Consultation;
