import React from 'react';
import { ChevronDown } from 'react-feather';
import styled from 'styled-components';

import firebase from '@/firebase';
import { useAuth } from '@/context/auth';
import { StyledObject } from '@/types';

import Button from '@/components/Button';
import { useModal } from '@/components/Modal';
import Dropdown, { useDropdown } from '@/components/Dropdown';

import { SignInModal, SignUpModal } from '../Modal/Auth';

const S: StyledObject = {};

S.Container = styled.div`
  height: 60px;
  border-bottom: 1px solid #38383e;
  display: flex;
  padding: 8px 12px;
  align-items: center;
  justify-content: flex-end;
`;

S.User = styled.button`
  cursor: pointer;
  position: relative;
  border: none;
  outline: none;

  display: flex;
  align-items: center;

  background-color: transparent;
`;

S.UserAvatar = styled.img`
  border: none;
  outline: none;
  background-color: #343439;
  height: 40px;
  width: 40px;
  border-radius: 4px;
  margin-right: 12px;
`;

S.UserName = styled.span`
  color: #f1f1f1;
  margin-right: 12px;
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
`;

const TopNav: React.FC = () => {
  const signInModal = useModal();
  const signUpModal = useModal();
  const userDropdown = useDropdown();

  const { currentUser, isLoading, isLoggedIn } = useAuth();

  if (isLoading) {
    return <S.Container />;
  }

  if (isLoggedIn) {
    return (
      <S.Container>
        <S.User onClick={userDropdown.open}>
          <S.UserName>{currentUser?.displayName}</S.UserName>
          <S.UserAvatar src={currentUser?.photoURL} />
          <ChevronDown color='#f1f1f1' size={20} />
          <Dropdown
            items={[
              {
                to: '/',
                label: 'Profils',
              },
              {
                to: '/',
                label: 'Iziet',
                onClick: () => firebase.auth().signOut(),
              },
            ]}
            {...userDropdown.handlers}
          />
        </S.User>
      </S.Container>
    );
  }

  return (
    <>
      <SignInModal {...signInModal.handlers} />
      <SignUpModal {...signUpModal.handlers} />
      <S.Container>
        <Button label='Pieslēgties' type='primary' onClick={signInModal.open} />
        <Button label='Reģistrēties' onClick={signUpModal.open} />
      </S.Container>
    </>
  );
};

export default TopNav;
