import { SplitsClient } from '@0xsplits/splits-sdk-react';
import { chainsMap } from '@raidguild/dm-utils';
import { useQuery } from '@tanstack/react-query';
import { createPublicClient, http } from 'viem';

export const publicClient = (chainId: number) =>
  chainId &&
  createPublicClient({
    chain: chainsMap(chainId),
    transport: http(),
  });

const DEFAULT_TOKEN_LIST = {
  100: ['0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d'],
  5: ['0xe91D153E0b41518A2Ce8Dd3D7944Fa863463a97d'],
};

const fetchSplitEarnings = ({
  splitAddress,
  chainId,
}: {
  splitAddress: string;
  chainId: number;
}) => {
  const client = new SplitsClient({
    chainId,
    publicClient: publicClient(chainId),
  });
  return client.getSplitEarnings({
    splitAddress,
    erc20TokenList: DEFAULT_TOKEN_LIST[chainId],
  });
};

const useSplitEarnings = ({
  address: splitAddress,
  chainId,
}: {
  address: string;
  chainId: number;
}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['splitEarnings', splitAddress, chainId],
    queryFn: () => fetchSplitEarnings({ splitAddress, chainId }),
    enabled: !!splitAddress && !!chainId,
    // staleTime: 1000 * 60 * 15,
  });

  return { data, isLoading, error };
};

export default useSplitEarnings;
