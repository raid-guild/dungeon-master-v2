/* eslint-disable react/no-unstable-nested-components */
// TODO fix nested component
import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  HStack,
  Icon,
  Spacer,
  Stack,
  Text,
  useMediaQuery,
} from '@raidguild/design-system';
import {
  useConsultationDetail,
  useConsultationUpdate,
  useRaidCreate,
} from '@raidguild/dm-hooks';
import { IRaid } from '@raidguild/dm-types';
import _ from 'lodash';
import { GetServerSidePropsContext } from 'next';
import { useSession } from 'next-auth/react';
import { NextSeo } from 'next-seo';
import { BsArrowRight } from 'react-icons/bs';

import ChakraNextLink from '../../components/ChakraNextLink';
import RaidDetailsCard from '../../components/RaidDetailsCard';
import SiteLayout from '../../components/SiteLayout';

type Props = {
  consultationId: string;
};

const MiniRaidCard = ({ raid }: { raid: IRaid }) => (
  <Card variant='filled' minW='300px'>
    <Stack spacing={4} w='100%'>
      <Stack spacing={1}>
        <Text fontFamily='mono' size='sm'>
          Raid:
        </Text>
        <Heading size='sm'>{_.get(raid, 'name')}</Heading>
      </Stack>

      <HStack>
        <Text>Status:</Text>
        <Text fontSize='lg'>{_.get(raid, 'raidStatus.raidStatus')}</Text>
      </HStack>
      <Flex justify='end'>
        <ChakraNextLink href={`/raids/${raid?.id}`}>
          <Button variant='outline' rightIcon={<Icon as={BsArrowRight} />}>
            Go to Raid
          </Button>
        </ChakraNextLink>
      </Flex>
    </Stack>
  </Card>
);

const Consultation = ({ consultationId }: Props) => {
  const { data: session } = useSession();
  const token = _.get(session, 'token');

  const { data: consultation, isLoading } = useConsultationDetail({
    token,
    consultationId,
  });
  const { mutateAsync: updateConsultation } = useConsultationUpdate({ token });
  const { mutateAsync: createRaid } = useRaidCreate({ token });

  const [upTo780] = useMediaQuery('(max-width: 780px)');
  const raid = _.get(consultation, 'raids[0]');

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
                {_.get(raid, 'name')
                  ? 'Accepted'
                  : _.get(
                      consultation,
                      'consultationStatus.consultationStatus'
                    )}
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
          {!isLoading &&
            upTo780 &&
            (!raid ? <ConsultationButtons /> : <MiniRaidCard raid={raid} />)}
          <RaidDetailsCard consultation={consultation} />
          {!isLoading &&
            !upTo780 &&
            (!raid ? <ConsultationButtons /> : <MiniRaidCard raid={raid} />)}
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
