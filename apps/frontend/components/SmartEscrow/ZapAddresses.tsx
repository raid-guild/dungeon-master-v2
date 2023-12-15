import { Card, Heading, Stack, Text } from '@raidguild/design-system';
import React from 'react';
import { Hex, zeroAddress } from 'viem';
import { useNetwork } from 'wagmi';

import Link from '../ChakraNextLink';

const SAFE_URL = 'https://app.safe.global/home';
const SPLITS_URL = 'https://app.0xsplits.org';
// const ESCROW_URL = 'https://dm.raidguild.org/escrow/';

const ZapAddresses = ({
  addresses,
  raidId,
}: {
  addresses: Hex[];
  raidId: string;
}) => {
  const { chain } = useNetwork();

  if (!addresses) return null;
  const [safe, projectTeamSplit, daoSplit, escrow] = addresses || [];

  return (
    <Card bg='purple.800'>
      <Stack>
        <Heading size='md'>Safe, Split(s) & Escrow created</Heading>
        {safe !== zeroAddress && (
          <Text>
            Safe:{' '}
            <Link
              href={`${SAFE_URL}?safe=${chain.name.slice(0, 3)}:${safe}`}
              isExternal
            >
              {safe}
            </Link>
          </Text>
        )}
        {projectTeamSplit !== zeroAddress && (
          <Text>
            Project Team Split:{' '}
            <Link
              href={`${SPLITS_URL}/accounts/${projectTeamSplit}?chainId=${chain?.id}`}
              isExternal
            >
              {projectTeamSplit}
            </Link>
          </Text>
        )}
        {daoSplit !== zeroAddress && (
          <Text>
            DAO Split:{' '}
            <Link
              href={`${SPLITS_URL}/accounts/${daoSplit}?chainId=${chain?.id}`}
              isExternal
            >
              {daoSplit}
            </Link>
          </Text>
        )}
        <Text>
          Escrow:{' '}
          <Link
            // TODO smartinvoice.xyz url or internal escrow url
            href={
              raidId
                ? `/escrow/${raidId}`
                : `${
                    chain.blockExplorers?.etherscan?.url ||
                    chain.blockExplorers?.default?.url
                  }/address/${escrow}`
            }
          >
            {escrow}
          </Link>
        </Text>
      </Stack>
    </Card>
  );
};

export default ZapAddresses;
