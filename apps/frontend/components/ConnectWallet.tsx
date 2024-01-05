/* eslint-disable react/jsx-props-no-spreading */
import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@raidguild/design-system';
import { truncateAddress } from '@raidguild/dm-utils';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import _ from 'lodash';
import { CgProfile } from 'react-icons/cg';
import { FiChevronDown, FiKey, FiXCircle } from 'react-icons/fi';
import { useAccount, useDisconnect } from 'wagmi';

import Link from './ChakraNextLink';

const ConnectWallet = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
        authenticationStatus,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    variant='outline'
                    transition='all 100ms ease-in-out'
                    leftIcon={
                      <Icon as={FiKey} color='primary.500' w='20px' h='20px' />
                    }
                    onClick={openConnectModal}
                    data-cy='connect-wallet'
                  >
                    <Text color='whiteAlpha.900' fontFamily='texturina'>
                      Connect
                    </Text>
                  </Button>
                );
              }

              if (chain.unsupported) {
                return (
                  <Button onClick={openChainModal} variant='outline'>
                    Unsupported network
                  </Button>
                );
              }

              return (
                <Flex gap={3}>
                  <Menu
                    offset={[0, 4]}
                    placement='bottom-end'
                    autoSelect={false}
                  >
                    <Button
                      variant='outline'
                      width='fit'
                      onClick={openChainModal}
                    >
                      <HStack spacing={1} align='center'>
                        <Image
                          alt={chain.name ?? 'Chain icon'}
                          src={chain.iconUrl}
                          boxSize={chain?.id === 100 ? '20px' : '25px'}
                        />
                        <Text
                          color='whiteAlpha.700'
                          fontFamily='texturina'
                          display={{ base: 'none', lg: 'inline-block' }}
                        >
                          {chain.name}
                        </Text>
                      </HStack>
                    </Button>

                    <MenuButton as={Button} variant='outline' width='fit'>
                      <HStack spacing={3}>
                        <Text color='whiteAlpha.700'>
                          {account.ensName
                            ? account.ensName
                            : truncateAddress(account.address)}
                        </Text>
                        <Icon as={FiChevronDown} color='primary.500' />
                      </HStack>
                    </MenuButton>
                    <MenuList minWidth='none'>
                      <Link href={`/members/${_.toLower(address)}`}>
                        <MenuItem _hover={{ backgroundColor: 'gray.600' }}>
                          <HStack>
                            <Icon as={CgProfile} color='white' />
                            <Box color='white'>Profile</Box>
                          </HStack>
                        </MenuItem>
                      </Link>

                      <MenuItem
                        onClick={() => openAccountModal()}
                        _hover={{ backgroundColor: 'gray.600' }}
                      >
                        <HStack>
                          <Icon as={FiKey} color='white' />
                          <Box color='white'>Wallet</Box>
                        </HStack>
                      </MenuItem>
                      <MenuItem
                        onClick={() => disconnect()}
                        _hover={{ backgroundColor: 'gray.600' }}
                      >
                        <HStack spacing={2}>
                          <Icon as={FiXCircle} color='primary.500' />
                          <Box color='primary.500'>Sign Out</Box>
                        </HStack>
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Flex>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default ConnectWallet;
