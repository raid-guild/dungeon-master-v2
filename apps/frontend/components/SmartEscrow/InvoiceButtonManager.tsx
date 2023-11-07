import { useState, useEffect } from 'react';
import {
  SimpleGrid,
  Button,
  ChakraModal as Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from '@raidguild/design-system';
import { BigNumber } from 'ethers';

import { balanceOf } from '@raidguild/escrow-utils';

import { DepositFunds } from './DepositFunds';
import { ReleaseFunds } from './ReleaseFunds';
import { ResolveFunds } from './ResolveFunds';
import { LockFunds } from './LockFunds';
import { WithdrawFunds } from './WithdrawFunds';

export const InvoiceButtonManager = ({ invoice, account, provider }) => {
  const [balance, setBalance] = useState(BigNumber.from(0));

  const [selected, setSelected] = useState(0);
  const [modal, setModal] = useState(false);

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

  const checkBalance = (set, contractAddress) => {
    balanceOf(provider, invoice.token, contractAddress)
      .then((b) => {
        set(b);
      })
      .catch((balanceError) => console.log(balanceError));
  };

  useEffect(() => {
    checkBalance(setBalance, invoice.address);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const isRaidParty =
    account.toLowerCase() === invoice?.provider?.toLowerCase();

  const isClient = account.toLowerCase() === client;
  const isResolver = account.toLowerCase() === resolver.toLowerCase();

  const dispute =
    isLocked && disputes.length > 0 ? disputes[disputes.length - 1] : undefined;
  const deposited = BigNumber.from(released).add(balance);
  const due = deposited.gte(total)
    ? BigNumber.from(0)
    : BigNumber.from(total).sub(deposited);
  const resolution =
    !isLocked && resolutions.length > 0
      ? resolutions[resolutions.length - 1]
      : undefined;
  const isExpired = terminationTime <= new Date().getTime() / 1000;
  const amount = BigNumber.from(
    currentMilestone < amounts.length ? amounts[currentMilestone] : 0
  );
  const isLockable = !isExpired && !isLocked && balance.gt(0);

  const isReleasable = !isLocked && balance.gte(amount) && balance.gt(0);

  let gridColumns;
  if (isReleasable && (isLockable || (isExpired && balance.gt(0)))) {
    gridColumns = { base: 2, sm: 3 };
  } else if (isLockable || isReleasable || (isExpired && balance.gt(0))) {
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
          {isExpired && balance.gt(0) && (
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
              <WithdrawFunds
                contractAddress={invoice.address}
                token={invoice.token}
                invoice={invoice}
                balance={balance}
              />
            )}
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </>
  );
};
