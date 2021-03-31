import styled, { css } from 'styled-components';
import React from 'react';

import { StyledObject } from '@/types';
import { mobile } from '@/utils/breakpoints';

const S: StyledObject = {};

S.Thumbnail = styled.div`
  width: 100%;
  height: 180px;

  background-color: #535359;
  border-radius: 4px;
`;

S.Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin: 12px 0;
`;

S.Title = styled.a`
  width: 100%;
  height: 12px;
  background-color: #535359;
  border-radius: 4px;
`;

S.SmallTitle = styled.a`
  width: 60%;
  height: 12px;
  background-color: #535359;
  border-radius: 4px;
  margin-top: 8px;
`;

S.SubTitle = styled.span`
  flex: 1;
  height: 10px;
  background-color: #535359;
  border-radius: 4px;

  & + & {
    margin-left: 8px;
  }
`;

S.Container = styled.div`
  width: calc(33.3% - 12px);
  display: flex;
  flex-direction: column;
  margin: 0 6px;
  margin-bottom: 18px;

  @media only screen and (max-width: 1024px) {
    width: calc(50% - 12px);
  }

  @media only screen and (max-width: 868px) {
    width: calc(100% - 12px);
  }
`;

const ChallengeItemSkeleton: React.FC = () => {
  return (
    <S.Container>
      <S.Thumbnail />
      <S.Footer>
        <S.SubTitle />
        <S.SubTitle />
      </S.Footer>
      <S.Title />
      <S.SmallTitle />
    </S.Container>
  );
};

export default ChallengeItemSkeleton;
