import React, { useState, Component, createContext, ReactNode } from 'react';

import { ethers } from 'ethers';

import { rpcUrls } from '../smartEscrow/utils/constants';

export type SmartEscrowContextType = {
  //web3 needs
  appState: any;
  setAppState: any;
  invoice_id: string;
  provider: any;
  chainId: string;
};

export const SmartEscrowContext = createContext({} as SmartEscrowContextType);

interface SmartEscrowProviderProps {
  children?: ReactNode | undefined;
}

const DEFAULT_APP_STATE = {
  //web3 needs
  account: '',
  provider: '',
  web3Provider: '',
  chainId: '',

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

export const SmartEscrowContextProvider: React.FC<SmartEscrowProviderProps> = ({
  children,
}: SmartEscrowProviderProps) => {
  const [appState, setAppState] = useState<any>(DEFAULT_APP_STATE);
  return (
    <SmartEscrowContext.Provider value={{ appState, setAppState }}>
      {children}
    </SmartEscrowContext.Provider>
  );
};
