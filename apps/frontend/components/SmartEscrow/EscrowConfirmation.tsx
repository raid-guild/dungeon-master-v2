import { Flex, HStack } from '@chakra-ui/react';
import { Button, Text } from '@raidguild/design-system';
import { AccountLink } from './shared/AccountLink';
import { utils } from 'ethers';
import * as Web3Utils from 'web3-utils';

import {
  SPOILS_BASIS_POINTS,
  NETWORK_CONFIG,
} from '../../smartEscrow/utils/constants';

console.log('Web3Utils: utils ', Web3Utils);

const REQUIRES_VERIFICATION = true;

export const EscrowConfirmation = ({
  appState,
  client,
  serviceProvider,
  tokenType,
  paymentDue,
  milestones,
  payments,
  selectedDay,
  isLoading,
  setLoading,
  updateStep,
  register,
  setTx,
}) => {
  const createInvoice = async () => {
    setLoading(true);
    console.log('setLoading is true, calling createInvoice');
    console.log('Web3Utils: ', Web3Utils);

    const chainId = appState.chainId;
    const ethersProvider = appState.provider;
    const clientAddress = client;

    let daoAddress = '';

    if (parseInt(chainId) === 100) {
      daoAddress = NETWORK_CONFIG['RG_XDAI'];
    } else if (parseInt(chainId) === 1) {
      daoAddress = NETWORK_CONFIG['RG_MULTISIG'];
    } else {
      daoAddress = serviceProvider;
    }

    const resolver =
      NETWORK_CONFIG[parseInt(chainId)]['RESOLVERS']['LexDAO']['address']; //arbitration
    const tokenAddress =
      NETWORK_CONFIG[parseInt(chainId)]['TOKENS'][tokenType]['address'];
    const wrappedNativeToken =
      NETWORK_CONFIG[parseInt(chainId)]['WRAPPED_NATIVE_TOKEN'];
    const factoryAddress = NETWORK_CONFIG[parseInt(chainId)]['INVOICE_FACTORY'];
    const paymentsInWei = [];
    const terminationTime = new Date(selectedDay).getTime() / 1000;

    console.log('payments: using toWei unit ', payments);
    payments.map((amount) =>
      paymentsInWei.push(Web3Utils.toWei(amount, 'ether'))
    );
    console.log('paymentsInWei: ', paymentsInWei);

    const resolverType = 0; // 0 for individual, 1 for erc-792 arbitrator
    const type = utils.formatBytes32String('split-escrow');

    // THESE ARE THE REQUIRED FIELDS FOR SPLIT-ESCROW TYPE in correct order
    // address _client,
    // uint8 _resolverType,
    // address _resolver,
    // address _token,
    // uint256 _terminationTime, // exact termination date in seconds since epoch
    // bytes32 _details,
    // address _wrappedNativeToken,
    // bool _requireVerification,
    // address _factory,
    // address _dao,
    // uint256 _daoFee

    const data = utils.AbiCoder.prototype.encode(
      [
        'address',
        'uint8',
        'address',
        'address',
        'uint256',
        'bytes32',
        'address',
        'bool',
        'address',
        'address',
        'uint256',
      ],
      [
        clientAddress,
        resolverType,
        resolver, // address _resolver (LEX DAO resolver address)
        tokenAddress, // address _token (payment token address)
        terminationTime,
        '0x0000000000000000000000000000000000000000000000000000000000000000', //bytes32 _details detailHash
        wrappedNativeToken,
        REQUIRES_VERIFICATION, // requireVerification - this flag warns the client not to deposit funds until verifying they can release or lock funds
        factoryAddress,
        daoAddress,
        SPOILS_BASIS_POINTS, // daoFee - basis points. percentage out of 10,000. 1,000 = 10% RG DAO fee
      ]
    );

    try {
      const transaction = await register(
        chainId,
        ethersProvider,
        daoAddress, // this is the recipient
        paymentsInWei,
        data,
        type
      );
      console.log('transaction: ', transaction);

      setTx(transaction);

      updateStep((prevStep) => prevStep + 1);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <Flex
      direction='column'
      background='#262626'
      padding='1.5rem'
      minWidth='50%'
    >
      <HStack mb='.5rem' justifyContent='space-between'>
        <Text fontWeight='bold' variant='textOne'>
          Project Name:
        </Text>
        <Text variant='textOne' color='white' maxWidth='200px' isTruncated>
          {appState.project_name}
        </Text>
      </HStack>
      <HStack mb='.5rem' justifyContent='space-between'>
        <Text fontWeight='bold' variant='textOne'>
          Client Address:
        </Text>
        <AccountLink address={client} />
      </HStack>
      <HStack mb='.5rem' justifyContent='space-between'>
        <Text fontWeight='bold' variant='textOne'>
          Raid Party Address:
        </Text>
        <AccountLink address={serviceProvider} />
      </HStack>
      <HStack mb='.5rem' justifyContent='space-between'>
        <Text fontWeight='bold' variant='textOne'>
          Arbitration Provider:
        </Text>
        <Text variant='textOne' color='white'>
          LexDAO
        </Text>
      </HStack>
      <HStack mb='.5rem' justifyContent='space-between'>
        <Text fontWeight='bold' variant='textOne'>
          Payment Token:
        </Text>
        <Text variant='textOne' color='yellow.500'>
          {tokenType}
        </Text>
      </HStack>
      <HStack mb='.5rem' justifyContent='space-between'>
        <Text fontWeight='bold' variant='textOne'>
          Payment Due:
        </Text>
        <Text variant='textOne' color='yellow.500'>
          {paymentDue}
        </Text>
      </HStack>
      <HStack mb='.5rem' justifyContent='space-between'>
        <Text fontWeight='bold' variant='textOne'>
          No of Payments:
        </Text>
        <Text variant='textOne' color='yellow.500'>
          {milestones}
        </Text>
      </HStack>

      <Flex direction='row' width='100%'>
        <Button
          variant='outline'
          minW='25%'
          p='5px'
          mr='.5rem'
          // isDisabled={isLoading}
          onClick={() => updateStep((prevStep) => prevStep - 1)}
        >
          Back
        </Button>
        <Button
          variant='solid'
          w='100%'
          // isDisabled={isLoading}
          onClick={createInvoice}
        >
          {isLoading ? 'Creating Escrow..' : 'Create Escrow'}
        </Button>
      </Flex>
    </Flex>
  );
};
