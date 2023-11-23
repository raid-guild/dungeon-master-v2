import { UseFormReturn } from 'react-hook-form';
import { useChainId, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { SPOILS_BASIS_POINTS, NETWORK_CONFIG } from '@raidguild/escrow-utils';
import { Hex, encodeAbiParameters, stringToHex, parseEther } from 'viem';
import _ from 'lodash';

const REQUIRES_VERIFICATION = true;

const useRegister = ({
  escrowForm,
}: {
  escrowForm: UseFormReturn;
}): {
  writeAsync: (() => Promise<any>) | undefined;
  isLoading: boolean | undefined;
  prepareError: Error | null;
  writeError: Error | null;
} => {
  console.log('useRegister');
  const { watch } = escrowForm;
  const {
    payments,
    selectedDay,
    serviceProvider,
    client: clientAddress,
    tokenType,
  } = watch();

  const chainId = useChainId();

  let daoAddress: Hex = '0x';

  if (chainId === 100) {
    daoAddress = NETWORK_CONFIG['RG_XDAI'];
  } else if (chainId === 1) {
    daoAddress = NETWORK_CONFIG['RG_MULTISIG'];
  } else {
    daoAddress = serviceProvider;
  }

  const resolver = _.get(NETWORK_CONFIG[chainId], 'RESOLVERS.LexDAO.address');
  const tokenAddress = _.get(
    NETWORK_CONFIG[chainId],
    `TOKENS.${tokenType}.address`
  );
  const wrappedNativeToken = _.get(
    NETWORK_CONFIG[chainId],
    'WRAPPED_NATIVE_TOKEN'
  );
  const factoryAddress = _.get(NETWORK_CONFIG[chainId], 'INVOICE_FACTORY');
  const paymentsInWei = [];
  const terminationTime = new Date(selectedDay).getTime() / 1000;

  payments.map((amount: string) => paymentsInWei.push(parseEther(amount)));

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

  const data = encodeAbiParameters(
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
      BigInt(terminationTime), // safety valve date
      '0x0000000000000000000000000000000000000000000000000000000000000000', //bytes32 _details detailHash
      wrappedNativeToken,
      REQUIRES_VERIFICATION, // requireVerification - this flag warns the client not to deposit funds until verifying they can release or lock funds
      factoryAddress,
      daoAddress,
      BigInt(SPOILS_BASIS_POINTS), // daoFee - basis points. percentage out of 10,000. 1,000 = 10% RG DAO fee
    ]
  );

  const {
    config,
    isLoading: prepareLoading,
    error: prepareError,
  } = usePrepareContractWrite({
    address: factoryAddress,
    functionName: 'create',
    abi: ['create()'],
    args: [],
  });

  const {
    writeAsync,
    isLoading: writeLoading,
    error: writeError,
  } = useContractWrite({
    ...config,
    onSuccess: () => {
      console.log('success');
    },
    onError: (error) => {
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
