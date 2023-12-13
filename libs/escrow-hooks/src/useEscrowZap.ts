import { NETWORK_CONFIG } from '@raidguild/escrow-utils';
import _ from 'lodash';
import { useMemo } from 'react';
import {
  encodeAbiParameters,
  Hex,
  isAddress,
  parseEther,
  stringToHex,
} from 'viem';
import { useChainId, useContractWrite, usePrepareContractWrite } from 'wagmi';

import ESCROW_ZAP_ABI from './contracts/EscrowZap.json';

type OwnerAndAllocation = { address: string; percent: number };

export const encodeDetailsString = (details: string) =>
  stringToHex(details, { size: 32 });

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
  details,
  enabled = true,
}: UseEscrowZapProps) => {
  const chainId = useChainId();

  const { owners, percentAllocations } =
    separateOwnersAndAllocations(ownersAndAllocations);
  const saltNonce = Math.floor(new Date().getTime() / 1000);

  const milestoneAmounts = _.map(
    milestones,
    (a: { value: string }) => a.value && parseEther(a.value)
  );

  const tokenAddress = _.get(
    NETWORK_CONFIG[chainId],
    `TOKENS.${token}.address`
  );
  const resolver = daoSplit
    ? (_.first(_.keys(_.get(NETWORK_CONFIG[chainId], 'RESOLVERS'))) as Hex)
    : NETWORK_CONFIG[chainId].DAO_ADDRESS;

  const encodedSafeData = useMemo(() => {
    if (!threshold || !saltNonce) return undefined;
    return encodeAbiParameters(
      [{ type: 'uint256' }, { type: 'uint256' }],
      [BigInt(threshold), BigInt(saltNonce)]
    );
  }, [threshold, saltNonce]);

  const encodedSplitData = useMemo(
    () =>
      encodeAbiParameters(
        [{ type: 'bool' }, { type: 'bool' }],
        [projectTeamSplit, daoSplit]
      ),
    [projectTeamSplit, daoSplit]
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
        encodeDetailsString(details),
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
      encodedSplitData,
      encodedEscrowData,
    ],
    enabled:
      !_.isEmpty(owners) &&
      _.every(owners, isAddress) &&
      !_.isEmpty(percentAllocations) &&
      !_.isEmpty(milestoneAmounts) &&
      !!encodedSafeData &&
      !!encodedSplitData &&
      !!encodedEscrowData &&
      enabled,
  });
  console.log('prepare error', prepareError);

  const {
    writeAsync,
    isLoading: writeLoading,
    error: writeError,
  } = useContractWrite({
    ...config,
  });
  // console.log(writeAsync);

  return {
    writeAsync,
    isLoading: prepareLoading || writeLoading,
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
  details: string;
  enabled?: boolean;
}

export default useEscrowZap;
