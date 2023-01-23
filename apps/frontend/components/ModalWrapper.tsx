import React from 'react';
import {
  Heading,
  ChakraModal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ChakraBoxProps,
} from '@raidguild/design-system';
import { OverlayContextType, IModals } from '../contexts/OverlayContext';
// TODO replace this modal with the one from design-system

export interface ModalWrapperProps extends ChakraBoxProps {
  name: keyof IModals;
  title: string;
  content: React.ReactNode;
  titleColor?: string;
  bgColor?: string;
  size?: string;
  localOverlay: OverlayContextType;
  isOpen?: boolean;
  onClose?: () => void;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({
  name,
  title,
  content,
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
        paddingY={8}
      >
        <ModalHeader>
          <Heading>{title}</Heading>
        </ModalHeader>
        <ModalCloseButton color='whiteAlpha.700' />
        <ModalBody>{content}</ModalBody>
      </ModalContent>
    </ChakraModal>
  );
};

export default ModalWrapper;
