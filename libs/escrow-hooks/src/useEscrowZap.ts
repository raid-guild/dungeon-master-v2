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
// import ESCROW_ZAP_ABI from './contracts/EscrowZap.json';

const zapAbi = [
  {
    inputs: [
      { internalType: 'address[]', name: '_owners', type: 'address[]' },
      {
        internalType: 'uint32[]',
        name: '_percentAllocations',
        type: 'uint32[]',
      },
      {
        internalType: 'uint256[]',
        name: '_milestoneAmounts',
        type: 'uint256[]',
      },
      { internalType: 'bytes', name: '_safeData', type: 'bytes' },
      { internalType: 'bytes', name: '_splitsData', type: 'bytes' },
      { internalType: 'bytes', name: '_escrowData', type: 'bytes' },
    ],
    name: 'createSafeSplitEscrow',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];

const ZAP_ADDRESS = '0xD3b98C8D77D6d621aD2b27985A1aC56eC2758628';
const DAO_ADDRESS = {
  100: '0xf02fd4286917270cb94fbc13a0f4e1ed76f7e986',
};

const encodeDetailsString = (details: string) =>
  stringToHex(details, { size: 32 });

const ZAP_DATA = {
  percentAllocations: [50 * 1e4, 50 * 1e4], // raid party split percent allocations // current split main is 100% = 1e6
  milestoneAmounts: [
    BigInt(10) * BigInt(10) ** BigInt(18),
    BigInt(10) * BigInt(10) ** BigInt(18),
  ],
  threshold: 2,
  saltNonce: Math.floor(new Date().getTime() / 1000),
  arbitration: 0,
  isDaoSplit: false,
  token: '0x',
  escrowDeadline: Math.floor(new Date().getTime() / 1000) + 30 * 24 * 60 * 60,
  details: encodeDetailsString('ipfs://'),
};

// TODO sort
const separateOwnersAndAllocations = (ownersAndAllocations: any) => ({
  owners: _.map(ownersAndAllocations, 'address'),
  percentAllocations: _.map(
    ownersAndAllocations,
    (o: any) => _.toNumber(o.percent) * 1e4
  ),
});

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
}: // eslint-disable-next-line no-use-before-define
UseEscrowZapProps): {
  writeAsync: any;
  prepareError: any;
  writeError: any;
} => {
  const chainId = useChainId();

  const { owners, percentAllocations } =
    separateOwnersAndAllocations(ownersAndAllocations);

  const milestoneAmounts = _.map(
    milestones,
    (a: { value: string }) => a.value && parseEther(a.value)
  );

  const encodedSafeData = useMemo(() => {
    if (!threshold || !saltNonce) return undefined;
    return encodeAbiParameters(
      [{ type: 'uint256' }, { type: 'uint256' }],
      [BigInt(threshold), BigInt(saltNonce)]
    );
  }, [threshold, saltNonce]);

  const encodedSplitData = useMemo(
    () => encodeAbiParameters([{ type: 'bool' }], [ZAP_DATA.isDaoSplit]),
    [ZAP_DATA.isDaoSplit]
  );

  const encodedEscrowData = useMemo(() => {
    if (
      !isAddress(client) ||
      !arbitration?.value ||
      !details ||
      !isAddress(resolver) ||
      !isAddress(token?.value || '') ||
      !escrowDeadline
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
        0, // arbitration?.value,
        resolver,
        token?.value as Hex,
        BigInt(Math.floor(_.toNumber(escrowDeadline) / 1000)),
        BigInt(ZAP_DATA.saltNonce),
        encodeDetailsString(details),
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
    abi: zapAbi,
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
