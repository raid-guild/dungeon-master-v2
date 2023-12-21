import {
  ChakraBoxProps,
  ChakraModal,
  Heading,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from '@raidguild/design-system';
import React from 'react';

import { IModals, OverlayContextType } from '../contexts/OverlayContext';
// TODO replace this modal with the one from design-system

interface CustomModalWrapperProps {
  name: keyof IModals;
  title: string;
  children: React.ReactNode;
  titleColor?: string;
  bgColor?: string;
  size?: string;
  localOverlay: OverlayContextType;
  isOpen?: boolean;
  onClose?: () => void;
}

export type ModalWrapperProps = CustomModalWrapperProps & ChakraBoxProps;

const ModalWrapper = ({
  name,
  title,
  children,
  isOpen,
  onClose,
  size,
  localOverlay,
  ...props
}: ModalWrapperProps) => {
  const { modals, closeModals } = localOverlay;

  return (
    <ChakraModal
      isOpen={modals[name]}
      onClose={closeModals}
      size={size || '2xl'}
    >
      <ModalOverlay />
      <ModalContent
        background={props.bgColor ? props.bgColor : 'gray.800'}
        minWidth='20vw'
        paddingY={4}
      >
        <ModalHeader>
          <Heading variant='shadow' size='md'>
            {title}
          </Heading>
        </ModalHeader>
        <ModalCloseButton color='whiteAlpha.700' />
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </ChakraModal>
  );
};

export default ModalWrapper;
