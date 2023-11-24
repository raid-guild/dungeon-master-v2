import { Flex, Link, Text } from '@raidguild/design-system';
import { getAddressLink } from '@raidguild/dm-utils';
import blockies from 'blockies-ts';
import _ from 'lodash';
import { useChainId } from 'wagmi';

type AccountLinkProps = {
  address: string;
  chainId?: number;
};

const AccountLink = ({ address: inputAddress, chainId }: AccountLinkProps) => {
  const currentChainId = useChainId();

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
        pl='0.25rem'
        fontSize='sm'
        maxW='12rem'
        color='white'
        isTruncated
      >
        {displayString}
      </Text>
    </Link>
  );
};

export default AccountLink;
