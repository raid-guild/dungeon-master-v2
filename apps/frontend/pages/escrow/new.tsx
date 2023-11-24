import { Flex, Heading } from '@raidguild/design-system';
import { NextSeo } from 'next-seo';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import SiteLayout from '../../components/SiteLayout';
import EscrowConfirmation from '../../components/SmartEscrow/EscrowConfirmation';
import EscrowSuccess from '../../components/SmartEscrow/EscrowSuccess';
import PaymentDetailsForm from '../../components/SmartEscrow/PaymentDetailsForm';
import PaymentsChunkForm from '../../components/SmartEscrow/PaymentsChunkForm';
import ProjectInfo from '../../components/SmartEscrow/ProjectInfo';

const NewEscrow = () => {
  const escrowForm = useForm();
  const { watch } = escrowForm;

  const [step, setStep] = useState<number>(1);

  const updateStep = () => {
    setStep((prev) => prev + 1);
  };

  const backStep = () => {
    setStep((prev) => prev - 1);
  };

  const { raidId, projectName, clientName } = watch();

  // useEffect(() => {
  //   if (!appState.raid_id) {
  //     router.push(`/escrow`);
  //   }
  // }, []);

  return (
    <>
      <NextSeo title='Smart Escrow' />

      <SiteLayout subheader={<Heading>Register New Escrow</Heading>}>
        <Flex
          width='100%'
          direction='row'
          alignItems='center'
          justifyContent='space-evenly'
          mt='6'
        >
          <ProjectInfo invoice={{ raidId, clientName, projectName }} />
          {step === 1 && (
            <PaymentDetailsForm
              escrowForm={escrowForm}
              updateStep={updateStep}
              backStep={backStep}
            />
          )}
          {step === 2 && (
            <PaymentsChunkForm
              escrowForm={escrowForm}
              updateStep={updateStep}
              backStep={backStep}
            />
          )}
          {step === 3 && (
            <EscrowConfirmation
              escrowForm={escrowForm}
              updateStep={updateStep}
              backStep={backStep}
            />
          )}
          {step === 4 && <EscrowSuccess raidId={raidId} />}
        </Flex>
      </SiteLayout>
    </>
  );
};

export default NewEscrow;
