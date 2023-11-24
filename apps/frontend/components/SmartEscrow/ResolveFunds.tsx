import {
  Button,
  ChakraInput as Input,
  Heading,
  InputGroup,
  InputRightElement,
  Link,
  Text,
  VStack,
} from '@raidguild/design-system';
import { getTxLink } from '@raidguild/dm-utils';
import { useResolve } from '@raidguild/escrow-hooks';
import { Invoice, parseTokenAddress } from '@raidguild/escrow-utils';
import { useState } from 'react';
import { formatUnits, parseUnits } from 'viem';
import { useChainId } from 'wagmi';

import Loader from './Loader';
import { OrderedTextarea } from './shared/OrderedTextArea';

const ResolveFunds = ({
  invoice,
  balance,
  close,
}: {
  invoice: Invoice;
  balance: bigint;
  close: () => void;
}) => {
  const { address, resolutionRate, token, isLocked } = invoice;
  const chainId = useChainId();

  const [loading, setLoading] = useState(false);
  const [transaction, setTransaction] = useState<any>();
  let resolverAward;
  try {
    resolverAward = BigInt(0);
    if (resolutionRate !== 0 && balance > BigInt(0)) {
      resolverAward = balance / BigInt(resolutionRate);
    }
  } catch (e) {
    console.error('error in ResoleFunds component ', e);
  }

  const availableFunds = balance / BigInt(resolverAward);
  const [clientAward, setClientAward] = useState(availableFunds);
  const [providerAward, setProviderAward] = useState(BigInt(0));
  const [clientAwardInput, setClientAwardInput] = useState(
    formatUnits(availableFunds, 18)
  );
  const [providerAwardInput, setProviderAwardInput] = useState('0');
  const [comments, setComments] = useState('');

  const { writeAsync } = useResolve({
    invoice,
    clientAward: 0,
    providerAward: 0,
  });

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
          ? `You’ll need to distribute the total balance of ${formatUnits(
              balance,
              18
            )} ${parseTokenAddress(
              chainId,
              token
            )} between the client and provider, excluding the ${
              resolutionRate === 0 ? '0' : 100 / resolutionRate
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
            infoText=''
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
                    let award = parseUnits(e.target.value, 18);
                    if (award > availableFunds) {
                      award = availableFunds;
                      setClientAwardInput(formatUnits(award, 18));
                    }
                    setClientAward(award);
                    award = availableFunds - BigInt(award);
                    setProviderAward(award);
                    setProviderAwardInput(formatUnits(award, 18));
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
                    let award = parseUnits(e.target.value, 18);
                    if (award > availableFunds) {
                      award = availableFunds;
                      setProviderAwardInput(formatUnits(award, 18));
                    }
                    setProviderAward(award);
                    award = availableFunds - BigInt(award);
                    setClientAward(award);
                    setClientAwardInput(formatUnits(award, 18));
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
                value={formatUnits(resolverAward, 18)}
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
              // onClick={resolveFunds}
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

export default ResolveFunds;
