import { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Text,
  Tag,
  Link as ChakraLink,
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@chakra-ui/react';
import styled from '@emotion/styled';
import Link from 'next/link';
import Image from 'next/image';

import { AppContext } from '../context/AppContext';

import { getProfile } from '../utils/3box';
import { getAccountString, getNetworkLabel } from '../utils/helpers';
import { theme } from '../theme/theme';

const StyledButton = styled(Button)`
  &::after {
    box-sizing: inherit;
    transition: all ease-in-out 0.2s;
    background: none repeat scroll 0 0 ${theme.colors.red};
    content: '';
    display: block;
    height: 2px;
    width: 0;
    position: absolute;
    bottom: 0;
    left: 0;
    font-family: ${theme.fonts.rubik};
  }
  &:hover {
    text-decoration: none;
    ::after {
      width: 100%;
    }
  }
`;

export const NavButton = ({ onClick, children }) => (
  <StyledButton
    onClick={onClick}
    transition='all 0.5s ease 0.4s'
    my='1rem'
    variant='link'
    color='red'
    fontWeight='normal'
    fontSize='1.5rem'
  >
    {children}
  </StyledButton>
);

export const Header = () => {
  const { account, chainID, disconnect, connectAccount } =
    useContext(AppContext);
  const [isOpen, onOpen] = useState(false);

  const [profile, setProfile] = useState();

  useEffect(() => {
    if (account) {
      getProfile(account).then((p) => setProfile(p));
    }
  }, [account]);

  return (
    <Flex
      w='100%'
      color='white'
      fontFamily='rubik'
      justify='space-between'
      align='center'
      zIndex={5}
    >
      <Box zIndex={5}>
        <ChakraLink href='/' cursor='pointer'>
          <Flex align='center' p='1rem' m='1rem'>
            <Image src='/swords.png' alt='Raid Guild' width='60' height='50' />
            <Image
              src='/logo.svg'
              alt='Smart Invoice'
              width='150'
              height='50'
            />
          </Flex>
        </ChakraLink>
      </Box>

      <Flex align='center' height='8rem' transition='width 1s ease-out'>
        <Link href='/invoices' passHref>
          <Button variant='secondary' mr='1rem'>
            All Invoices
          </Button>
        </Link>
        {account && (
          <Flex justify='center' align='center' zIndex={5}>
            <Popover placement='bottom'>
              <PopoverTrigger>
                <Button
                  h='auto'
                  variant='secondary'
                  p={{ base: 0, md: 2 }}
                  mr='.5rem'
                >
                  <Flex
                    borderRadius='50%'
                    w='2.5rem'
                    h='2.5rem'
                    overflow='hidden'
                    justify='center'
                    align='center'
                    bgColor='black'
                    bgImage={profile && `url(${profile.imageUrl})`}
                    border={`1px solid ${theme.colors.white20}`}
                    bgSize='cover'
                    bgRepeat='no-repeat'
                    bgPosition='center center'
                  />

                  <Text
                    px={2}
                    display={{ base: 'none', md: 'flex' }}
                    fontFamily='jetbrains'
                    color='red'
                  >
                    {profile && profile.name
                      ? profile.name
                      : getAccountString(account)}
                  </Text>
                  <Tag
                    colorScheme='red'
                    display={{ base: 'none', md: 'flex' }}
                    size='sm'
                  >
                    {getNetworkLabel(chainID)}
                  </Tag>
                </Button>
              </PopoverTrigger>
              <PopoverContent bg='none' w='auto'>
                <Link href='/' passHref>
                  <Button
                    onClick={() => {
                      disconnect();
                    }}
                    variant='primary'
                    mt='0'
                  >
                    Disconnect
                  </Button>
                </Link>
              </PopoverContent>
            </Popover>
          </Flex>
        )}

        {account === '' && (
          <Button w='200px' variant='primary' onClick={connectAccount}>
            Connect Wallet
          </Button>
        )}
      </Flex>
    </Flex>
  );
};
