import styled, { css } from 'styled-components';
import React, { useRef, useState } from 'react';
import { X } from 'react-feather';

import { StyledObject } from '@/types';
import { useOutsideAlerter } from '@/hooks';
import { mobile } from '@/utils/breakpoints';

const S: StyledObject = {};

S.Wrapper = styled.a`
  z-index: 99999;
  position: absolute;

  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  padding: 32px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: rgba(0, 0, 0, 0.5);

  ${mobile(css`
    padding: 0;
  `)}
`;

S.Container = styled.div`
  display: flex;
  flex-direction: column;

  border-radius: 4px;

  width: 100%;
  max-width: 568px;

  background-color: #343439;

  & > * {
    color: #f1f1f1;
  }

  ${mobile(css`
    height: 100%;
    max-width: 100%;
  `)}
`;

S.Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  height: 60px;
  padding: 0 16px;

  border-bottom: 1px solid #434349;
`;

S.Content = styled.div`
  flex: 1;
  overflow-y: auto;

  padding: 16px;
  padding-bottom: 0;

  max-height: calc(100vh - 32px - 60px);

  ${mobile(css`
    max-height: calc(100vh - 60px);
  `)}

  &::-webkit-scrollbar {
    width: 16px;
  }

  &::-webkit-scrollbar-track {
    background: #343439;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #141419;
    border-radius: 20px;
    border: 6px solid #343439;
  }
`;

S.HeaderLeft = styled.div`
  flex: 1;
`;

S.HeaderMiddle = styled.div`
  flex: 10;
  display: flex;
  justify-content: center;
`;

S.HeaderRight = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`;

S.HeaderTitle = styled.h4`
  text-align: center;
  font-family: 'Poppins', sans-serif;
`;

S.CloseButton = styled.button`
  cursor: pointer;

  border: none;
  outline: none;

  padding: 8px;
  border-radius: 100%;

  color: #f1f1f1;
  background-color: transparent;

  &:hover {
    background-color: #434349;
  }
`;

S.Padding = styled.div`
  height: 16px;
`;

S.Icon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, isOpen, onClose, children }) => {
  const containerRef = useRef(null);

  useOutsideAlerter(containerRef, () => {
    onClose();
  });

  if (!isOpen) {
    return null;
  }

  return (
    <S.Wrapper>
      <S.Container ref={containerRef}>
        <S.Header>
          <S.HeaderLeft />
          <S.HeaderMiddle>
            <S.HeaderTitle>{title}</S.HeaderTitle>
          </S.HeaderMiddle>
          <S.HeaderRight>
            <S.CloseButton onClick={onClose}>
              <S.Icon as={X} size={20} />
            </S.CloseButton>
          </S.HeaderRight>
        </S.Header>
        <S.Content>
          {children}
          <S.Padding />
        </S.Content>
      </S.Container>
    </S.Wrapper>
  );
};

export const useModal = () => {
  const [isOpen, setOpen] = useState(false);

  const open = () => setOpen(true);
  const close = () => setOpen(false);

  return {
    isOpen,
    setOpen,
    open,
    close,
    handlers: {
      isOpen,
      onClose: close,
    },
  };
};

export default Modal;
