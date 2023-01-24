import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useMemo,
} from 'react';

export type IModals = {
  raidStatus: boolean;
  raidForm: boolean;
  memberForm: boolean;
};
const defaults: IModals = {
  raidStatus: false,
  raidForm: false,
  memberForm: false,
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

export const OverlayContextProvider: React.FC<OverlayProviderProps> = ({
  children,
}: OverlayProviderProps) => {
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
    <OverlayContext.Provider value={returnValue}>
      {children}
    </OverlayContext.Provider>
  );
};

export const useOverlay = (): OverlayContextType => useContext(OverlayContext);
