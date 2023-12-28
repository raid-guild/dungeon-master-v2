import {
  Button,
  ChakraModal as Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  SimpleGrid,
} from '@raidguild/design-system';
import { Invoice } from '@raidguild/escrow-utils';
import _ from 'lodash';
import { useState } from 'react';
import { useAccount, useBalance } from 'wagmi';

import DepositFunds from './DepositFunds';
import LockFunds from './LockFunds';
import ReleaseFunds from './ReleaseFunds';
import ResolveFunds from './ResolveFunds';
import WithdrawFunds from './WithdrawFunds';

const InvoiceButtonManager = ({ invoice }: { invoice: Invoice }) => {
  const { address } = useAccount();

  const [selected, setSelected] = useState(0);
  const [modal, setModal] = useState(false);

  const {
    client,
    isLocked,
    // disputes,
    // resolutions,
    terminationTime,
    currentMilestone,
    amounts,
    released,
    total,
    resolver,
  } = invoice;

  const { data: invoiceTokenBalance } = useBalance({
    address: invoice?.address,
    token: invoice?.token,
  });

  const isRaidParty = _.toLower(address) === _.toLower(invoice?.provider);
  const isClient = _.toLower(address) === _.toLower(client);
  const isResolver = _.toLower(address) === _.toLower(resolver);

  const balance = _.get(invoiceTokenBalance, 'value', BigInt(0));
  // const dispute =
  //   isLocked && !_.isEmpty(disputes) ? _.last(disputes) : undefined;
  const deposited = BigInt(released) + balance;
  const due = deposited > total ? BigInt(0) : BigInt(total) - deposited;
  // const resolution = !isLocked && !_.isEmpty(resolutions) ? _.last(resolutions) : undefined;
  const amount = BigInt(
    currentMilestone < amounts.length ? amounts[currentMilestone] : 0
  );
  const isExpired = terminationTime <= new Date().getTime() / 1000;
  const isLockable = !isExpired && !isLocked && balance > 0;
  const isReleasable = !isLocked && balance >= amount && balance > 0;

  const onLock = () => {
    setSelected(0);
    setModal(true);
  };

  const onDeposit = () => {
    setSelected(1);
    setModal(true);
  };

  const onRelease = async () => {
    if (!isReleasable || !isClient) {
      console.log('not releasable or client');
      return;
    }

    setSelected(2);
    setModal(true);
  };

  const onResolve = async () => {
    if (!isResolver) {
      console.log('not resolver');
      return;
    }
    setSelected(3);
    setModal(true);
  };

  const onWithdraw = async () => {
    if (!isExpired || !isClient) {
      console.log('not expired or client');
      return;
    }
    setSelected(4);
    setModal(true);
  };

  const columnsCheck = [
    isResolver && invoice.isLocked,
    true, // hide in some cases?
    isLockable && (isClient || isRaidParty),
    isExpired && balance > 0 && isClient,
  ];
  const columns = _.size(_.filter(columnsCheck, (v) => v === true));

  return (
    <>
      <SimpleGrid columns={columns} spacing='1rem' w='100%' mt='1rem'>
        {isResolver && invoice.isLocked && (
          <Button
            variant='solid'
            textTransform='uppercase'
            onClick={onResolve}
            isDisabled={!isResolver}
          >
            Resolve
          </Button>
        )}

        {isReleasable ? (
          <Button
            variant='solid'
            textTransform='uppercase'
            onClick={onRelease}
            isDisabled={!isClient}
          >
            Release
          </Button>
        ) : (
          <Button variant='solid' textTransform='uppercase' onClick={onDeposit}>
            Deposit Due
          </Button>
        )}
        {isLockable && (isClient || isRaidParty) && (
          <Button
            variant='solid'
            textTransform='uppercase'
            onClick={onLock}
            isDisabled={!isClient && !isRaidParty}
          >
            Lock
          </Button>
        )}
        {isExpired && balance > 0 && isClient && (
          <Button
            variant='solid'
            textTransform='uppercase'
            isDisabled={!isExpired}
            onClick={onWithdraw}
          >
            Withdraw
          </Button>
        )}
      </SimpleGrid>

      <Modal isOpen={modal} onClose={() => setModal(false)} isCentered>
        <ModalOverlay>
          <ModalContent
            p='2rem'
            maxW='40rem'
            background='gray.800'
            borderRadius='0.5rem'
            color='white'
          >
            <ModalCloseButton
              _hover={{ bgColor: 'white20' }}
              top='0.5rem'
              right='0.5rem'
            />
            {modal && selected === 0 && (
              <LockFunds invoice={invoice} balance={balance} />
            )}
            {modal && selected === 1 && (
              <DepositFunds invoice={invoice} deposited={deposited} due={due} />
            )}
            {modal && selected === 2 && (
              <ReleaseFunds invoice={invoice} balance={balance} />
            )}
            {modal && selected === 3 && (
              <ResolveFunds
                invoice={invoice}
                balance={balance}
                close={() => setModal(false)}
              />
            )}
            {modal && selected === 4 && (
              <WithdrawFunds invoice={invoice} balance={balance} />
            )}
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
};

export default InvoiceButtonManager;
