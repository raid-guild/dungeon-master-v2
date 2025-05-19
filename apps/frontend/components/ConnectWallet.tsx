/* eslint-disable react/jsx-props-no-spreading */
import { truncateAddress } from '@raidguild/dm-utils';
import {
  Button,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@raidguild/ui';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import _ from 'lodash';
import Image from 'next/image';
import { CgProfile } from 'react-icons/cg';
import { FiKey, FiXCircle } from 'react-icons/fi';
import { useAccount, useDisconnect } from 'wagmi';

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
            className='font-texturina'
          >
            {(() => {
              if (!connected) {
                return (
                  <Button
                    className='transition-all duration-100 ease-in-out'
                    variant='outline'
                    onClick={openConnectModal}
                    data-cy='connect-wallet'
                  >
                    <FiKey className='w-5 h-5 text-primary' />
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
                <div className='flex items-center gap-3'>
                  <Button variant='outline' onClick={openChainModal}>
                    <Image
                      alt={chain.name ?? 'Chain icon'}
                      src={chain.iconUrl!}
                      width={chain?.id === 100 ? 20 : 25}
                      height={chain?.id === 100 ? 20 : 25}
                      className='rounded-full'
                    />
                    {chain.name}
                  </Button>
                  <NavigationMenu>
                    <NavigationMenuList>
                      <NavigationMenuItem>
                        <NavigationMenuTrigger>
                          {account.ensName
                            ? account.ensName
                            : truncateAddress(account.address)}
                        </NavigationMenuTrigger>

                        <NavigationMenuContent>
                          <ul className='w-[120px]'>
                            <NavigationMenuLink
                              className='select-none hover:bg-gray-600'
                              href={`/members/${_.toLower(address)}`}
                            >
                              <div className='flex items-center gap-2'>
                                <CgProfile className='text-white' />
                                <p className='text-white'>Profile</p>
                              </div>
                            </NavigationMenuLink>
                            <NavigationMenuLink
                              className='select-none hover:bg-gray-600'
                              onClick={() => openAccountModal()}
                            >
                              <div className='flex items-center gap-2'>
                                <FiKey className='text-white' />
                                <p className='text-white'>Wallet</p>
                              </div>
                            </NavigationMenuLink>
                            <NavigationMenuLink
                              className='select-none hover:bg-gray-600'
                              onClick={() => disconnect()}
                            >
                              <div className='flex items-center gap-2 text-primary'>
                                <FiXCircle className='text-white' />
                                <p className='text-white'>Sign Out</p>
                              </div>
                            </NavigationMenuLink>
                          </ul>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default ConnectWallet;
