import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from 'react';
import { useChainId } from 'wagmi';

import SplitContext from './SplitsContext';

export type IModals = {
  raidStatus: boolean;
  raidForm: boolean;
  memberForm: boolean;
  contactUpdate: boolean;
  raidPartyForm: boolean;
  retroLinkUpdate: boolean;
};
const defaults: IModals = {
  raidStatus: false,
  raidForm: false,
  memberForm: false,
  contactUpdate: false,
  raidPartyForm: false,
  retroLinkUpdate: false,
};

export type OverlayContextType = {
  modals: IModals;
  setModals: (modals: Partial<IModals>) => void;
  closeModals: () => void;
  commandPallet: boolean;
  setCommandPallet: (commandPallet: boolean) => void;
};

export const OverlayContext = createContext({} as OverlayContextType);

interface OverlayProviderProps {
  children?: ReactNode | undefined;
}

export const OverlayContextProvider = ({ children }: OverlayProviderProps) => {
  const chainId = useChainId();
  const [modals, setModals] = useState(defaults);
  const [commandPallet, setCommandPallet] = useState(false);

  const showModal = (m: Partial<IModals>) => {
    // This allows to show only one modal at a time.
    // In addition, this reset any true value for other modals.
    setModals({ ...defaults, ...m });
  };

  const closeModals = () => {
    setModals(defaults);
  };

  const returnValue = useMemo(
    () => ({
      modals,
      setModals: showModal,
      closeModals,
      commandPallet,
      setCommandPallet,
    }),
    [modals, commandPallet]
  );

  return (
    <SplitContext chainId={chainId}>
      <OverlayContext.Provider value={returnValue}>
        {children}
      </OverlayContext.Provider>
    </SplitContext>
  );
};

export const useOverlay = (): OverlayContextType => useContext(OverlayContext);
