/* eslint-disable no-console */
import { NETWORK_CONFIG, ProjectDetails } from '@raidguild/escrow-utils';
import _ from 'lodash';
import { useCallback, useMemo } from 'react';
import {
  encodeAbiParameters,
  Hex,
  isAddress,
  parseUnits,
  WriteContractReturnType,
} from 'viem';
import { useChainId, useSimulateContract, useWriteContract } from 'wagmi';

import ESCROW_ZAP_ABI from './contracts/EscrowZap.json';
import useDetailsPin from './useDetailsPin';

type OwnerAndAllocation = { address: string; percent: number };

const separateOwnersAndAllocations = (
  ownersAndAllocations: OwnerAndAllocation[]
) => {
  const sortedOwnersAndAllocations = _.sortBy(ownersAndAllocations, 'address');

  return {
    owners: _.map(sortedOwnersAndAllocations, 'address'),
    percentAllocations: _.map(
      sortedOwnersAndAllocations,
      (o: OwnerAndAllocation) => _.toNumber(o.percent) * 1e4
    ),
  };
};

const useEscrowZap = ({
  ownersAndAllocations,
  provider,
  milestones,
  client,
  threshold,
  arbitration = 0,
  projectTeamSplit = false,
  daoSplit = false,
  token,
  safetyValveDate,
  detailsData,
  enabled = true,
  onSuccess,
}: UseEscrowZapProps) => {
  const chainId = useChainId();

  const { owners, percentAllocations } =
    separateOwnersAndAllocations(ownersAndAllocations);
  const saltNonce = Math.floor(new Date().getTime() / 1000);

  const tokenAddress = _.get(
    NETWORK_CONFIG[chainId],
    `TOKENS.${token}.address`
  );

  const tokenDecimals = _.get(
    NETWORK_CONFIG[chainId],
    `TOKENS.${token}.decimals`
  );

  const milestoneAmounts = _.map(
    NETWORK_CONFIG[chainId] ? milestones : [],
    (a: { value: string }) => a.value && parseUnits(a.value, tokenDecimals)
  );

  const { data: details, isLoading: detailsLoading } = useDetailsPin({
    ...detailsData,
  });
  console.log('details', details);

  // TODO other chains
  const resolver = daoSplit
    ? (_.first(_.keys(_.get(NETWORK_CONFIG[chainId], 'RESOLVERS'))) as Hex)
    : NETWORK_CONFIG[chainId].DAO_ADDRESS;

  const encodedSafeData = useMemo(() => {
    if (!threshold || !saltNonce)
      return encodeAbiParameters(
        [{ type: 'uint256' }, { type: 'uint256' }],
        [BigInt(0), BigInt(0)]
      );

    return encodeAbiParameters(
      [{ type: 'uint256' }, { type: 'uint256' }],
      [BigInt(threshold), BigInt(saltNonce)]
    );
  }, [threshold, saltNonce]);
  console.log(
    'encodeSafeData - ',
    'threshold',
    threshold,
    'nonce',
    saltNonce,
    'compiled data',
    !!encodedSafeData
  );

  const encodedSplitData = useMemo(
    () =>
      encodeAbiParameters(
        [{ type: 'bool' }, { type: 'bool' }],
        [projectTeamSplit, daoSplit]
      ),
    [projectTeamSplit, daoSplit]
  );
  console.log(
    'encodeSplitData - ',
    'team split',
    projectTeamSplit,
    'dao split',
    daoSplit,
    'compiled data',
    !!encodedSplitData
  );

  const encodedEscrowData = useMemo(() => {
    if (
      !isAddress(client) ||
      !(arbitration === 0 || arbitration === 1) ||
      !details ||
      !isAddress(resolver) ||
      !isAddress(tokenAddress) ||
      !safetyValveDate
    )
      return undefined;

    return encodeAbiParameters(
      [
        { type: 'address' },
        { type: 'uint32' },
        { type: 'address' },
        { type: 'address' },
        { type: 'uint256' },
        { type: 'uint256' },
        { type: 'bytes32' },
      ],
      [
        client as Hex,
        arbitration,
        resolver,
        tokenAddress,
        BigInt(Math.floor(_.toNumber(safetyValveDate) / 1000)),
        BigInt(saltNonce),
        details,
      ]
    );
  }, [tokenAddress, safetyValveDate, details, client, arbitration, resolver]);
  console.log(
    'encodeEscrowData - ',
    {
      client,
      arbitration,
      resolver,
      tokenAddress,
      safetyValveDate,
      saltNonce,
      details,
    },
    'compiled data',
    !!encodedEscrowData
  );

  console.log(
    'enabled prepare',
    {
      owners,
      percentAllocations,
      milestoneAmounts,
      encodedSafeData,
      provider,
      encodedSplitData,
      encodedEscrowData,
      enabled,
    },
    _.isEqual(_.size(percentAllocations), _.size(owners)) &&
      !_.isEmpty(milestoneAmounts) &&
      !!encodedSafeData &&
      !!provider && // _safeAddress
      !!encodedSplitData &&
      !!encodedEscrowData &&
      enabled
  );
  const {
    data,
    isLoading: prepareLoading,
    error: prepareError,
    status,
  } = useSimulateContract({
    chainId,
    address: NETWORK_CONFIG[chainId].ZAP_ADDRESS,
    abi: ESCROW_ZAP_ABI,
    functionName: 'createSafeSplitEscrow',
    args: [
      owners,
      percentAllocations,
      milestoneAmounts,
      encodedSafeData,
      provider, // _safeAddress
      encodedSplitData,
      encodedEscrowData,
    ],
    enabled:
      _.isEqual(_.size(percentAllocations), _.size(owners)) &&
      !_.isEmpty(milestoneAmounts) &&
      !!encodedSafeData &&
      !!provider && // _safeAddress
      !!encodedSplitData &&
      !!encodedEscrowData &&
      enabled,
  });
  console.log('prepareError', prepareError, status);

  const {
    writeContractAsync,
    isPending: writeLoading,
    error: writeError,
  } = useWriteContract({
    mutation: {
      onSuccess: async (tx) => {
        onSuccess?.(tx);
      },
    },
  });

  const writeAsync = useCallback(async (): Promise<Hex | undefined> => {
    try {
      if (!data) {
        throw new Error('simulation data is not available');
      }
      return writeContractAsync(data.request);
    } catch (error) {
      console.error('useEscrowZap error', error);
      return undefined;
    }
  }, [writeContractAsync, data]);

  return {
    writeAsync,
    isLoading: prepareLoading || writeLoading || detailsLoading,
    prepareError,
    writeError,
  };
};

interface UseEscrowZapProps {
  ownersAndAllocations: OwnerAndAllocation[];
  provider: Hex | undefined;
  milestones: { value?: string }[];
  client: string;
  threshold?: number;
  arbitration?: number;
  projectTeamSplit?: boolean;
  daoSplit?: boolean;
  token: { value?: string; label?: string };
  safetyValveDate: Date;
  detailsData: ProjectDetails;
  enabled?: boolean;
  onSuccess?: (tx: WriteContractReturnType) => void;
}

export default useEscrowZap;
