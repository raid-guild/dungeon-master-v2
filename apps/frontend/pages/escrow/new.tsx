import {
  Alert,
  AlertIcon,
  Button,
  Heading,
  HStack,
  Image,
  Spinner,
  Stack,
  Text,
} from '@raidguild/design-system';
import { useRaidDetail } from '@raidguild/dm-hooks';
import { chainIdToIconMap, chainsMap } from '@raidguild/dm-utils';
import _ from 'lodash';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { NextSeo } from 'next-seo';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Hex } from 'viem';
import { useChainId, useSwitchChain } from 'wagmi';
import { gnosis, optimism } from 'wagmi/chains';

import Link from '../../components/ChakraNextLink';
import EscrowConfirmation from '../../components/Escrow/EscrowConfirmation';
import EscrowDetailsForm from '../../components/Escrow/EscrowDetailsForm';
import EscrowSuccess from '../../components/Escrow/EscrowSuccess';
import PaymentsForm from '../../components/Escrow/PaymentsForm';
import ProjectDetailsForm from '../../components/Escrow/ProjectDetailsForm';
import ProjectInfo from '../../components/Escrow/ProjectInfo';
import RaidPartySplitForm from '../../components/Escrow/RaidPartySplitForm';
import SiteLayout from '../../components/SiteLayout';

const SMART_INVOICE_URL = 'https://smartinvoice.xyz';

const NewEscrow = () => {
  const escrowForm = useForm();
  const router = useRouter();
  const { data: session } = useSession();

  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const [txHash, setTxHash] = useState<Hex>();

  const chainIdParam = Number(_.get(router, 'query.chainId'));
  const raidId = _.get(router, 'query.raidId') as string;
  const token = _.get(session, 'token');

  const [step, setStep] = useState<number | undefined>();

  const updateStep = (increment?: number) => {
    if (_.isNumber(increment)) setStep((prev) => prev + increment);
    else setStep((prev) => prev + 1);
  };

  const backStep = (increment?: number) => {
    if (_.isNumber(increment)) setStep((prev) => prev - increment);
    else setStep((prev) => prev - 1);
  };

  const { data: raid } = useRaidDetail({
    raidId,
    token,
    roles: _.get(session, 'user.roles'),
  });

  useEffect(() => {
    setStep(raidId ? 1 : 0);
  }, [raidId]);

  if (Number.isNaN(chainIdParam)) {
    return (
      <>
        <NextSeo title='Escrow' />

        <SiteLayout subheader={<Heading>Register a new escrow</Heading>}>
          <Stack mt='6' w='70%' minW='650px' minH='450px' spacing={6}>
            {raid && <ProjectInfo raid={raid} />}
            <Text mt={8} textAlign='center'>
              Pick one of RaidGuild&apos;s supported networks.
            </Text>
            <HStack justifyContent='center' w='100%'>
              <Button
                onClick={() => {
                  if (raidId) {
                    router.push(`/escrow/new?raidId=${raidId}&chainId=100`);
                  } else {
                    router.push(`/escrow/new?chainId=100`);
                  }
                }}
              >
                <HStack spacing={2} align='center'>
                  <Image
                    alt={gnosis.name ?? 'Chain icon'}
                    src={chainIdToIconMap(gnosis.id)}
                    boxSize='20px'
                  />
                  <Text>Gnosis</Text>
                </HStack>
              </Button>
              <Button
                onClick={() => {
                  router.push(`/escrow/new?raidId=${raidId}&chainId=10`);
                }}
                isDisabled={!raidId}
              >
                <HStack spacing={2} align='center'>
                  <Image
                    alt={optimism.name ?? 'Chain icon'}
                    src={chainIdToIconMap(optimism.id)}
                    boxSize='25px'
                  />
                  <Text>Optimism</Text>
                </HStack>
              </Button>
            </HStack>
          </Stack>
        </SiteLayout>
      </>
    );
  }

  if (chainId !== chainIdParam) {
    return (
      <>
        <NextSeo title='Escrow' />

        <SiteLayout subheader={<Heading>Register a new escrow</Heading>}>
          <Stack mt='6' w='70%' minW='650px' minH='450px' spacing={6}>
            {raid && <ProjectInfo raid={raid} />}
            <Alert
              flexDirection='column'
              gap={6}
              mb='4'
              p={8}
              status='error'
              textAlign='center'
            >
              <AlertIcon boxSize='40px' />
              {chainsMap(chainIdParam)?.name ? (
                <Text>
                  Please switch to the{' '}
                  <Text
                    as='span'
                    color='red'
                    onClick={() => switchChain({ chainId: chainIdParam })}
                    _hover={{ cursor: 'pointer', textDecor: 'underline' }}
                  >
                    {chainsMap(chainIdParam).name}
                  </Text>{' '}
                  network to register an escrow.
                </Text>
              ) : (
                <Text>
                  Please switch to the correct network to register an escrow.
                </Text>
              )}
            </Alert>
          </Stack>
        </SiteLayout>
      </>
    );
  }

  return (
    <>
      <NextSeo title='Escrow' />

      <SiteLayout subheader={<Heading>Register a new escrow</Heading>}>
        <Stack mt='6' w='70%' minW='650px' minH='450px' spacing={6}>
          {raid && <ProjectInfo raid={raid} />}

          {!step && step !== 0 && <Spinner />}

          {step === 0 && (
            <ProjectDetailsForm
              escrowForm={escrowForm}
              updateStep={updateStep}
            />
          )}

          {step === 1 && (
            <EscrowDetailsForm
              escrowForm={escrowForm}
              updateStep={updateStep}
              backStep={backStep}
              raid={raid}
            />
          )}
          {step === 2 && (
            <RaidPartySplitForm
              escrowForm={escrowForm}
              updateStep={updateStep}
              backStep={backStep}
            />
          )}
          {step === 3 && (
            <PaymentsForm
              escrowForm={escrowForm}
              updateStep={updateStep}
              backStep={backStep}
            />
          )}
          {step === 4 && (
            <EscrowConfirmation
              escrowForm={escrowForm}
              raid={raid}
              setTxHash={setTxHash}
              updateStep={updateStep}
              backStep={backStep}
            />
          )}
          {step === 5 && <EscrowSuccess raidId={raidId} txHash={txHash} />}
          {(step === 0 || step === 1) && (
            <Text fontSize='sm' color='whiteAlpha.700'>
              The Raid Guild escrow uses{' '}
              <Link
                href={SMART_INVOICE_URL}
                isExternal
                textDecoration='underline'
              >
                Smart Invoice
              </Link>{' '}
              to manage client and RIP escrows. If you are setting up for a
              client, you&apos;ll be able to send them the Invoice link to
              handle deposit and escrow operations.
            </Text>
          )}
        </Stack>
      </SiteLayout>
    </>
  );
};

export default NewEscrow;
