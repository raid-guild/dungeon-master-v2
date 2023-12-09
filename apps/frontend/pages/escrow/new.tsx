import { Heading, Stack } from '@raidguild/design-system';
import { useRaidDetail } from '@raidguild/dm-hooks';
import _ from 'lodash';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { NextSeo } from 'next-seo';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import SiteLayout from '../../components/SiteLayout';
import EscrowConfirmation from '../../components/SmartEscrow/EscrowConfirmation';
import EscrowDetailsForm from '../../components/SmartEscrow/EscrowDetailsForm';
import EscrowSuccess from '../../components/SmartEscrow/EscrowSuccess';
import PaymentsForm from '../../components/SmartEscrow/PaymentsForm';
import ProjectInfo from '../../components/SmartEscrow/ProjectInfo';

const NewEscrow = () => {
  const escrowForm = useForm();
  const router = useRouter();
  const { data: session } = useSession();

  const raidId = _.get(router, 'query.raidId') as string;
  const token = _.get(session, 'token');

  const [step, setStep] = useState<number>(1);

  const updateStep = () => {
    setStep((prev) => prev + 1);
  };

  const backStep = () => {
    setStep((prev) => prev - 1);
  };

  const { data: raid } = useRaidDetail({
    raidId,
    token,
    roles: _.get(session, 'user.roles'),
  });

  useEffect(() => {
    if (!raidId) {
      router.push(`/escrow`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <NextSeo title='Smart Escrow' />

      <SiteLayout subheader={<Heading>Register New Escrow</Heading>}>
        <Stack mt='6' w='70%' spacing={6}>
          <ProjectInfo raid={raid} />
          {step === 1 && (
            <EscrowDetailsForm
              escrowForm={escrowForm}
              updateStep={updateStep}
            />
          )}
          {step === 2 && (
            <PaymentsForm
              escrowForm={escrowForm}
              updateStep={updateStep}
              backStep={backStep}
            />
          )}
          {step === 3 && (
            <EscrowConfirmation
              escrowForm={escrowForm}
              raid={raid}
              updateStep={updateStep}
              backStep={backStep}
            />
          )}
          {step === 4 && <EscrowSuccess raidId={raidId} />}
        </Stack>
      </SiteLayout>
    </>
  );
};

export default NewEscrow;
