import { Split, SplitRecipient } from '@0xsplits/splits-sdk-react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Card,
  Divider,
  Flex,
  Heading,
  HStack,
  Icon,
  Spinner,
  Stack,
  Text,
} from '@raidguild/design-system';
import { truncateAddress } from '@raidguild/dm-utils';
import { useSplitEarnings, useSplitsMetadata } from '@raidguild/escrow-hooks';
import {
  handleFormattedBalance,
  NETWORK_CONFIG,
  splitsLink,
} from '@raidguild/escrow-utils';
import blockies from 'blockies-ts';
import _ from 'lodash';
import { useSession } from 'next-auth/react';
import React, { useMemo } from 'react';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { formatUnits } from 'viem';
import { useContractRead } from 'wagmi';

import ChakraNextLink from '../ChakraNextLink';
import AccountLink from './shared/AccountLink';

const WXDAI_ADDRESS = '0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d';

// TODO handle other tokens in splits balances

const NestedSplit = ({
  chainId,
  recipient,
  currentSplitMetadata,
}: {
  chainId: number;
  recipient: SplitRecipient;
  currentSplitMetadata: Split;
}) => {
  const { data: subControllerIsSafe } = useContractRead({
    address: _.get(currentSplitMetadata, 'controller.address'),
    abi: [
      {
        inputs: [],
        name: 'VERSION',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    functionName: 'VERSION',
    args: [],
  });
  const { data: splitEarnings } = useSplitEarnings({
    address: _.get(currentSplitMetadata, 'address'),
    chainId,
  });
  // todo handle other tokens, ideally SplitsKit will do this
  const wxdaiBalance = useMemo(() => {
    const activeBalances = _.get(splitEarnings, 'activeBalances');
    if (!activeBalances || !activeBalances[WXDAI_ADDRESS]) return '0';
    return handleFormattedBalance(
      formatUnits(activeBalances[WXDAI_ADDRESS], 18) || '0'
    );
  }, [splitEarnings]);

  return (
    <Accordion allowToggle>
      <AccordionItem border='none'>
        <AccordionButton w='100%' px={0}>
          <Flex justify='space-between' w='100%'>
            <HStack>
              <AccordionIcon />
              <AccountLink
                key={_.get(recipient, 'recipient.address')}
                address={_.get(recipient, 'recipient.address')}
                isSplit
                chainId={chainId}
              />
              <Text fontFamily='spaceMono' fontSize='xs'>
                ({_.size(currentSplitMetadata.recipients)})
              </Text>
            </HStack>

            <Text fontFamily='spaceMono'>
              {_.get(recipient, 'percentAllocation')}%
            </Text>
          </Flex>
        </AccordionButton>
        <AccordionPanel
          px={2}
          borderLeft='1px solid'
          borderLeftColor='primary.500'
        >
          <Stack spacing={1}>
            <Text fontSize='10px' color='primary.500' textTransform='uppercase'>
              Recipients ({_.size(currentSplitMetadata.recipients)})
            </Text>
            {_.map(
              _.get(currentSplitMetadata, 'recipients'),
              (subRecipient) => (
                <Flex
                  justify='space-between'
                  w='100%'
                  key={_.get(subRecipient, 'recipient.address')}
                >
                  <AccountLink
                    address={_.get(subRecipient, 'recipient.address')}
                    chainId={chainId}
                  />
                  <Text fontFamily='spaceMono'>
                    {_.get(subRecipient, 'percentAllocation')}%
                  </Text>
                </Flex>
              )
            )}
            <Flex justify='space-between'>
              <Text
                color='primary.500'
                textTransform='uppercase'
                fontSize='10px'
              >
                Balance
              </Text>
              <Text fontFamily='spaceMono' fontSize='sm'>
                {wxdaiBalance} WXDAI
              </Text>
            </Flex>
            <Flex justify='space-between'>
              <Text
                color='primary.500'
                textTransform='uppercase'
                fontSize='10px'
              >
                Controller
              </Text>

              <AccountLink
                address={_.get(currentSplitMetadata, 'controller.address')}
                chainId={chainId}
                isSafe={!!subControllerIsSafe}
              />
            </Flex>
          </Stack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

const ReceiverSplits = ({
  initialSplitMetadata,
  chainId,
  isLoading,
}: {
  initialSplitMetadata: Split;
  chainId: number;
  isLoading: boolean;
}) => {
  const { data: session } = useSession();
  const potentialSplitsAddresses = useMemo(
    () =>
      _.map(_.get(initialSplitMetadata, 'recipients'), (recipient) =>
        _.get(recipient, 'recipient.address')
      ),
    [initialSplitMetadata]
  );

  const { data: splitsMetadata, isLoading: splitsIsLoading } =
    useSplitsMetadata({
      splits: potentialSplitsAddresses,
      chainId,
    });
  const { data: splitEarnings } = useSplitEarnings({
    address: _.get(initialSplitMetadata, 'address'),
    chainId,
  });
  // todo handle other tokens, ideally SplitsKit will do this
  const wxdaiBalance = useMemo(() => {
    const activeBalances = _.get(splitEarnings, 'activeBalances');
    if (!activeBalances || !activeBalances[WXDAI_ADDRESS]) return '0';
    return handleFormattedBalance(
      formatUnits(activeBalances[WXDAI_ADDRESS], 18)
    );
  }, [splitEarnings]);

  const { data: controllerIsSafe } = useContractRead({
    address: _.get(initialSplitMetadata, 'controller.address'),
    abi: [
      {
        inputs: [],
        name: 'VERSION',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    functionName: 'VERSION',
    args: [],
  });
  const splitAvatar =
    initialSplitMetadata &&
    blockies
      .create({
        seed: _.toLower(_.get(initialSplitMetadata, 'address')),
      })
      .toDataURL();

  if (
    isLoading ||
    !_.includes(session.user.roles, 'member') ||
    !initialSplitMetadata
  )
    return null;

  return (
    <Card variant='filled'>
      <Stack w='100%'>
        <Stack w='100%' spacing={4}>
          <Flex justify='space-between' align='center'>
            <ChakraNextLink
              href={splitsLink(initialSplitMetadata.address, chainId)}
              isExternal
            >
              <HStack>
                <Avatar
                  src={splitAvatar}
                  boxSize='30px'
                  ring='1px'
                  ringColor='white'
                />
                <Heading size='sm'>0xSplit</Heading>
                <Text fontFamily='spaceMono'>
                  ({truncateAddress(initialSplitMetadata.address)})
                </Text>
                <Icon
                  as={FaExternalLinkAlt}
                  boxSize='0.65rem'
                  color='purple.400'
                />
              </HStack>
            </ChakraNextLink>

            <Stack spacing='2px' maxW='55px'>
              <Text fontSize='xs' color='purple.400'>
                Balance
              </Text>
              <Text fontFamily='spaceMono' fontSize='xs' noOfLines={1}>
                {wxdaiBalance} WXDAI
              </Text>
            </Stack>
          </Flex>
          {splitsIsLoading && !initialSplitMetadata ? (
            <Flex justify='center' py={10}>
              <Spinner />
            </Flex>
          ) : (
            <Stack w='100%'>
              <Text color='purple.400' textTransform='uppercase' fontSize='xs'>
                Recipients ({_.size(_.get(initialSplitMetadata, 'recipients'))})
              </Text>
              <Stack spacing={1}>
                {_.map(
                  _.get(initialSplitMetadata, 'recipients'),
                  (recipient: SplitRecipient) => {
                    const daoAddresses = [NETWORK_CONFIG[chainId].DAO_ADDRESS];
                    const isDao = _.includes(
                      daoAddresses,
                      _.get(recipient, 'recipient.address')
                    );
                    const nestedSplit = _.find(splitsMetadata, {
                      address: _.get(recipient, 'recipient.address'),
                    });
                    if (nestedSplit) {
                      return (
                        <NestedSplit
                          chainId={chainId}
                          recipient={recipient}
                          currentSplitMetadata={nestedSplit}
                          key={_.get(recipient, 'recipient.address')}
                        />
                      );
                    }

                    return (
                      <Flex
                        justify='space-between'
                        key={_.get(recipient, 'recipient.address')}
                      >
                        <AccountLink
                          address={_.get(recipient, 'recipient.address')}
                          name={isDao ? 'Raid Guild DAO' : undefined}
                          chainId={chainId}
                        />
                        <Text fontFamily='spaceMono'>
                          {_.get(recipient, 'percentAllocation')}%
                        </Text>
                      </Flex>
                    );
                  }
                )}
              </Stack>
              <Divider color='whiteAlpha.600' />
              <Flex justify='space-between'>
                <Text
                  color='purple.400'
                  textTransform='uppercase'
                  fontSize='xs'
                >
                  Controller
                </Text>

                <AccountLink
                  address={_.get(initialSplitMetadata, 'controller.address')}
                  chainId={chainId}
                  isSafe={!!controllerIsSafe}
                />
              </Flex>
            </Stack>
          )}
        </Stack>
        <Flex justify='flex-end'>
          <ChakraNextLink href='https://splits.org' isExternal>
            <HStack align='center'>
              <Text fontSize='xs' textTransform='uppercase'>
                powered by Splits
              </Text>
              <Icon
                as={FaExternalLinkAlt}
                boxSize='0.55rem'
                color='purple.400'
              />
            </HStack>
          </ChakraNextLink>
        </Flex>
      </Stack>
    </Card>
  );
};

export default ReceiverSplits;
