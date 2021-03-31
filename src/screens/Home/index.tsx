import styled from 'styled-components';
import React from 'react';

import { StyledObject } from '@/types';
import { useChallenges } from '@/hooks';

import ChallengeItem from './components/ChallengeItem';
import ChallengeItemSkeleton from './components/ChallengeItem/Skeleton';

const S: StyledObject = {};

S.Home = styled.div`
  margin: 0 auto;
  padding: 24px 16px;

  width: 100%;
  max-width: 1224px;
`;

S.ItemContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 0 -6px;
`;

S.Title = styled.h2`
  font-family: 'Poppins', sans-serif;
  color: #f1f1f1;
  margin-bottom: 16px;
`;

export const ChallengeItemContainer: React.FC = () => {
  const { challenges, isLoading } = useChallenges();

  if (isLoading) {
    return (
      <S.ItemContainer>
        <ChallengeItemSkeleton />
        <ChallengeItemSkeleton />
        <ChallengeItemSkeleton />
      </S.ItemContainer>
    );
  }

  return (
    <S.ItemContainer>
      {challenges.map(challenge => (
        <ChallengeItem challenge={challenge} />
      ))}
    </S.ItemContainer>
  );
};

const Home: React.FC = () => {
  return (
    <S.Home>
      <S.Title>Izaicinājumi</S.Title>
      <ChallengeItemContainer />
    </S.Home>
  );
};

export default Home;
