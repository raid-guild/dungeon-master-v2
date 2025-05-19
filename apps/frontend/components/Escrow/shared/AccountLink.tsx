import { Flex, Link, Text } from '@raidguild/design-system';
import { getAddressLink, truncateAddress } from '@raidguild/dm-utils';
import { NETWORK_CONFIG, safeUrl, splitsLink } from '@raidguild/escrow-utils';
import blockies from 'blockies-ts';
import _ from 'lodash';
import { Hex } from 'viem';
import { useChainId, useReadContract, useEnsName } from 'wagmi';

type AccountLinkProps = {
  name?: string;
  address: Hex;
  chainId: number;
  isSplit?: boolean;
  // isSafe?: boolean;
};

const AccountLink = ({
  name,
  address: inputAddress,
  isSplit,
  // isSafe,
  chainId,
}: AccountLinkProps) => {
  const currentChainId = useChainId();

  const { data: ensName } = useEnsName({ address: inputAddress, chainId: 1 });
  const address =
    typeof inputAddress === 'string'
      ? (_.toLower(inputAddress) as Hex)
      : undefined;
  const displayString = address;

  const imageUrl = blockies.create({ seed: address }).toDataURL();

  const { data: isSafe } = useReadContract({
    address,
    abi: [
      {
        inputs: [],
        name: 'VERSION',
        outputs: [{ internalType: 'string', name: '', type: 'string' }],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    functionName: 'VERSION',
    args: [],
  });

  // handle link and display name
  let link = getAddressLink(chainId || currentChainId, address);
  let displayName = name || ensName || displayString;
  if (isSplit) {
    link = splitsLink(address, chainId || currentChainId);
    displayName = `0xSplit (${truncateAddress(address)})`;
  }
  if (isSafe) {
    link = safeUrl(chainId || currentChainId, address as Hex);
    if (_.isUndefined(name)) {
      displayName = `Gnosis Safe (${truncateAddress(address)})`;
    }
  }
  // guild addresses
  if (_.eq(address, NETWORK_CONFIG[chainId]?.DAO_ADDRESS)) {
    displayName = 'Raid Guild DAO';
  }
  if (_.eq(address, NETWORK_CONFIG[chainId]?.TREASURY_ADDRESS)) {
    displayName = 'Raid Guild Treasury';
  }

  return (
    <Link
      href={link}
      isExternal
      display='inline-flex'
      textAlign='right'
      bgColor='black'
      px='0.25rem'
      _hover={{
        textDecor: 'none',
        bgColor: 'blackLight',
      }}
      borderRadius='5px'
      alignItems='center'
      fontWeight='bold'
    >
      <Flex
        as='span'
        borderRadius='50%'
        w='14px'
        h='14px'
        overflow='hidden'
        justify='center'
        align='center'
        bgImage={imageUrl && imageUrl}
        bgSize='cover'
        bgRepeat='no-repeat'
        bgPosition='center center'
      />
      <Text
        as='span'
        px='0.25rem'
        fontSize='sm'
        maxW='12rem'
        color='white'
        isTruncated
      >
        {displayName}
      </Text>
    </Link>
  );
};

export default AccountLink;
