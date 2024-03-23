/* eslint-disable no-nested-ternary */
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Stack,
  Text,
  Textarea,
  useMediaQuery,
} from '@raidguild/design-system';
import { useUpdateCreate } from '@raidguild/dm-hooks';
import { IRaid, IStatusUpdate, IEscrowEvent } from '@raidguild/dm-types';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaPlus } from 'react-icons/fa';

import RaidUpdate from './RaidUpdates';
import { useEscrowEvents } from '@raidguild/escrow-hooks';
import { RaidEscrowUpdate } from './RaidEscrowUpdate';

interface UpdatesProps {
  raid: IRaid;
}

const RaidUpdatesFeed = ({ raid }: UpdatesProps) => {
  const { data: session } = useSession();
  const localForm = useForm();
  const { handleSubmit, setValue } = localForm;
  const [addUpdate, setAddUpdate] = useState<boolean>(false);
  const [expanded, setExpanded] = useState(false);
  const [sortedUpdates, setSortedUpdates] =
    useState<(IStatusUpdate & IEscrowEvent)[]>();
  const token: string = _.get(session, 'token', '');
  const { data } = useEscrowEvents(raid?.invoiceAddress);
  const { events: escrowUpdates, totalMileStones } = data;
  const updxts = _.get(raid, 'updates', null);
  const updates = [...updxts, ...escrowUpdates];

  const { mutateAsync } = useUpdateCreate({
    token,
    memberId: _.get(session, 'user.id'),
  });

  const updatesCount = useMemo(() => {
    if (!sortedUpdates) return 0;
    return sortedUpdates.length;
  }, [sortedUpdates]);

  useEffect(() => {
    if (!_.isEmpty(updates)) {
      setSortedUpdates(_.orderBy(updates, ['createdAt'], ['desc']));
    }
  }, [updates?.length]);

  const showUpdateBox = () => {
    setAddUpdate(true);
  };

  const clearUpdate = () => {
    setAddUpdate(false);
    setValue('update', '');
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const submitNewUpdate = async (values: any) => {
    mutateAsync({
      update: values.update,
      raidId: raid.id,
    });
    setValue('update', '');
    setAddUpdate(false);
  };

  const [upTo780] = useMediaQuery('(max-width: 780px)');
  const count = _.size(sortedUpdates);

  return (
    <Card variant='filled' padding={2}>
      <Flex w='100%'>
        <Flex direction='row' align='center' justify='space-between' w='100%'>
          <Heading size='md' color='white'>
            Status Updates
          </Heading>

          <Box>
            {addUpdate ? (
              <HStack>
                <Button onClick={clearUpdate} variant='outline'>
                  Cancel
                </Button>
                <Button type='submit' form='updateForm'>
                  Submit
                </Button>
              </HStack>
            ) : upTo780 ? (
              <IconButton
                icon={<Icon as={FaPlus} />}
                onClick={showUpdateBox}
                aria-label='Add new update'
              />
            ) : (
              <Button onClick={showUpdateBox}>Add Update</Button>
            )}
          </Box>
        </Flex>
      </Flex>

      {addUpdate && (
        <Flex my={4} w='100%'>
          <Box
            as='form'
            id='updateForm'
            onSubmit={handleSubmit(submitNewUpdate)}
            w='100%'
          >
            <Stack spacing={4} w='100%'>
              <Textarea
                name='update'
                label='Update'
                localForm={localForm}
                placeholder='This raid has encountered Moloch.'
              />
            </Stack>
          </Box>
        </Flex>
      )}
      {updatesCount > 0 &&
        sortedUpdates
          ?.slice(0, updatesCount > 4 ? 1 : updatesCount)
          .map((c: IStatusUpdate & IEscrowEvent) => (
            <Stack as='ul' width='100%' key={c?.createdAt}>
              {c?.member ? (
                <RaidUpdate
                  // id={c.id}
                  update={c?.update}
                  member={c?.member}
                  createdAt={c?.createdAt}
                  // modifiedAt={c.modifiedAt}
                />
              ) : (
                <RaidEscrowUpdate
                  type={c?.type}
                  createdAt={c?.createdAt}
                  milestone={c?.milestone}
                  amount={c?.amount}
                  sender={c?.sender}
                  txHash={c?.txHash}
                  totalMileStones={totalMileStones}
                />
              )}
            </Stack>
          ))}
      {updatesCount > 4 && (
        <Accordion
          allowMultiple
          onChange={() => setExpanded(!expanded)}
          width='full'
        >
          <AccordionItem border='none' key={0}>
            <h2>
              <AccordionButton color='raid' paddingInline={0}>
                <Box flex='1' textAlign='left' color='raid'>
                  {expanded ? 'Hide' : 'Reveal'} {count - 1} Comments
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel padding={0}>
              {sortedUpdates
                ?.slice(1)
                .map((c: IStatusUpdate & IEscrowEvent) => (
                  <Stack as='ul' width='100%' key={c?.createdAt}>
                    {c?.member ? (
                      <RaidUpdate
                        // id={c.id}
                        update={c?.update}
                        member={c?.member}
                        createdAt={c?.createdAt}
                        // modifiedAt={c.modifiedAt}
                      />
                    ) : (
                      <RaidEscrowUpdate
                        type={c?.type}
                        createdAt={c?.createdAt}
                        milestone={c?.milestone}
                        amount={c?.amount}
                        sender={c?.sender}
                        txHash={c?.txHash}
                        totalMileStones={totalMileStones}
                      />
                    )}
                  </Stack>
                ))}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      )}
      {!sortedUpdates?.length && (
        <Flex align='center' justify='center' w='100%' h='100px'>
          <Text>Leave the first update about this raid.</Text>
        </Flex>
      )}
    </Card>
  );
};

export default RaidUpdatesFeed;
