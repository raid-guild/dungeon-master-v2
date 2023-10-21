import { ethers, BigNumber, utils } from 'ethers';
import { useChainId, useContractWrite, usePrepareContractWrite } from 'wagmi';
import _ from 'lodash';
import { useMemo } from 'react';
import ESCROW_ZAP_ABI from './contracts/EscrowZap.json';

const zapAddress = '0x5eCE0C5d739FaB121796D9BC73cb6aAaE6896b8d';

const ZAP_DATA = {
  percentAllocations: [50 * 1e4, 50 * 1e4], // raid party split percent allocations // current split main is 100% = 1e6
  milestoneAmounts: [
    BigNumber.from(10).mul(BigNumber.from(10).pow(18)),
    BigNumber.from(10).mul(BigNumber.from(10).pow(18)),
  ],
  threshold: 2,
  saltNonce: Math.floor(new Date().getTime() / 1000),
  arbitration: 1,
  isDaoSplit: false,
  token: '0x',
  escrowDeadline: Math.floor(new Date().getTime() / 1000) + 30 * 24 * 60 * 60,
  details: utils.formatBytes32String('ipfs://'),
};

const separateOwnersAndAllocations = (ownersAndAllocations: any) => {
  return {
    owners: _.map(ownersAndAllocations, 'address'),
    percentAllocations: _.map(ownersAndAllocations, (o) =>
      _.toNumber(o.percent)
    ),
  };
};

const useEscrowZap = ({
  ownersAndAllocations,
  milestones,
  client,
  resolver,
  threshold,
  saltNonce = ZAP_DATA.saltNonce,
  arbitration,
  isDaoSplit = false,
  token,
  escrowDeadline,
  details,
}: UseEscrowZapProps) => {
  const chainId = useChainId();

  const { owners, percentAllocations } =
    separateOwnersAndAllocations(ownersAndAllocations);

  const milestoneAmounts = _.map(
    milestones,
    (a) => a.value && utils.parseEther(a.value)
  );

  const encodedSafeData = useMemo(() => {
    if (!threshold || !saltNonce) return undefined;
    return ethers.utils.defaultAbiCoder.encode(
      ['uint256', 'uint256'],
      [threshold, saltNonce]
    );
  }, [threshold, saltNonce]);

  const encodedEscrowData = useMemo(() => {
    if (
      !utils.isAddress(client) ||
      !arbitration?.value ||
      !details ||
      !utils.isAddress(resolver) ||
      !utils.isAddress(token?.value) ||
      !escrowDeadline
    )
      return undefined;

    return utils.defaultAbiCoder.encode(
      [
        'address',
        'uint32',
        'address',
        'address',
        'uint256',
        'uint256',
        'bytes32',
      ],
      [
        client,
        arbitration?.value,
        resolver,
        token?.value,
        _.toNumber(escrowDeadline),
        ZAP_DATA.saltNonce,
        utils.formatBytes32String(details),
      ]
    );
  }, [
    token?.value,
    escrowDeadline,
    details,
    client,
    arbitration?.value,
    resolver,
  ]);

  const { config, error: prepareError } = usePrepareContractWrite({
    chainId,
    address: zapAddress,
    abi: ESCROW_ZAP_ABI,
    functionName: 'createSafeSplitEscrow',
    args: [
      owners,
      percentAllocations,
      milestoneAmounts,
      encodedSafeData,
      encodedEscrowData,
    ],
    enabled:
      !_.isEmpty(owners) &&
      _.every(owners, utils.isAddress) &&
      !_.isEmpty(percentAllocations) &&
      !_.isEmpty(milestoneAmounts) &&
      !!encodedSafeData &&
      !!encodedEscrowData,
  });
  // console.log(config, prepareError);

  const { writeAsync, error: writeError } = useContractWrite({
    ...config,
  });
  // console.log(writeAsync);

  return {
    writeAsync,
    prepareError,
    writeError,
  };
};

interface UseEscrowZapProps {
  ownersAndAllocations: any; //  { address: string; percent: number }[];
  milestones: { value?: string }[];
  client: string;
  resolver: string;
  threshold?: number;
  saltNonce?: number;
  arbitration?: { value?: number; label?: string };
  isDaoSplit?: boolean;
  token: { value?: string; label?: string };
  escrowDeadline: number;
  details: string;
}

export default useEscrowZap;
