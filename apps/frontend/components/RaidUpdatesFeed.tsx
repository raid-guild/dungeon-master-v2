import React, { useState, useEffect, useMemo } from 'react';
import _ from 'lodash';
import {
  Flex,
  Box,
  Stack,
  Button,
  Text,
  Textarea,
  HStack,
  Heading,
  useToast,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
} from '@raidguild/design-system';
import { useForm } from 'react-hook-form';
import { IStatusUpdate, IRaid } from '../utils';
import RaidUpdate from './RaidUpdates';
// import { isAfter } from 'date-fns';
// import { useAccount } from 'wagmi';
import useUpdateCreate from '../hooks/useUpdateCreate';
import { useSession } from 'next-auth/react';
// import { useInjectedProvider } from '../contexts/InjectedProviderContexts';

interface UpdatesProps {
  raid: IRaid;
}

const RaidUpdatesFeed: React.FC<UpdatesProps> = ({ raid }) => {
  // const { userData } = useInjectedProvider();
  // console.log(raid);
  const updates = _.get(raid, 'updates', null);
  // const { address } = useAccount();
  const { data: session } = useSession();
  const localForm = useForm();
  const { handleSubmit, setValue } = localForm;
  const toast = useToast();
  const [addUpdate, setAddUpdate] = useState<boolean>(false);
  const [expanded, setExpanded] = useState(false);
  const [sortedUpdates, setSortedUpdates] = useState<any[]>();
  const token: string = _.get(session, 'token', '');
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
  }, [updates]);

  const showUpdateBox = () => {
    setAddUpdate(true);
  };

  const clearUpdate = () => {
    setAddUpdate(false);
    setValue('update', '');
  };

  const submitNewUpdate = async (values: any) => {
    console.log(values);
    mutateAsync({
      update: values.update,
      raidId: raid.id,
    });
    setValue('update', '');
    setAddUpdate(false);

    // const result = await createRecord('update', {
    //   update: values.update,
    //   member: userData.member.id,
    //   raid: raidId,
    // });
  };

  return (
    <Flex
      direction="column"
      width="100%"
      justifyContent="center"
      padding={8}
      bg="gray.800"
      rounded="md"
    >
      <Flex>
        <Flex direction="row" align="center" justify="space-between" w="100%">
          <Heading size="md" color="white">
            Status Updates
          </Heading>
          <Box>
            {addUpdate ? (
              <HStack>
                <Button onClick={clearUpdate} variant="outline">
                  Cancel
                </Button>
                <Button type="submit" form="updateForm">
                  Submit
                </Button>
              </HStack>
            ) : (
              <Button onClick={showUpdateBox}>Add Update</Button>
            )}
          </Box>
        </Flex>
      </Flex>

      <Flex my={4} w="100%">
        {addUpdate && (
          <Box
            as="form"
            id="updateForm"
            onSubmit={handleSubmit(submitNewUpdate)}
            w="100%"
          >
            <Stack spacing={4} w="100%">
              <Textarea
                name="update"
                label="Update"
                localForm={localForm}
                placeholder="This raid has encountered Moloch."
              />
            </Stack>
          </Box>
        )}
      </Flex>
      {updatesCount > 0 &&
        sortedUpdates
          ?.slice(0, updatesCount > 4 ? 1 : updatesCount)
          .map((c: IStatusUpdate) => (
            <Stack as="ul" width="100%" key={c.createdAt}>
              <RaidUpdate
                // id={c.id}
                update={c.update}
                member={c.member}
                createdAt={c.createdAt}
                // modifiedAt={c.modifiedAt}
              />
            </Stack>
          ))}
      {updatesCount > 4 && (
        <Accordion allowMultiple onChange={() => setExpanded(!expanded)}>
          <AccordionItem border="none" key={0}>
            <h2>
              <AccordionButton color="raid" paddingInline={0}>
                <Box flex="1" textAlign="left" color="raid">
                  {expanded ? 'Hide' : 'Reveal'} {sortedUpdates?.length - 1}{' '}
                  Comments
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel padding={0}>
              {sortedUpdates?.slice(1).map((c) => (
                <Stack as="ul" width="100%" key={c.createdAt}>
                  <RaidUpdate
                    // id={c.id}
                    update={c.update}
                    member={c.member}
                    createdAt={c.createdAt}
                    // modifiedAt={c.modifiedAt}
                  />
                </Stack>
              ))}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      )}
      {!sortedUpdates?.length && (
        <Flex align="center" justify="center" w="100%" h="100px">
          <Text>Leave the first update about this raid.</Text>
        </Flex>
      )}
    </Flex>
  );
};

export default RaidUpdatesFeed;
