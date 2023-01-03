import _ from 'lodash';
import {
  Flex,
  Heading,
  Button,
  Stack,
  Spacer,
  Badge,
  Box,
} from '@raidguild/design-system';
import { useMediaQuery } from '@chakra-ui/react';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import useConsultationDetail from '../../hooks/useConsultationDetail';
import useConsultationUpdate from '../../hooks/useConsultationUpdate';
import SiteLayout from '../../components/SiteLayout';
import RaidDetailsCard from '../../components/RaidDetailsCard';
import useRaidCreate from '../../hooks/useRaidCreate';

const Consultation = () => {
  const { data: session } = useSession();
  const token = _.get(session, 'token');
  const router = useRouter();

  const { data: consultation } = useConsultationDetail({
    token,
    consultationId: _.get(router, 'query.consultation'),
  });
  const { mutateAsync: updateConsultation } = useConsultationUpdate({ token });
  const { mutateAsync: createRaid } = useRaidCreate({ token });

  const [upTo780] = useMediaQuery('(max-width: 780px)');
  console.log(consultation);

  const handleCreateRaid = async () => {
    console.log('Create Raid');
    await createRaid({
      consultation_id: _.get(consultation, 'id'),
      name: _.get(consultation, 'name'),
      status_key: 'PREPARING',
      category_key: 'FULL_STACK',
    });
  };

  const handleCancelConsultation = async () => {
    console.log('Cancel Consultation');
    await updateConsultation({
      id: _.get(consultation, 'id'),
      update: {
        consultation_status_key: 'CANCELLED',
      },
    });
  };

  const ConsultationButtons = () => (
    <Stack>
      <Button onClick={handleCreateRaid}>Create Raid</Button>
      <Button variant='outline' onClick={handleCancelConsultation}>
        Cancel Consultation
      </Button>
    </Stack>
  );

  return (
    <>
      <NextSeo title={_.get(consultation, 'name')} />

      <SiteLayout
        subheader={
          <Flex w='100%' justify='space-between' align='center'>
            <Spacer />
            <Heading>{_.get(consultation, 'name')}</Heading>
            <Spacer />
            <Box>
              <Badge>
                {_.get(consultation, 'consultationStatus.consultationStatus')}
              </Badge>
            </Box>
          </Flex>
        }
        isLoading={false}
      >
        <Flex
          align='flex-start'
          width='100%'
          direction={['column', null, null, 'row']}
          gap={6}
        >
          {upTo780 && <ConsultationButtons />}
          <RaidDetailsCard consultation={consultation} />
          {!upTo780 && <ConsultationButtons />}
        </Flex>
      </SiteLayout>
    </>
  );
};

export default Consultation;
