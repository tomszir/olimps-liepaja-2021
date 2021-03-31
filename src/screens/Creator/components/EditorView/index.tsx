import styled from 'styled-components';
import React, { useEffect, useState } from 'react';
import { Edit, Trash } from 'react-feather';

import { firestore } from '@/firebase';
import { StyledObject, ChallengeData, ChallengePoint } from '@/types';
import { useAuth } from '@/context/auth';
import { useModal } from '@/components/Modal';

import { Input } from '@/components/Form';

import PointMap from './PointMap';
import PointModal from './PointModal';
import ThumbnailUpload from '../ThumbnailUpload';
import { getThumbnailURL } from '@/hooks/firebase/challenge';

const S: StyledObject = {};

S.Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 16px;
  max-width: 568px;
  margin: 0 auto;
  width: 100%;
`;

S.Title = styled.h2`
  color: #f1f1f1;
  font-family: 'Poppins', sans-serif;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #434349;
`;

S.Divide = styled.div`
  height: 10px;
`;

S.Label = styled.h5`
  margin-bottom: 10px;
  color: #f1f1f1;
  font-family: 'Poppins', sans-serif;
`;

S.Button = styled.button`
  cursor: pointer;
  font-family: 'Poppins', sans-serif;

  border: none;
  outline: none;

  display: flex;
  align-items: center;

  padding: 10px 16px;
  border-radius: 4px;

  color: #afafaf;
  background-color: #141419;
  text-decoration: none;

  &:hover {
    color: #f1f1f1;
  }

  & + & {
    margin-left: 4px;
  }
`;
S.GreenButton = styled(S.Button)`
  background-color: #3eb489;
  color: #f1f1f1;

  &:hover {
    background-color: #3eb4896f;
  }
`;

S.RedButton = styled(S.Button)`
  background-color: #e74a55;
  color: #f1f1f1;

  &:hover {
    background-color: #e74a556f;
  }
`;

S.PButton = styled(S.Button)`
  padding: 8px 14px;

  & + & {
    margin-left: 8px;
  }
`;

S.RedPButton = styled(S.PButton)`
  background-color: #e74a55;
  color: #f1f1f1;
`;

S.PList = styled.div`
  display: flex;
  flex-direction: column;
`;

S.PItemIndex = styled.span`
  color: #a3a3a3;
  margin-right: 12px;
  font-size: 13px;
  font-family: 'Roboto', sans-serif;
`;

S.PItem = styled.div`
  padding: 10px 0;
  color: #f1f1f1;
  font-size: 16px;
  font-family: 'Poppins', sans-serif;
  display: flex;
  align-items: center;
  border-top: 1px solid #434349;

  &:last-child {
    border-bottom: 1px solid #434349;
  }
`;

S.PItemButtons = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  margin-left: 12px;
`;
S.Buttons = styled.div`
  display: flex;
  margin: 0 -4px;
`;

export type CreatorEditorViewProps = {
  currentChallenge: ChallengeData;
};

const CreatorEditorView: React.FC<CreatorEditorViewProps> = ({ currentChallenge }) => {
  const [selectedPoint, setSelectedPoint] = React.useState<ChallengePoint | null>(null);
  const [modalIsOpen, toggleModalOpen] = React.useState<boolean>(false);
  const [title, setTitle] = React.useState('');
  const [thumbnail, setThumbnail] = React.useState<File | null>(null);
  const [points, setPoints] = useState<ChallengePoint[]>(currentChallenge.points || []);

  const save = async () => {
    if (title == '' || title.length <= 3) {
      return;
    }

    if (thumbnail) {
      const thumbnailURL = await getThumbnailURL(
        `${currentChallenge.id}/thumbnails/`,
        thumbnail,
      );

      firestore.collection('challenges').doc(currentChallenge.id).update({
        thumbnailURL,
      });
    }

    firestore.collection('challenges').doc(currentChallenge.id).update({
      title,
    });
  };

  const deletePoint = async (point: ChallengePoint) => {
    const p = points.filter(p => points.indexOf(p) != points.indexOf(point));

    setPoints(p);

    firestore.collection('challenges').doc(currentChallenge.id).update({
      points: p,
    });
  };

  return (
    <>
      <S.Container>
        <S.Title>{currentChallenge.title}</S.Title>
        <S.Label>Attēls</S.Label>
        <ThumbnailUpload onUpload={setThumbnail} url={currentChallenge.thumbnailURL} />
        <Input
          label='Nosaukums'
          onChange={setTitle}
          defaultValue={currentChallenge.title}
          placeholder='Nosaukums'
        />
        <S.Divide />
        <S.Label>Punkti</S.Label>
        <PointMap
          challenge={currentChallenge}
          onClick={point => {
            setSelectedPoint(point);
            toggleModalOpen(true);
          }}
        />
        <S.Divide />
        <S.Buttons>
          <S.Button
            onClick={() => {
              setSelectedPoint(null);
              toggleModalOpen(true);
            }}
          >
            Pievienot jaunu punktu
          </S.Button>
        </S.Buttons>
        <S.Divide />
        {points.length > 0 ? (
          <S.PList>
            {points.map((p, i) => {
              return (
                <S.PItem key={i}>
                  <S.PItemIndex>#{i + 1}</S.PItemIndex>
                  {p.title}
                  <S.PItemButtons>
                    <S.PButton
                      onClick={() => {
                        setSelectedPoint(p);
                        toggleModalOpen(true);
                      }}
                    >
                      <Edit size={16} />
                    </S.PButton>
                    <S.RedPButton onClick={() => deletePoint(p)}>
                      <Trash size={16} />
                    </S.RedPButton>
                  </S.PItemButtons>
                </S.PItem>
              );
            })}
          </S.PList>
        ) : (
          <S.PItem>Šim izaicinājumam nav neviena punkta!</S.PItem>
        )}
        <S.Divide />
        <S.Buttons>
          <S.GreenButton onClick={save}>Saglabāt</S.GreenButton>
          <S.RedButton>Dzēst</S.RedButton>
        </S.Buttons>
        <S.Divide />
        <S.Divide />
      </S.Container>
      {modalIsOpen && (
        <PointModal
          challenge={currentChallenge}
          point={selectedPoint}
          onCreate={() => {}}
          onClose={() => toggleModalOpen(false)}
        />
      )}
    </>
  );
};

export default CreatorEditorView;
