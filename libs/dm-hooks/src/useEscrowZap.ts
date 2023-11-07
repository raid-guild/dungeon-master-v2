import { ethers, BigNumber, utils } from 'ethers';
import { useChainId, useContractWrite, usePrepareContractWrite } from 'wagmi';
import _ from 'lodash';
import { useMemo } from 'react';
import ESCROW_ZAP_ABI from './contracts/EscrowZap.json';

const ZAP_ADDRESS = '0xD3b98C8D77D6d621aD2b27985A1aC56eC2758628';
const DAO_ADDRESS = {
  100: '0xf02fd4286917270cb94fbc13a0f4e1ed76f7e986',
};

declare module 'wagmi' {
  interface WriteContractResult {
    txHash: string;
    status: string;
    error: string;
    events: any[];
  }
}

const ZAP_DATA = {
  percentAllocations: [50 * 1e4, 50 * 1e4], // raid party split percent allocations // current split main is 100% = 1e6
  milestoneAmounts: [
    BigNumber.from(10).mul(BigNumber.from(10).pow(18)),
    BigNumber.from(10).mul(BigNumber.from(10).pow(18)),
  ],
  threshold: 2,
  saltNonce: Math.floor(new Date().getTime() / 1000),
  arbitration: 0,
  isDaoSplit: false,
  token: '0x',
  escrowDeadline: Math.floor(new Date().getTime() / 1000) + 30 * 24 * 60 * 60,
  details: utils.formatBytes32String('ipfs://'),
};

// TODO sort
const separateOwnersAndAllocations = (ownersAndAllocations: any) => {
  return {
    owners: _.map(ownersAndAllocations, 'address'),
    percentAllocations: _.map(
      ownersAndAllocations,
      (o) => _.toNumber(o.percent) * 1e4
    ),
  };
};

// ! resolver should be lexdao for DAO split
// ! resolver should be dao for non DAO split
// ! arbitration should be constant

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
}: UseEscrowZapProps): {
  writeAsync: () => Promise<any> | undefined;
  prepareError: Error;
  writeError: Error;
} => {
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

  const encodedSplitData = useMemo(() => {
    return ethers.utils.defaultAbiCoder.encode(['bool'], [ZAP_DATA.isDaoSplit]);
  }, [ZAP_DATA.isDaoSplit]);

  // console.log(ZAP_DATA.escrowDeadline, _.toNumber(escrowDeadline));
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
        Math.floor(_.toNumber(escrowDeadline) / 1000),
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
  // console.log('escrow data', encodedEscrowData);
  // console.log('split data', encodedSplitData);
  // console.log('safe data', encodedSafeData);
  // console.log(owners, percentAllocations, milestoneAmounts);

  const { config, error: prepareError } = usePrepareContractWrite({
    chainId,
    address: ZAP_ADDRESS,
    abi: ESCROW_ZAP_ABI,
    functionName:
      'createSafeSplitEscrow(address[],uint32[],uint256[],bytes,bytes,bytes)',
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
      _.every(owners, utils.isAddress) &&
      !_.isEmpty(percentAllocations) &&
      !_.isEmpty(milestoneAmounts) &&
      !!encodedSafeData &&
      !!encodedSplitData &&
      !!encodedEscrowData,
  });
  console.log('prepare error', prepareError);

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