/* eslint-disable react/no-unstable-nested-components */
// TODO fix nested component
import _ from 'lodash';
import {
  Flex,
  Heading,
  Button,
  Stack,
  Spacer,
  Badge,
  Box,
  useMediaQuery,
} from '@raidguild/design-system';
import { NextSeo } from 'next-seo';
import { useSession } from 'next-auth/react';
import { GetServerSidePropsContext } from 'next';
import {
  useConsultationDetail,
  useConsultationUpdate,
  useRaidCreate,
} from '@raidguild/dm-hooks';

import SiteLayout from '../../components/SiteLayout';
import RaidDetailsCard from '../../components/RaidDetailsCard';

type Props = {
  consultationId: string;
};

const Consultation = ({ consultationId }: Props) => {
  const { data: session } = useSession();
  const token = _.get(session, 'token');

  const { data: consultation } = useConsultationDetail({
    token,
    consultationId,
  });
  const { mutateAsync: updateConsultation } = useConsultationUpdate({ token });
  const { mutateAsync: createRaid } = useRaidCreate({ token });

  const [upTo780] = useMediaQuery('(max-width: 780px)');

  const handleCreateRaid = async () => {
    await createRaid({
      consultation_id: _.get(consultation, 'id'),
      name: _.get(consultation, 'name'),
      status_key: 'PREPARING',
      category_key: 'FULL_STACK',
    });
  };

  const handleCancelConsultation = async () => {
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

// * use SSR to fetch query params for RQ invalidation
export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { consultation } = context.params;

  return {
    props: {
      consultationId: consultation || null,
    },
  };
};

export default Consultation;
