import { Flex, Link, Text } from '@raidguild/design-system';
import { getAddressLink } from '@raidguild/dm-utils';
import blockies from 'blockies-ts';
import _ from 'lodash';
import { Hex } from 'viem';
import { useChainId, useEnsName } from 'wagmi';

type AccountLinkProps = {
  address: Hex;
  chainId?: number;
};

const AccountLink = ({ address: inputAddress, chainId }: AccountLinkProps) => {
  const currentChainId = useChainId();
  const { data: ensName } = useEnsName({ address: inputAddress, chainId: 1 });
  console.log(ensName);

  const address =
    typeof inputAddress === 'string' ? _.toLower(inputAddress) : '';

  const displayString = address;

  const imageUrl = blockies.create({ seed: inputAddress }).toDataURL();

  return (
    <Link
      href={getAddressLink(chainId || currentChainId, address)}
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
        {ensName || displayString}
      </Text>
    </Link>
  );
};

export default AccountLink;
