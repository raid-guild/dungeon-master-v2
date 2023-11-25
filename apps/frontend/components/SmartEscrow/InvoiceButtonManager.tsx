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
import { useAccount } from 'wagmi';

import DepositFunds from './DepositFunds';
import LockFunds from './LockFunds';
import ReleaseFunds from './ReleaseFunds';
import ResolveFunds from './ResolveFunds';
import WithdrawFunds from './WithdrawFunds';

const InvoiceButtonManager = ({ invoice }: { invoice: Invoice }) => {
  const { address } = useAccount();
  const [balance, setBalance] = useState(BigInt(0));

  const [selected, setSelected] = useState(0);
  const [modal, setModal] = useState(false);

  const {
    client,
    isLocked,
    disputes,
    resolutions,
    terminationTime,
    currentMilestone,
    amounts,
    released,
    total,
    resolver,
  } = invoice;

  const isRaidParty = _.toLower(address) === _.toLower(invoice?.provider);
  const isClient = _.toLower(address) === _.toLower(client);
  const isResolver = _.toLower(address) === _.toLower(resolver);

  const dispute =
    isLocked && disputes.length > 0 ? disputes[disputes.length - 1] : undefined;
  const deposited = BigInt(released) + balance;
  const due = deposited > total ? BigInt(0) : BigInt(total) - deposited;
  const resolution =
    !isLocked && resolutions.length > 0
      ? resolutions[resolutions.length - 1]
      : undefined;
  const isExpired = terminationTime <= new Date().getTime() / 1000;
  const amount = BigInt(
    currentMilestone < amounts.length ? amounts[currentMilestone] : 0
  );
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
    if (isReleasable && isClient) {
      setSelected(2);
      setModal(true);
    }
  };

  const onResolve = async () => {
    if (isResolver) {
      setSelected(3);
      setModal(true);
    }
  };

  const onWithdraw = async () => {
    if (isExpired && isClient) {
      setSelected(4);
      setModal(true);
    }
  };

  let gridColumns;
  if (isReleasable && (isLockable || (isExpired && balance > 0))) {
    gridColumns = { base: 2, sm: 3 };
  } else if (isLockable || isReleasable || (isExpired && balance > 0)) {
    gridColumns = 2;
  } else {
    gridColumns = 1;
  }

  return (
    <>
      {isResolver && (
        <SimpleGrid columns={1} spacing='1rem' w='100%' mt='1rem'>
          {invoice.isLocked ? (
            <Button
              variant='solid'
              textTransform='uppercase'
              onClick={() => onResolve()}
            >
              Resolve
            </Button>
          ) : (
            <Button
              variant='solid'
              textTransform='uppercase'
              onClick={() => onDeposit()}
            >
              {Number(due) ? 'Deposit Due' : 'Deposit More'}
            </Button>
          )}
        </SimpleGrid>
      )}

      {!dispute && !resolution && !isResolver && isClient && (
        <SimpleGrid columns={gridColumns} spacing='1rem' w='100%' mt='1rem'>
          {isLockable && (isClient || isRaidParty) && (
            <Button
              variant='solid'
              textTransform='uppercase'
              onClick={() => onLock()}
            >
              Lock
            </Button>
          )}
          {isExpired && balance > 0 && (
            <Button
              variant='solid'
              textTransform='uppercase'
              onClick={() => onWithdraw()}
            >
              Withdraw
            </Button>
          )}
          {isReleasable && (
            <Button
              variant='solid'
              textTransform='uppercase'
              onClick={() => onDeposit()}
            >
              {Number(due) ? 'Deposit Due' : 'Deposit More'}
            </Button>
          )}
          <Button
            gridArea={{
              base: Number.isInteger(gridColumns)
                ? 'auto/auto/auto/auto'
                : '2/1/2/span 2',
              sm: 'auto/auto/auto/auto',
            }}
            variant='solid'
            textTransform='uppercase'
            onClick={() => (isReleasable ? onRelease() : onDeposit())}
          >
            {isReleasable ? 'Release' : 'Deposit Due'}
          </Button>
        </SimpleGrid>
      )}

      {!dispute && !resolution && !isResolver && !isClient && (
        <SimpleGrid
          columns={isLockable && (isClient || isRaidParty) ? 2 : 1}
          spacing='1rem'
          w='100%'
          mt='1rem'
        >
          {isLockable && (isClient || isRaidParty) && (
            <Button
              variant='solid'
              textTransform='uppercase'
              onClick={() => onLock()}
            >
              Lock
            </Button>
          )}
          <Button
            variant='solid'
            textTransform='uppercase'
            onClick={() => onDeposit()}
          >
            {Number(due) ? 'Deposit Due' : 'Deposit More'}
          </Button>
        </SimpleGrid>
      )}

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
