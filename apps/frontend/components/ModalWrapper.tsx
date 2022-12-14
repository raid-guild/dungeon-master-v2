import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  BoxProps,
} from '@chakra-ui/react';
import { Heading } from '@raidguild/design-system';
import { OverlayContextType, IModals } from '../contexts/OverlayContext';
import React from 'react';

export interface ModalWrapperProps extends BoxProps {
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
    <Modal isOpen={modals[name]} onClose={closeModals} size={size || '2xl'}>
      <ModalOverlay />
      <ModalContent
        background={props.bgColor ? props.bgColor : 'gray.800'}
        minWidth="20vw"
        paddingY={8}
      >
        <ModalHeader>
          <Heading>{title}</Heading>
        </ModalHeader>
        <ModalCloseButton color="whiteAlpha.700" />
        <ModalBody>{content}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ModalWrapper;
