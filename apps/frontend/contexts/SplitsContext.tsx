import { SplitsProvider } from '@0xsplits/splits-sdk-react';
import { chainsMap } from '@raidguild/dm-utils';
import { ReactNode, useMemo } from 'react';
import { createPublicClient, http } from 'viem';

export const publicClient = (chainId: number) =>
  chainId &&
  createPublicClient({
    chain: chainsMap(chainId),
    transport: http(),
  });

const SplitsContext = ({
  chainId = 100,
  children,
}: {
  chainId: number;
  children: ReactNode;
}) => {
  const splitsConfig = useMemo(
    () => ({
      chainId,
      publicClient: publicClient(chainId),
    }),
    [chainId]
  );
  if (!chainId) return children;

  return <SplitsProvider config={splitsConfig}>{children}</SplitsProvider>;
};

export default SplitsContext;
