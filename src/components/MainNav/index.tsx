import React, { useState, useEffect } from 'react';
import { Map, Home, BarChart2, ChevronRight, ChevronLeft, Menu } from 'react-feather';
import styled from 'styled-components';

import firebase from '@/firebase';
import { StyledObject } from '@/types';
import { useAuth } from '@/context/auth';

import Item from './Item';
import { useWindowDimensions } from '@/hooks';

const S: StyledObject = {};

S.Header = styled.div`
  height: 60px;
  border-bottom: 1px solid #242429;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 12px;

  @media only screen and (max-width: 768px) {
    justify-content: flex-start;
  }
`;

S.CollapseButton = styled.button`
  cursor: pointer;
  color: #a3a3a3;
  outline: none;
  padding: 6px;
  border: 1px solid transparent;
  border-radius: 4px;
  background-color: #343439;

  &:hover {
    border-color: #a3a3a3;
  }

  display: flex;
  align-items: center;
  justify-content: center;
`;

S.FloatingMenuButton = styled.button`
  position: absolute;
  cursor: pointer;
  color: #a3a3a3;
  outline: none;
  padding: 6px;
  border: 1px solid transparent;
  border-radius: 4px;
  background-color: #343439;

  &:hover {
    border-color: #a3a3a3;
  }
  top: 10px;
  left: 12px;

  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

S.Container = styled.div<{ isCollapsed: boolean }>`
  display: flex;
  flex-direction: column;

  width: 240px;

  ${p =>
    p.isCollapsed &&
    `
    width: auto;

    ${S.CollapseButton} {
      width: 100%;
    }
  `}

  background-color: #141419;

  @media only screen and (max-width: 768px) {
    height: 100%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 99999;
  }
`;

S.Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 12px;
`;

S.Footer = styled.div`
  padding: 12px;
  border-top: 1px solid #242429;
`;

S.Button = styled.button`
  cursor: pointer;
  font-family: 'Poppins', sans-serif;

  border: none;
  outline: none;

  display: flex;
  align-items: center;

  width: 100%;

  padding: 10px 12px;
  border-radius: 4px;

  color: #afafaf;
  background-color: #242429;
  text-decoration: none;

  &:hover {
    color: #f1f1f1;
  }

  & + & {
    margin-top: 8px;
  }
`;

const MainNav: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const [isCollapsed, toggleCollapsed] = useState(false);
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (width < 768) {
      toggleCollapsed(true);
    }
  }, []);

  if (width < 768 && isCollapsed) {
    return (
      <S.FloatingMenuButton onClick={() => toggleCollapsed(false)}>
        <Menu />
      </S.FloatingMenuButton>
    );
  }

  return (
    <S.Container isCollapsed={isCollapsed}>
      <S.Header>
        {width > 768 ? (
          <S.CollapseButton onClick={() => toggleCollapsed(!isCollapsed)}>
            {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </S.CollapseButton>
        ) : (
          <S.CollapseButton onClick={() => toggleCollapsed(true)}>
            <Menu />
          </S.CollapseButton>
        )}
      </S.Header>
      <S.Content>
        <Item isCollapsed={isCollapsed} to='/' label='Sākums' icon={Home} />
        <Item isCollapsed={isCollapsed} to='/creator' label='Veidotājs' icon={Map} />
        <Item
          isCollapsed={isCollapsed}
          to='/leaderboards'
          label='Līderu Saraksts'
          icon={BarChart2}
        />
      </S.Content>
    </S.Container>
  );
};

export default MainNav;
