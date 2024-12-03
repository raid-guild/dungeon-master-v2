import { SplitsClient } from '@0xsplits/splits-sdk-react';
import { chainsMap, publicClient } from '@raidguild/dm-utils';
import { useQueries } from '@tanstack/react-query';
import _ from 'lodash';
import { useMemo } from 'react';
import { createWalletClient, custom, Hex } from 'viem';

const walletClient = ({ chainId }: { chainId: number }) => {
  if (!chainId) return undefined;
  const localWalletClient = createWalletClient({
    chain: chainsMap(chainId),
    transport: custom(window.ethereum),
  });

  return localWalletClient;
};

const splitsClient = (chainId: number) => {
  const localClient = new SplitsClient({
    chainId,
    publicClient: publicClient({ chainId }),
    walletClient: walletClient({ chainId }),
  });

  return localClient;
};

const fetchSplit = ({
  splitAddress,
  chainId,
}: {
  splitAddress: Hex;
  chainId: number;
}) => {
  const client = splitsClient(chainId);
  return client.dataClient.getSplitMetadata({ chainId, splitAddress });
};

const useSplitsMetadata = ({
  splits,
  chainId,
}: {
  splits: Hex[];
  chainId: number;
}) => {
  const queryData = useMemo(
    () =>
      _.map(_.compact(splits), (splitAddress: Hex) => ({
        queryKey: ['splitMetadata', splitAddress, chainId],
        queryFn: () => fetchSplit({ splitAddress, chainId }),
        enabled: !!splitsClient && !!splitAddress && !!chainId,
        // staleTime: 1000 * 60 * 15,
      })),
    [splits, chainId]
  );

  const splitsData = useQueries({
    queries: queryData,
  });

  const data = _.map(splitsData, 'data');
  const isLoading = _.some(splitsData, 'isLoading');

  return { data, isLoading };
};

export default useSplitsMetadata;
