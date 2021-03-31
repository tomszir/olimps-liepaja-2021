import styled from 'styled-components';
import React, { useEffect, useState } from 'react';

import { StyledObject, ChallengeData } from '@/types';
import { firestore } from '@/firebase';
import { useChallenges } from '@/hooks';
import { useAuth } from '@/context/auth';

import SideNav from './components/SideNav';
import EditorView from './components/EditorView';

const S: StyledObject = {};

S.Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;

  @media only screen and (max-width: 768px) {
    flex-direction: column;
    overflow-y: scroll;
  }

  &::-webkit-scrollbar {
    width: 16px;
  }

  &::-webkit-scrollbar-track {
    background: #28282e;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #141419;
    border-radius: 20px;
    border: 6px solid #28282e;
  }
`;

S.Content = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;

  @media only screen and (min-width: 768px) {
    overflow-y: auto;
  }

  &::-webkit-scrollbar {
    width: 16px;
  }

  &::-webkit-scrollbar-track {
    background: #28282e;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #141419;
    border-radius: 20px;
    border: 6px solid #28282e;
  }
`;

S.Title = styled.h2`
  margin: 16px;
  color: #a3a3a3;
  font-family: 'Poppins', sans-serif;
  text-align: center;
`;

const Creator: React.FC = () => {
  const { isLoading, currentUser } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!currentUser) {
    return (
      <S.Content>
        <S.Title>Lūdzu ielogojies, lai varētu veidot un labot izaicinājumus!</S.Title>
      </S.Content>
    );
  }

  const { challenges, fetchChallenges } = useChallenges(currentUser.id);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <S.Container>
      <SideNav
        challenges={challenges}
        activeIndex={activeIndex}
        onClick={index => setActiveIndex(index)}
        onCreate={fetchChallenges}
      />
      <S.Content>
        {activeIndex == null ? (
          <S.Title>🤔 Lūdzu izvēlies izaicinājumu, lai to labotu vai veidotu!</S.Title>
        ) : (
          <EditorView currentChallenge={challenges[activeIndex]} />
        )}
      </S.Content>
    </S.Container>
  );
};

export default Creator;
