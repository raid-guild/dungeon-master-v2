import { SplitsProvider } from '@0xsplits/splits-sdk-react';
import {
  chainsMap,
  publicClient as wagmiPublicClient,
} from '@raidguild/dm-utils';
import { ReactNode, useMemo } from 'react';

export const publicClient = (chainId: number) =>
  chainId && wagmiPublicClient({ chainId });

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
