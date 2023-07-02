/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useContext } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import _ from 'lodash';
import { useAccount, useDisconnect, useNetwork } from 'wagmi';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  HStack,
  Box,
  Flex,
  Image,
  Text,
  Button,
} from '@raidguild/design-system';
import { CgProfile } from 'react-icons/cg';
import { FiKey, FiChevronDown, FiXCircle } from 'react-icons/fi';
import { truncateAddress } from '@raidguild/dm-utils';
import Link from './ChakraNextLink';
import { SmartEscrowContext } from '../contexts/SmartEscrow';
import { useSigner } from 'wagmi';
import Web3 from 'web3';
import { rpcUrls } from '../smartEscrow/utils/constants';
import { ethers } from 'ethers';

const ConnectWallet: React.FC = () => {
  const context = useContext(SmartEscrowContext);
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data: signer } = useSigner();
  const { disconnect } = useDisconnect();
  const showNetwork = false; // maybe unhide, in some cases
  useEffect(() => {
    if (address && signer && chain.id) {
      const web3Provider = new Web3(window.ethereum);
      const gotProvider = new ethers.providers.Web3Provider(
        web3Provider.currentProvider
      );
      context.setAppState({
        ...context.appState,
        provider: signer,
        account: address,
        chainId: chain.id,
        web3Provider: gotProvider,
      });
    }
  }, [address, signer, chain]);

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
                    Connect
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
                    {showNetwork && (
                      <Button
                        variant='outline'
                        width='fit'
                        onClick={openChainModal}
                      >
                        <Image
                          alt={chain.name ?? 'Chain icon'}
                          src={chain.iconUrl}
                          width={25}
                          height={25}
                          mr={2}
                        />
                        {chain.name}
                      </Button>
                    )}

                    <MenuButton as={Button} variant='outline' width='fit'>
                      <HStack spacing={3}>
                        <Text color='white'>
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
