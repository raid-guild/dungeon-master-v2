import { Flex, Link, Text } from '@raidguild/design-system';
import _ from 'lodash';

import { getAddressLink } from '@raidguild/dm-utils';
import { useChainId } from 'wagmi';

type AccountLinkProps = {
  address: string;
  chainId?: number;
};

export const AccountLink = ({
  address: inputAddress,
  chainId,
}: AccountLinkProps) => {
  const currentChainId = useChainId();

  const address =
    typeof inputAddress === 'string' ? _.toLower(inputAddress) : '';

  let displayString = address;

  let imageUrl;

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
        w='1.1rem'
        h='1.1rem'
        overflow='hidden'
        justify='center'
        align='center'
        bgColor='black'
        bgImage={imageUrl && `url(${imageUrl})`}
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
