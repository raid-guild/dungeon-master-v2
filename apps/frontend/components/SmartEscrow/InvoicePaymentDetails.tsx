import {
  Card,
  Stack,
  Flex,
  HStack,
  VStack,
  Text,
  Divider,
  Link,
} from '@raidguild/design-system';
import { useState } from 'react';
import { AccountLink } from './shared/AccountLink';

import { getTxLink } from '@raidguild/dm-utils';
import { parseTokenAddress, getIpfsLink } from '@raidguild/escrow-utils';
import { formatEther, formatUnits } from 'viem';
import _ from 'lodash';
import { useBalance } from 'wagmi';

export const InvoicePaymentDetails = ({ invoice, chainId }) => {
  const [balance, setBalance] = useState(BigInt(0));

  const { data } = useBalance({
    address: invoice.address,
    token: invoice.token,
  });

  const {
    client,
    released,
    total,
    isLocked,
    disputes,
    resolutions,
    terminationTime,
    currentMilestone,
    amounts,
    deposits,
    releases,
    resolver,
  } = invoice;
  const deposited = BigInt(released) + balance;
  const due = deposited > total ? BigInt(0) : BigInt(total) - deposited;
  const dispute =
    isLocked && disputes.length > 0 ? disputes[disputes.length - 1] : undefined;
  const resolution =
    !isLocked && resolutions.length > 0
      ? resolutions[resolutions.length - 1]
      : undefined;
  const isExpired = terminationTime <= new Date().getTime() / 1000;
  const amount = BigInt(
    currentMilestone < amounts.length ? amounts[currentMilestone] : 0
  );
  const isReleasable = !isLocked && balance >= amount && balance > 0;

  let sum = BigInt(0);

  return (
    <Card variant='filled' p={1} direction='column' width='100%'>
      <Stack width='100%'>
        <HStack
          width='100%'
          mt='.5rem'
          mb='1rem'
          justifyContent='space-between'
        >
          <Text variant='textOne'>Total Project Amount</Text>
          <Text variant='textOne'>
            {formatEther(invoice.total)}{' '}
            {parseTokenAddress(chainId, invoice.token)}
          </Text>
        </HStack>
        <VStack align='stretch' spacing='0.25rem'>
          {invoice.amounts.map((amt, index) => {
            let tot = BigInt(0);
            let ind = -1;
            let full = false;
            if (deposits.length > 0) {
              for (let i = 0; i < deposits.length; i += 1) {
                tot = tot + deposits[i].amount;
                if (tot > sum) {
                  ind = i;
                  if (tot - sum >= amt) {
                    full = true;
                    break;
                  }
                }
              }
            }
            sum = sum + amt;

            return (
              <Flex
                key={index.toString()}
                justify='space-between'
                align='stretch'
                direction='row'
              >
                <Text variant='textOne'>Payment Milestone #{index + 1}</Text>
                <HStack align='center' justify='flex-end'>
                  {index < currentMilestone && releases.length > index && (
                    <Link
                      fontSize='xs'
                      isExternal
                      color='grey'
                      fontStyle='italic'
                      href={getTxLink(chainId, releases[index].txHash)}
                    >
                      Released{' '}
                      {new Date(
                        releases[index].timestamp * 1000
                      ).toLocaleDateString()}
                    </Link>
                  )}
                  {!(index < currentMilestone && releases.length > index) &&
                    ind !== -1 && (
                      <Link
                        fontSize='xs'
                        isExternal
                        color='grey'
                        fontStyle='italic'
                        href={getTxLink(chainId, deposits[ind].txHash)}
                      >
                        {full ? '' : 'Partially '}Deposited{' '}
                        {new Date(
                          deposits[ind].timestamp * 1000
                        ).toLocaleDateString()}
                      </Link>
                    )}
                  <Text
                    variant='textOne'
                    textAlign='right'
                    fontWeight='500'
                  >{`${formatUnits(amt, 18)} ${parseTokenAddress(
                    chainId,
                    invoice.token
                  )}`}</Text>
                </HStack>
              </Flex>
            );
          })}
        </VStack>
        <Divider mt='1rem' />
        {/* TODO use array */}
        <HStack mt='1rem' mb='.2rem' justifyContent='space-between'>
          <Text variant='textOne'>Total Deposited</Text>
          <Text variant='textOne'>
            {formatUnits(deposited, 18)}{' '}
            {parseTokenAddress(chainId, invoice.token)}
          </Text>
        </HStack>
        <HStack justifyContent='space-between' mb='.2rem'>
          <Text variant='textOne'>Total Released</Text>
          <Text variant='textOne'>
            {formatUnits(released, 18)}{' '}
            {parseTokenAddress(chainId, invoice.token)}
          </Text>
        </HStack>
        <HStack justifyContent='space-between'>
          <Text variant='textOne'>Remaining Amount Due</Text>
          <Text variant='textOne'>
            {formatUnits(due, 18)} {parseTokenAddress(chainId, invoice.token)}
          </Text>
        </HStack>
        <Divider mt='1rem' mb='1rem' />

        {!dispute && !resolution && (
          <Flex
            justify='space-between'
            align='center'
            color='white'
            fontWeight='bold'
            fontSize='lg'
            fontFamily='texturina'
          >
            {isExpired || (due === BigInt(0) && !isReleasable) ? (
              <>
                <Text>Remaining Balance</Text>
                <Text textAlign='right'>{`${formatUnits(
                  balance,
                  18
                )} ${parseTokenAddress(chainId, invoice.token)}`}</Text>{' '}
              </>
            ) : (
              <>
                <Text>
                  {isReleasable && 'Next Amount to Release'}
                  {!isReleasable && 'Total Due Today'}
                </Text>
                <Text textAlign='right'>{`${formatUnits(
                  isReleasable ? amount : amount - balance,
                  18
                )} ${parseTokenAddress(chainId, invoice.token)}`}</Text>
              </>
            )}
          </Flex>
        )}

        {dispute && (
          <VStack w='100%' align='stretch' spacing='1rem'>
            <Flex
              justify='space-between'
              align='center'
              fontWeight='bold'
              fontSize='lg'
              fontFamily='texturina'
            >
              <Text>Amount Locked</Text>
              <Text textAlign='right'>{`${formatUnits(
                balance,
                18
              )} ${parseTokenAddress(chainId, invoice.token)}`}</Text>
            </Flex>
            <Text fontFamily='texturina' color='purpleLight'>
              {`A dispute is in progress with `}
              <AccountLink address={resolver} chainId={chainId} />
              <br />
              <Link href={getIpfsLink(dispute.ipfsHash)} isExternal>
                <u>View details on IPFS</u>
              </Link>
              <br />
              <Link href={getTxLink(chainId, dispute.txHash)} isExternal>
                <u>View transaction</u>
              </Link>
            </Text>
          </VStack>
        )}

        {resolution && (
          <VStack align='stretch' spacing='1rem' color='primary.300'>
            <Flex
              justify='space-between'
              align='center'
              fontWeight='bold'
              fontSize='lg'
              fontFamily='texturina'
            >
              <Text>Amount Dispersed</Text>
              <Text textAlign='right'>{`${formatUnits(
                BigInt(resolution.clientAward) +
                  resolution.providerAward +
                  resolution.resolutionFee
                  ? resolution.resolutionFee
                  : 0,
                18
              )} ${parseTokenAddress(chainId, invoice.token)}`}</Text>
            </Flex>
            <Flex
              justify='space-between'
              direction={{ base: 'column', sm: 'row' }}
            >
              <Flex flex={1}>
                <Text fontFamily='texturina' maxW='300px' color='purpleLight'>
                  <AccountLink address={resolver} chainId={chainId} />
                  {' has resolved the dispute and dispersed remaining funds'}
                  <br />
                  <br />
                  <Link href={getIpfsLink(resolution.ipfsHash)} isExternal>
                    <u>View details on IPFS</u>
                  </Link>
                  <br />
                  <Link href={getTxLink(chainId, resolution.txHash)} isExternal>
                    <u>View transaction</u>
                  </Link>
                </Text>
              </Flex>
              <VStack
                spacing='0.5rem'
                mt={{ base: '1rem', sm: '0' }}
                fontFamily='texturina'
              >
                {resolution.resolutionFee && (
                  <Text textAlign='right' color='purpleLight'>
                    {`${formatUnits(
                      BigInt(resolution.resolutionFee),
                      18
                    )} ${parseTokenAddress(chainId, invoice.token)} to `}
                    <AccountLink address={resolver} chainId={chainId} />
                  </Text>
                )}
                <Text textAlign='right' color='purpleLight'>
                  {`${formatUnits(
                    BigInt(resolution.clientAward),
                    18
                  )} ${parseTokenAddress(chainId, invoice.token)} to `}
                  <AccountLink address={client} chainId={chainId} />
                </Text>
                <Text textAlign='right' color='purpleLight'>
                  {`${formatUnits(
                    BigInt(resolution.providerAward),
                    18
                  )} ${parseTokenAddress(chainId, invoice.token)} to `}
                  <AccountLink address={invoice.provider} chainId={chainId} />
                </Text>
              </VStack>
            </Flex>
          </VStack>
        )}
      </Stack>
    </Card>
  );
};
