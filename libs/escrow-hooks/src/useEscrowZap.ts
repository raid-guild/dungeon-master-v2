import { NETWORK_CONFIG, ProjectDetails } from '@raidguild/escrow-utils';
import _ from 'lodash';
import { useMemo } from 'react';
import {
  encodeAbiParameters,
  Hex,
  isAddress,
  parseEther,
  TransactionReceipt,
} from 'viem';
import { useChainId, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { WriteContractResult } from 'wagmi/dist/actions';

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
  // provider,
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

  const milestoneAmounts = _.map(
    milestones,
    (a: { value: string }) => a.value && parseEther(a.value) // TODO handle token decimals
  );

  const { data: details, isLoading: detailsLoading } = useDetailsPin({
    ...detailsData,
  });
  // eslint-disable-next-line no-console
  console.log('details', details);

  const tokenAddress = _.get(
    NETWORK_CONFIG[chainId],
    `TOKENS.${token}.address`
  );
  // TODO other chains
  const resolver = daoSplit
    ? (_.first(_.keys(_.get(NETWORK_CONFIG[chainId], 'RESOLVERS'))) as Hex)
    : NETWORK_CONFIG[chainId].DAO_ADDRESS;

  console.log('encodeSafeData', threshold, saltNonce);
  const encodedSafeData = useMemo(() => {
    if (!threshold || !saltNonce) return undefined;
    return encodeAbiParameters(
      [{ type: 'uint256' }, { type: 'uint256' }],
      [BigInt(threshold), BigInt(saltNonce)]
    );
  }, [threshold, saltNonce]);

  console.log('encodeSplitData', projectTeamSplit, daoSplit);
  const encodedSplitData = useMemo(
    () =>
      encodeAbiParameters(
        [{ type: 'bool' }, { type: 'bool' }],
        [projectTeamSplit, daoSplit]
      ),
    [projectTeamSplit, daoSplit]
  );

  console.log(
    'encodeEscrowData',
    client,
    arbitration,
    resolver,
    tokenAddress,
    safetyValveDate,
    saltNonce,
    details
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
  // eslint-disable-next-line no-console
  console.log('escrow data', !!encodedEscrowData);

  const {
    config,
    isLoading: prepareLoading,
    error: prepareError,
  } = usePrepareContractWrite({
    chainId,
    address: NETWORK_CONFIG[chainId].ZAP_ADDRESS,
    abi: ESCROW_ZAP_ABI,
    functionName: 'createSafeSplitEscrow',
    args: [
      owners,
      percentAllocations,
      milestoneAmounts,
      encodedSafeData,
      // provider, // _safeAddress
      encodedSplitData,
      encodedEscrowData,
    ],
    enabled:
      !_.isEmpty(owners) &&
      _.every(owners, isAddress) &&
      !_.isEmpty(percentAllocations) &&
      !_.isEmpty(milestoneAmounts) &&
      !!encodedSafeData &&
      // !!provider && // _safeAddress
      !!encodedSplitData &&
      !!encodedEscrowData &&
      enabled,
  });

  const {
    writeAsync,
    isLoading: writeLoading,
    error: writeError,
  } = useContractWrite({
    ...config,
    onSuccess: async (tx) => {
      onSuccess?.(tx);
    },
  });
  // console.log(writeAsync);

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
  onSuccess?: (tx: WriteContractResult) => void;
}

export default useEscrowZap;
