import styled from 'styled-components';
import React from 'react';
import { NavLink } from 'react-router-dom';

import { StyledObject } from '@/types';

const S: StyledObject = {};

S.Icon = styled.span``;

S.Label = styled.span`
  font-size: 16px;
  font-family: 'Poppins', sans-serif;
`;

S.Item = styled(NavLink)`
  cursor: pointer;

  display: flex;
  align-items: center;

  ${S.Label} {
    margin-left: 16px;
  }

  padding: 10px 12px;
  border-radius: 8px;

  color: #afafaf;
  text-decoration: none;

  &:hover {
    color: #f1f1f1;
  }

  &.active {
    color: #3eb489;
    background-color: #3eb4892f;
  }

  & + & {
    margin-top: 6px;
  }
`;

interface ItemProps {
  to: string;
  label: string;
  icon: React.FC<{
    color?: string;
    size?: string | number;
  }>;
  isCollapsed: boolean;
}

const Item: React.FC<ItemProps> = ({ to, label, icon, isCollapsed }) => {
  return (
    <S.Item to={to} activeClassName='active' exact>
      <S.Icon size={26} as={icon} />
      {!isCollapsed && <S.Label>{label}</S.Label>}
    </S.Item>
  );
};

export default Item;
