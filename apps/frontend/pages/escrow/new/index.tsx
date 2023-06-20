import React, { useContext, useState, useEffect } from 'react';
import { useToast, Text, Center } from '@chakra-ui/react';
import { NextSeo } from 'next-seo';
import SiteLayout from '../../../components/SiteLayout';
import { Heading, Box, Flex } from '@raidguild/design-system';
import { useRouter } from 'next/router';

import { SmartEscrowContext } from '../../../contexts/SmartEscrow';

import { PaymentDetailsForm } from '../../../components/SmartEscrow/PaymentDetailsForm';
import { PaymentsChunkForm } from '../../../components/SmartEscrow/PaymentsChunkForm';
import { EscrowConfirmation } from '../../../components/SmartEscrow/EscrowConfirmation';
import { EscrowSuccess } from '../../../components/SmartEscrow/EscrowSuccess';
import { ProjectInfo } from '../../../components/SmartEscrow/ProjectInfo';

// web3 functions
import { register } from '../../../smartEscrow/utils/invoice';

const NewEscrow = () => {
  const { appState } = useContext(SmartEscrowContext);
  const router = useRouter();

  const [client, setClient] = useState(
    '0x76C3038Ef92B1E917d47F67767dA784a027582D4'
  );
  const [serviceProvider, setServiceProvider] = useState(
    '0x306744992015C90dEcb014e0836fC50176dE6Cf7'
  );

  const [paymentDue, setPaymentDue] = useState('1');
  const [milestones, setMilestones] = useState(5);
  const [selectedDay, setSelectedDay] = useState('');

  const [tokenType, setTokenType] = useState('');

  const [payments, setPayments] = useState(
    Array.from(Array(Number(milestones)))
  );

  const [tx, setTx] = useState('');

  const [step, updateStep] = useState(1);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (!appState.raid_id) {
      console.log('no appState.raid_id found. appState: ', appState);
      router.push(`/escrow`);
    }
  }, []);

  const toast = useToast();

  const sendToast = (msg, duration = 3000) => {
    toast({
      duration,
      position: 'top',
      render: () => (
        <Box
          color='white'
          p={3}
          mt='2rem'
          bg='#ff3864'
          fontFamily='jetbrains'
          textTransform='uppercase'
        >
          {msg}
        </Box>
      ),
    });
  };
  console.log('new escrow called: isLoading: ', isLoading);

  return (
    <>
      <NextSeo title='Smart Escrow' />

      <SiteLayout subheader={<Heading>Register New Escrow</Heading>}>
        <Flex
          width='100%'
          direction='row'
          alignItems='center'
          justifyContent='space-evenly'
        >
          <ProjectInfo appState={appState} />
          {step === 1 && (
            <PaymentDetailsForm
              appState={appState}
              client={client}
              serviceProvider={serviceProvider}
              tokenType={tokenType}
              paymentDue={paymentDue}
              milestones={milestones}
              selectedDay={selectedDay}
              setClient={setClient}
              setServiceProvider={setServiceProvider}
              setTokenType={setTokenType}
              setPaymentDue={setPaymentDue}
              setMilestones={setMilestones}
              setSelectedDay={setSelectedDay}
              sendToast={sendToast}
              updateStep={updateStep}
            />
          )}
          {step === 2 && (
            <PaymentsChunkForm
              tokenType={tokenType}
              paymentDue={paymentDue}
              milestones={milestones}
              payments={payments}
              setPayments={setPayments}
              sendToast={sendToast}
              updateStep={updateStep}
            />
          )}
          {step === 3 && (
            <EscrowConfirmation
              appState={appState}
              client={client}
              serviceProvider={serviceProvider}
              tokenType={tokenType}
              paymentDue={paymentDue}
              milestones={milestones}
              payments={payments}
              selectedDay={selectedDay}
              isLoading={isLoading}
              setLoading={setLoading}
              updateStep={updateStep}
              register={register}
              setTx={setTx}
            />
          )}
          {step === 4 && (
            <EscrowSuccess
              ethersProvider={appState.web3Provider}
              tx={tx}
              chainId={appState.chainId}
              raidId={appState.raid_id}
            />
          )}
        </Flex>
      </SiteLayout>
    </>
  );
};

export default NewEscrow;
