import {
  NETWORK_CONFIG,
  RG_MULTISIG,
  RG_XDAI,
  SPOILS_BASIS_POINTS,
  updateRaidInvoice,
} from '@raidguild/escrow-utils';
import _ from 'lodash';
import { useMemo } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { encodeAbiParameters, Hex, parseEther, stringToHex } from 'viem';
import { useChainId, useContractWrite, usePrepareContractWrite } from 'wagmi';

import INVOICE_FACTORY_ABI from './contracts/InvoiceFactory.json';

const REQUIRES_VERIFICATION = true;

const useRegister = ({
  raidId,
  escrowForm,
}: {
  raidId: string;
  escrowForm: UseFormReturn;
}) => {
  const { watch } = escrowForm;
  const {
    payments,
    safetyValveDate,
    provider,
    client: clientAddress,
    token,
  } = watch();

  const chainId = useChainId();

  let daoAddress: Hex = provider;

  if (chainId === 100) {
    daoAddress = RG_XDAI as Hex;
  } else if (chainId === 1) {
    daoAddress = RG_MULTISIG as Hex;
  }

  const resolver = _.get(NETWORK_CONFIG[chainId], 'RESOLVERS.LexDAO.address');
  const tokenAddress = _.get(
    NETWORK_CONFIG[chainId],
    `TOKENS.${token}.address`
  );
  const wrappedNativeToken = _.get(
    NETWORK_CONFIG[chainId],
    'WRAPPED_NATIVE_TOKEN'
  );
  const factoryAddress = _.get(NETWORK_CONFIG[chainId], 'INVOICE_FACTORY');
  const terminationTime =
    safetyValveDate && BigInt(new Date(safetyValveDate).getTime() / 1000);

  // TODO handle decimals
  const paymentsInWei = _.map(payments, (amount: string) => parseEther(amount));

  const resolverType = 0; // 0 for individual, 1 for erc-792 arbitrator
  const type = stringToHex('split-escrow', { size: 32 });

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

  const escrowData = useMemo(() => {
    if (
      !clientAddress ||
      !(resolverType === 0 || resolverType === 1) ||
      !resolver ||
      !tokenAddress ||
      !terminationTime ||
      !wrappedNativeToken ||
      !factoryAddress ||
      !daoAddress
    ) {
      return undefined;
    }

    return encodeAbiParameters(
      [
        { type: 'address' },
        { type: 'uint8' },
        { type: 'address' },
        { type: 'address' },
        { type: 'uint256' },
        { type: 'bytes32' },
        { type: 'address' },
        { type: 'bool' },
        { type: 'address' },
        { type: 'address' },
        { type: 'uint256' },
      ],
      [
        clientAddress,
        resolverType,
        resolver, // address _resolver (LEX DAO resolver address)
        tokenAddress, // address _token (payment token address)
        terminationTime, // safety valve date
        '0x0000000000000000000000000000000000000000000000000000000000000000', // bytes32 _details detailHash
        wrappedNativeToken,
        REQUIRES_VERIFICATION, // requireVerification - this flag warns the client not to deposit funds until verifying they can release or lock funds
        factoryAddress,
        daoAddress,
        BigInt(SPOILS_BASIS_POINTS), // daoFee - basis points. percentage out of 10,000. 1,000 = 10% RG DAO fee
      ]
    );
  }, [
    clientAddress,
    resolverType,
    resolver,
    tokenAddress,
    terminationTime,
    wrappedNativeToken,
    factoryAddress,
    daoAddress,
  ]);
  console.log(escrowData);

  const {
    config,
    isLoading: prepareLoading,
    error: prepareError,
  } = usePrepareContractWrite({
    address: factoryAddress,
    functionName: 'create',
    abi: INVOICE_FACTORY_ABI,
    args: [
      provider, // address recipient,
      paymentsInWei, // uint256[] memory amounts,
      escrowData, // bytes memory escrowData,
      type, // bytes32 escrowType,
    ],
    enabled: !!terminationTime && !_.isEmpty(paymentsInWei) && !!escrowData,
  });
  console.log(prepareError);

  const {
    writeAsync,
    isLoading: writeLoading,
    error: writeError,
  } = useContractWrite({
    ...config,
    onSuccess: async (tx) => {
      console.log('success', tx);
      // TODO parse invoice address
      const smartInvoiceId = _.get(tx, 'events[0].args.invoice');
      await updateRaidInvoice(raidId, smartInvoiceId);
    },
    onError: (error) => {
      // eslint-disable-next-line no-console
      console.log('error', error);
    },
  });

  return {
    writeAsync,
    isLoading: prepareLoading || writeLoading,
    prepareError,
    writeError,
  };
};

export default useRegister;
