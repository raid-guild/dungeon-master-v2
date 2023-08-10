import {
  Button,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react';
import { BigNumber, utils } from 'ethers';
import { useCallback, useContext, useState } from 'react';

import { SmartEscrowContext } from '../../contexts/SmartEscrow';
import { OrderedTextarea } from './shared/OrderedTextArea';
import { Loader } from './Loader';

import { getTxLink, parseTokenAddress } from '../../smartEscrow/utils/helpers';
import { resolve } from '../../smartEscrow/utils/invoice';
import { uploadDisputeDetails } from '../../smartEscrow/utils/ipfs';

export const ResolveFunds = ({ invoice, balance, close }) => {
  const { address, resolutionRate, token, isLocked } = invoice;
  const {
    appState: { chainId, provider },
  } = useContext(SmartEscrowContext);

  const [loading, setLoading] = useState(false);
  const [transaction, setTransaction] = useState<any>();
  let resolverAward;
  try {
    resolverAward =
      resolutionRate === '0'
        ? BigNumber.from('0')
        : balance.gt(0)
        ? balance.div(resolutionRate)
        : BigNumber.from(0);
  } catch (e) {
    console.error('error in ResoleFunds component ', e);
  }

  const availableFunds = balance.sub(resolverAward);
  const [clientAward, setClientAward] = useState(availableFunds);
  const [providerAward, setProviderAward] = useState(BigNumber.from(0));
  const [clientAwardInput, setClientAwardInput] = useState(
    utils.formatUnits(availableFunds, 18)
  );
  const [providerAwardInput, setProviderAwardInput] = useState('0');
  const [comments, setComments] = useState('');

  const resolveFunds = useCallback(async () => {
    if (
      provider &&
      isLocked &&
      comments &&
      balance.eq(clientAward.add(providerAward).add(resolverAward)) &&
      balance.gt(0)
    ) {
      try {
        setLoading(true);
        const detailsHash = await uploadDisputeDetails({
          reason: comments,
          invoice: address,
          amount: balance.toString(),
        });
        const tx = await resolve(
          provider,
          address,
          clientAward,
          providerAward,
          detailsHash
        );
        setTransaction(tx);
        await tx.wait();
        setTimeout(() => {
          window.location.reload();
        }, 20000);
      } catch (depositError) {
        setLoading(false);
        console.error(depositError);
      }
    }
  }, [
    provider,
    isLocked,
    balance,
    comments,
    clientAward,
    providerAward,
    resolverAward,
    address,
  ]);

  return (
    <VStack w='100%' spacing='1rem'>
      <Heading
        mb='1rem'
        color='white'
        as='h3'
        fontSize='2xl'
        transition='all ease-in-out .25s'
        _hover={{ cursor: 'pointer', color: 'raid' }}
      >
        Resolve Dispute
      </Heading>
      <Text textAlign='center' fontSize='sm' mb='1rem' fontFamily='texturina'>
        {isLocked
          ? `You’ll need to distribute the total balance of ${utils.formatUnits(
              balance,
              18
            )} ${parseTokenAddress(
              chainId,
              token
            )} between the client and provider, excluding the ${
              resolutionRate === '0' ? '0' : 100 / resolutionRate
            }% arbitration fee which you shall receive.`
          : `Invoice is not locked`}
      </Text>
      {isLocked ? (
        <>
          <OrderedTextarea
            tooltip='Here you may explain your reasoning behind the resolution'
            label='Resolution Comments'
            placeholder='Resolution Comments'
            value={comments}
            setValue={setComments}
            infoText={''}
            maxLength={10000}
          />

          <VStack
            spacing='0.5rem'
            align='stretch'
            color='primary.300'
            fontFamily='texturina'
          >
            <Text fontWeight='700'>Client Award</Text>
            <InputGroup>
              <Input
                bg='black'
                color='yellow'
                border='none'
                type='number'
                value={clientAwardInput}
                pr='3.5rem'
                onChange={(e) => {
                  setClientAwardInput(e.target.value);
                  if (e.target.value) {
                    let award = utils.parseUnits(e.target.value, 18);
                    if (award.gt(availableFunds)) {
                      award = availableFunds;
                      setClientAwardInput(utils.formatUnits(award, 18));
                    }
                    setClientAward(award);
                    award = availableFunds.sub(award);
                    setProviderAward(award);
                    setProviderAwardInput(utils.formatUnits(award, 18));
                  }
                }}
                placeholder='Client Award'
              />
              <InputRightElement w='3.5rem' color='yellow'>
                {parseTokenAddress(chainId, token)}
              </InputRightElement>
            </InputGroup>
          </VStack>
          <VStack
            spacing='0.5rem'
            align='stretch'
            color='primary.300'
            fontFamily='texturina'
          >
            <Text fontWeight='700'>Provider Award</Text>
            <InputGroup>
              <Input
                bg='black'
                color='yellow'
                border='none'
                type='number'
                value={providerAwardInput}
                pr='3.5rem'
                onChange={(e) => {
                  setProviderAwardInput(e.target.value);
                  if (e.target.value) {
                    let award = utils.parseUnits(e.target.value, 18);
                    if (award.gt(availableFunds)) {
                      award = availableFunds;
                      setProviderAwardInput(utils.formatUnits(award, 18));
                    }
                    setProviderAward(award);
                    award = availableFunds.sub(award);
                    setClientAward(award);
                    setClientAwardInput(utils.formatUnits(award, 18));
                  }
                }}
                placeholder='Provider Award'
              />
              <InputRightElement w='3.5rem' color='yellow'>
                {parseTokenAddress(chainId, token)}
              </InputRightElement>
            </InputGroup>
          </VStack>
          <VStack
            spacing='0.5rem'
            align='stretch'
            color='primary.300'
            mb='1rem'
            fontFamily='texturina'
          >
            <Text fontWeight='700'>Resolver Award</Text>
            <InputGroup>
              <Input
                bg='black'
                color='yellow'
                border='none'
                type='number'
                value={utils.formatUnits(resolverAward, 18)}
                pr='3.5rem'
                isDisabled
              />
              <InputRightElement w='3.5rem' color='yellow'>
                {parseTokenAddress(chainId, token)}
              </InputRightElement>
            </InputGroup>
          </VStack>

          {loading && <Loader />}

          {!loading && (
            <Button
              onClick={resolveFunds}
              isDisabled={resolverAward.lte(0) || !comments}
              textTransform='uppercase'
              variant='solid'
            >
              Resolve
            </Button>
          )}

          {transaction && (
            <Text color='white' textAlign='center' fontSize='sm'>
              Follow your transaction{' '}
              <Link
                href={getTxLink(chainId, transaction.hash)}
                isExternal
                color='primary.300'
                textDecoration='underline'
              >
                here
              </Link>
            </Text>
          )}
        </>
      ) : (
        <Button
          onClick={close}
          variant='solid'
          textTransform='uppercase'
          w='100%'
        >
          Close
        </Button>
      )}
    </VStack>
  );
};
