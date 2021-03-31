import styled from 'styled-components';
import React, { useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';

import { StyledObject } from '@/types';
import { useOutsideAlerter } from '@/hooks';

const S: StyledObject = {};

S.Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 20px);
  right: 0;
  width: 220px;
  display: flex;
  flex-direction: column;
  background-color: #141419;
  border-radius: 4px;
  border: 1px solid #242429;
  z-index: 99999;
`;

S.DropdownItem = styled(NavLink)`
  display: flex;
  text-decoration: none;
  align-items: center;
  color: #afafaf;
  width: 100%;
  padding: 12px;
  font-family: 'Poppins', sans-serif;

  justify-content: space-between;

  & + & {
    border-top: 1px solid #242429;
  }

  &:hover {
    color: #f1f1f1;
  }
`;

export interface DropdownItemProps {
  to: string;
  label: string;
  onClick?: () => void;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({ to, label, onClick }) => {
  return (
    <S.DropdownItem to={to} onClick={() => onClick && onClick()}>
      {label}
    </S.DropdownItem>
  );
};

const Dropdown: React.FC<{
  items: DropdownItemProps[];
  isOpen: boolean;
  onClose: () => void;
}> = ({ items, isOpen, onClose }) => {
  const containerRef = useRef(null);

  useOutsideAlerter(containerRef, () => {
    onClose();
  });

  if (!isOpen) {
    return null;
  }

  return (
    <S.Dropdown ref={containerRef}>
      {items.map((item, i) => {
        return <DropdownItem key={i} {...item} />;
      })}
    </S.Dropdown>
  );
};

export const useDropdown = () => {
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

export default Dropdown;
