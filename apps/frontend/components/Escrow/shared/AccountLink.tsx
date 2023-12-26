import { Flex, Link, Text } from '@raidguild/design-system';
import { getAddressLink, truncateAddress } from '@raidguild/dm-utils';
import { safeUrl, splitsLink } from '@raidguild/escrow-utils';
import blockies from 'blockies-ts';
import _ from 'lodash';
import { Hex } from 'viem';
import { useChainId, useEnsName } from 'wagmi';

type AccountLinkProps = {
  name?: string;
  address: Hex;
  isSplit?: boolean;
  isSafe?: boolean;
  chainId?: number;
};

const AccountLink = ({
  name,
  address: inputAddress,
  isSplit,
  isSafe,
  chainId,
}: AccountLinkProps) => {
  const currentChainId = useChainId();

  const { data: ensName } = useEnsName({ address: inputAddress, chainId: 1 });
  const address =
    typeof inputAddress === 'string' ? _.toLower(inputAddress) : '';
  const displayString = address;

  const imageUrl = blockies.create({ seed: address }).toDataURL();

  let link = getAddressLink(chainId || currentChainId, address);
  if (isSplit) {
    link = splitsLink(address, chainId || currentChainId);
  }
  if (isSafe) {
    link = safeUrl(chainId || currentChainId, address as Hex);
  }

  let displayName = name || ensName || displayString;
  if (isSplit) {
    displayName = `0xSplit (${truncateAddress(address)})`;
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
