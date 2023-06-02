import React, { Component, createContext, ReactNode } from 'react';

import { ethers } from 'ethers';

import { rpcUrls } from '../smartEscrow/constants';

export type SmartEscrowContextType = {
  //web3 needs
};
export const SmartEscrow = createContext({} as SmartEscrowContextType);

interface SmartEscrowProviderProps {
  children?: ReactNode | undefined;
}

export const SmartEscrowContextProvider: React.FC<SmartEscrowProviderProps> = ({
  children,
}: SmartEscrowProviderProps) => {
  const state = {
    //web3 needs
    account: '',
    provider: '',
    web3: '',
    chainID: '',

    //dungeon master info
    v1_id: '',
    invoice_id: null,
    raid_id: '',
    project_name: '',
    client_name: '',
    link_to_details: '',
    brief_description: '',

    //math needs
    spoils_percent: 0.1,

    //checks
    isLoading: false,
  };
  return <SmartEscrow.Provider value={state}>{children}</SmartEscrow.Provider>;
};
