import styled from 'styled-components';

import React, { useState } from 'react';
import { User } from 'react-feather';

import { StyledObject, ChallengeData } from '@/types';

const S: StyledObject = {};

S.Container = styled.div`
  height: 100%;
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 0;
`;
S.BackgroundImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: blur(8px);
  opacity: 0.3;
`;
S.Card = styled.div`
  width: 100%;
  max-width: 568px;
  background-color: #434349;
  border-radius: 4px;
  padding: 16px;
  text-align: center;
  z-index: 1000;

  margin: 0 12px;
`;

S.Title = styled.h2`
  color: #3eb489;
  font-family: 'Poppins', sans-serif;
`;

S.SubTitle = styled.h4`
  color: #e3e3e3;
  font-family: 'Poppins', sans-serif;
`;

S.SelectionField = styled.div`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 32px;
  margin: 16px 0;
  border-top: 1px solid #535359;
  border-bottom: 1px solid #535359;
`;

S.SelectionIcon = styled.div`
  height: 124px;
  width: 124px;
  border-radius: 100%;
  background-color: #242429;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a3a3a3;
  font-family: 'Poppins', sans-serif;
  font-size: 18px;
`;

S.SelectionLabel = styled.div`
  color: #a3a3a3;
  font-size: 16px;
  font-family: 'Poppins', sans-serif;
  margin-top: 8px;
`;

S.SelectionButton = styled.button<{ active?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
  outline: none;
  border: none;
  background-color: transparent;

  & + & {
    margin-left: 36px;
  }

  ${p =>
    p.active &&
    `
    ${S.SelectionIcon} {
      color: #f1f1f1;
      border: 3px solid #aeaeae;
    }

    ${S.SelectionLabel} {
      color: #f1f1f1;
    }
  `}

  &:hover {
    ${S.SelectionIcon} {
      border: 3px solid #939393;
    }
  }
`;

S.Button = styled.button`
  cursor: pointer;
  font-family: 'Poppins', sans-serif;

  border: none;
  outline: none;

  display: flex;
  align-items: center;

  height: 100%;
  width: 100%;

  padding: 10px 16px;
  border-radius: 4px;

  color: #afafaf;
  background-color: #141419;
  text-decoration: none;

  margin: 0 auto;
  margin-top: 16px;

  flex: 1;
  justify-content: center;
  align-items: center;

  &:hover {
    color: #f1f1f1;
  }

  & + & {
    margin-left: 4px;
  }
`;

const Prompt: React.FC<{ challenge: ChallengeData; onStart: () => void }> = ({
  challenge,
  onStart,
}) => {
  const [activeMode, setActiveMode] = useState(0);

  return (
    <S.Container>
      <S.BackgroundImage src={challenge.thumbnailURL} />
      <S.Card>
        <S.Title>Izaicinājums</S.Title>
        <S.SubTitle>{challenge.title}</S.SubTitle>
        <S.SelectionField>
          <S.SelectionButton onClick={() => setActiveMode(0)} active={activeMode == 0}>
            <S.SelectionIcon>
              <User size={24} />
            </S.SelectionIcon>
            <S.SelectionLabel>Singleplayer</S.SelectionLabel>
          </S.SelectionButton>
          <S.SelectionButton onClick={() => setActiveMode(1)} active={activeMode == 1}>
            <S.SelectionIcon>
              <User size={24} />
              <User size={24} />
            </S.SelectionIcon>
            <S.SelectionLabel>Multiplayer</S.SelectionLabel>
          </S.SelectionButton>
        </S.SelectionField>
        <S.Button onClick={onStart}>Sākt izaicinājumu!</S.Button>
      </S.Card>
    </S.Container>
  );
};

export default Prompt;
