import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { Plus } from 'react-feather';

import { StyledObject, ChallengeData } from '@/types';

import { useModal } from '@/components/Modal';
import CreationModal from './CreationModal';

const S: StyledObject = {};

S.Container = styled.div`
  width: 260px;
  height: 100%;
  background-color: #242429;

  @media only screen and (max-width: 768px) {
    height: auto;
    width: 100%;
  }

  padding: 12px 0;
`;

S.Content = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: calc(100% - 24px);
`;

S.Title = styled.h4`
  color: #afafaf;
  font-family: 'Poppins', sans-serif;
  margin-bottom: 10px;
`;

S.Item = styled.button<{
  isActive: boolean;
}>`
  cursor: pointer;

  border: none;
  outline: none;

  display: flex;
  align-items: center;
  justify-content: flex-start;

  padding: 10px 12px;
  border-radius: 4px;
  border: 1px solid transparent;

  color: #a3a3a3;
  background-color: #343439;

  font-family: 'Poppins', sans-serif;

  & + & {
    margin-top: 8px;
  }

  &:hover {
    color: #f1f1f1;
    background-color: #434349;
  }

  ${p =>
    p.isActive &&
    `
    border: 1px solid #939393;
    `};
`;

S.ItemLabel = styled.span`
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-align: left;
  text-overflow: ellipsis;
`;

S.OutlinedItem = styled.button`
  cursor: pointer;

  border: none;
  outline: none;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 10px 12px;
  border-radius: 4px;

  background-color: transparent;
  border: 1px dashed #3eb489;
  color: #3eb489;
  font-family: 'Poppins', sans-serif;

  margin-top: 8px;

  &:hover {
    background-color: #3eb4892f;
  }
`;

const CreatorSideNav: React.FC<{
  challenges: ChallengeData[];
  activeIndex: number | null;
  onClick: (index: number) => void;
  onCreate: (challengeId: string) => void;
}> = ({ challenges, activeIndex, onClick, onCreate }) => {
  const creationModal = useModal();

  return (
    <>
      <S.Container>
        <S.Content>
          <S.Title>Tavi izaicinājumi</S.Title>
          {challenges.map((challenge, i) => {
            return (
              <S.Item
                key={challenge.title}
                isActive={i == activeIndex}
                onClick={() => onClick(i)}
              >
                <S.ItemLabel>{challenge.title}</S.ItemLabel>
              </S.Item>
            );
          })}
          <S.OutlinedItem onClick={() => creationModal.open()}>
            Izveidot jaunu <Plus />
          </S.OutlinedItem>
        </S.Content>
      </S.Container>
      <CreationModal onCreate={onCreate} {...creationModal.handlers} />
    </>
  );
};

export default CreatorSideNav;
