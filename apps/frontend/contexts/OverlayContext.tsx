import React, { createContext, useState, useContext, ReactNode } from 'react';

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
};

export const OverlayContext = createContext({} as OverlayContextType);

interface OverlayProviderProps {
  children?: ReactNode | undefined;
}

export const OverlayContextProvider: React.FC<OverlayProviderProps> = ({
  children,
}: OverlayProviderProps) => {
  const [modals, setModals] = useState(defaults);
  const showModal = (modals: Partial<IModals>) => {
    // This allows to show only one modal at a time.
    // In addition, this reset any true value for other modals.
    setModals({ ...defaults, ...modals });
  };
  const closeModals = () => {
    setModals(defaults);
  };

  return (
    <OverlayContext.Provider
      value={{
        modals,
        setModals: showModal,
        closeModals,
      }}
    >
      {children}
    </OverlayContext.Provider>
  );
};

export const useOverlay = (): OverlayContextType => useContext(OverlayContext);
