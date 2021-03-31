import styled from 'styled-components';

import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { LatLngTuple } from 'leaflet';
import { MapContainer, Circle, TileLayer, Marker, Popup } from 'react-leaflet';
import { getDistance } from 'geolib';
import L from 'leaflet';

import { firestore } from '@/firebase';
import { useChallenge } from '@/hooks';
import { mobile } from '@/utils/breakpoints';
import { StyledObject, ChallengeData, ChallengePoint, GameState } from '@/types';
import { validatePointQuestion } from '@/utils/firebase';
import Spinner from '@/components/Spinner';
import Button from '@/components/Button';
import Modal, { useModal } from '@/components/Modal';

import Prompt from './components/Prompt';
import NotFound from '../NotFound';
import SideMenu from './components/SideMenu';
import { useAuth } from '@/context/auth';

const S: StyledObject = {};

S.Container = styled.div`
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  @media only screen and (max-width: 768px) {
    overflow-y: auto;
    height: auto;
    flex-direction: column;
  }
`;

S.MapWrapper = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  flex: 1;
`;

S.MapContainer = styled(MapContainer)`
  width: 100%;
  height: 100%;
  min-height: 560px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

S.DetailsContainer = styled.div`
  width: 320px;
  height: 100%;

  @media only screen and (max-width: 768px) {
    width: 100%;
    height: auto;
  }
`;

S.MapOverlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 999999;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

S.Modal = styled.div`
  width: 560px;
  margin: 0 12px;
  background-color: #232329;

  border-radius: 4px;
  padding: 16px;

  position: absolute;
  z-index: 999999;

  h2 {
    color: #f1f1f1;
    font-family: 'Poppins', sans-serif;
    margin-bottom: 16px;
    text-align: center;
    margin: 0 auto;
  }

  p {
    color: #e3e3e3;
    font-family: 'Poppins', sans-serif;
  }

  ${mobile(`
    height: 100%;
    width: 100%;
  `)}
`;

S.ButtonContainer = styled.div`
  z-index: 99999;
  position: absolute;
  bottom: 32px;
  right: 32px;

  border-radius: 4px;
`;

S.MButton = styled.div<{
  type: 'correct' | 'incorrect';
  disabled: boolean;
}>`
  cursor: pointer;
  font-family: 'Poppins', sans-serif;

  border: none;
  outline: none;

  display: flex;
  align-items: center;

  width: 100%;

  padding: 10px 16px;
  border-radius: 4px;

  color: #afafaf;
  background-color: #141419;
  text-decoration: none;

  margin: 0 auto;

  position: relative;

  flex: 1;
  justify-content: center;
  align-items: center;

  &:hover {
    color: #f1f1f1;
  }

  & + & {
    margin-top: 16px;
  }

  ${p =>
    p.type === 'correct' &&
    `
    color: #fff;
    background-color: #3eb489;
  `}

  ${p =>
    p.type === 'incorrect' &&
    `
    color: #fff;
    background-color: #ff0033;
  `}

  ${p =>
    p.disabled &&
    `
    cursor: default;
  `}
`;

S.MButtonScore = styled.h4`
  font-family: 'Poppins', sans-serif;

  color: #fff;
  margin-left: 12px;
  justify-self: flex-end;
`;

S.Title = styled.h2`
  font-family: 'Poppins', sans-serif;
  color: #f1f1f1;
  margin-bottom: 12px;
`;

S.Divider = styled.div`
  height: 10px;
`;

export type RouteParams = {
  id?: string;
};

export type ChallengeState = {
  currentLocation: number[];
};

function shuffle(a: any[]) {
  var j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

const icon = (color: string) => {
  return L.icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${color}.png`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
};

const Challenge: React.FC<RouteComponentProps<RouteParams>> = ({ match }) => {
  if (!match.params.id) {
    return <NotFound />;
  }

  const { currentUser } = useAuth();
  const { challenge, isLoading } = useChallenge(match.params.id);
  const [challengeOptions, setChallengeOptions] = useState<{} | null>(null);
  const [gameState, setGameState] = useState<GameState>({
    turn: 0,
    time: 0,
    score: 0,
    points: [],
    visitedPoints: [],
    currentPosition: [0, 0],
    selectedPoint: null,
    activeQuestion: null,
    activeQuestionAnswer: -1,
    activeQuestionShuffle: [],
    ended: false,
  });

  const endScreenModal = useModal();

  const updateGameState = (data: Partial<GameState>) => {
    setGameState(Object.assign({}, gameState, data));
  };

  const getVisionRange = () => {
    const baseRange = 400;

    return gameState.visitedPoints[gameState.visitedPoints.length - 1]?.answeredCorrectly
      ? baseRange * 2
      : baseRange;
  };

  const getLastVisitedPoint = () => {
    return gameState.visitedPoints[gameState.visitedPoints.length - 1];
  };

  const calculateTimeToPoint = (point: ChallengePoint) => {
    const distance =
      getDistance(
        {
          latitude: point.lat,
          longitude: point.lng,
        },
        {
          latitude: gameState.currentPosition[0],
          longitude: gameState.currentPosition[1],
        },
      ) / getVisionRange();

    return (distance > 1 ? Math.max(distance * 0.7, 60 * 11) : distance) * 60 * 10;
  };

  const isPointSelected = (point: ChallengePoint) => {
    return gameState.selectedPoint == point;
  };

  const isPointVisited = (point: ChallengePoint) => {
    return gameState.visitedPoints.map(({ point }) => point).includes(point);
  };

  useEffect(() => {
    if (challenge) {
      updateGameState({
        points: challenge.points.filter(
          ({ questions }) => questions.filter(validatePointQuestion).length > 0,
        ),
        selectedPoint: challenge.points[0],
        currentPosition: [challenge.points[0].lat, challenge.points[0].lng],
      });
    }
  }, [challenge]);

  const endChallenge = () => {
    const { visitedPoints, turn, score, time } = gameState;

    if (!currentUser || !challenge) {
      return;
    }

    endScreenModal.open();

    updateGameState({
      ended: true,
    });

    firestore
      .collection('challenges')
      .doc(challenge.id)
      .collection('results')
      .add({
        user: {
          id: currentUser.id,
          displayName: currentUser.displayName,
        },
        time,
        score,
        turns: turn,
        visitedPoints,
      });
  };

  if (isLoading) {
    return (
      <S.Container>
        <Spinner />
      </S.Container>
    );
  }

  if (!challenge) {
    return <NotFound />;
  }

  const getPointCoordinates = () =>
    challenge.points.map(({ lat, lng }) => [lat, lng]) || [];

  if (!challengeOptions) {
    return <Prompt challenge={challenge} onStart={() => setChallengeOptions({})} />;
  }

  return (
    <S.Container>
      <S.MapWrapper>
        <S.MapContainer bounds={getPointCoordinates()} zoom={13} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />
          {gameState.points.map(point => {
            const { lat, lng, title } = point;

            return (
              <Marker
                key={title}
                position={[lat, lng]}
                icon={
                  isPointSelected(point)
                    ? icon('yellow')
                    : isPointVisited(point)
                    ? icon('black')
                    : icon('green')
                }
                eventHandlers={{
                  click: () => {
                    updateGameState({
                      selectedPoint: point,
                    });
                  },
                }}
              />
            );
          })}
          <Circle center={gameState.currentPosition} radius={getVisionRange()} />
          <Circle center={gameState.currentPosition} radius={5} fill />
          {gameState.selectedPoint && (
            <S.ButtonContainer>
              <Button
                label={
                  calculateTimeToPoint(gameState.selectedPoint) > 600
                    ? `Braukt uz punktu ar taksi (${(
                        calculateTimeToPoint(gameState.selectedPoint) / 60
                      ).toFixed(0)} min un -25 punkti)`
                    : `Doties uz punktu (${(
                        calculateTimeToPoint(gameState.selectedPoint) / 60
                      ).toFixed(0)} min)`
                }
                disabled={isPointVisited(gameState.selectedPoint)}
                onClick={() => {
                  const { selectedPoint } = gameState;

                  if (!selectedPoint || isPointVisited(selectedPoint)) {
                    return;
                  }

                  const activeQuestion =
                    selectedPoint.questions[
                      Math.floor(Math.random() * selectedPoint.questions.length)
                    ];

                  const timeTaken = calculateTimeToPoint(selectedPoint);

                  updateGameState({
                    currentPosition: [selectedPoint.lat, selectedPoint.lng],
                    activeQuestion,
                    activeQuestionShuffle: shuffle([
                      activeQuestion.correctAnswer,
                      ...activeQuestion.incorrectAnswers,
                    ]),
                    time: gameState.time + timeTaken,
                    score: timeTaken > 600 ? gameState.score - 25 : gameState.score,
                  });
                }}
              />
            </S.ButtonContainer>
          )}
        </S.MapContainer>
        {!gameState.ended && gameState.activeQuestion && (
          <S.MapOverlay>
            <S.Modal>
              <S.Title>{gameState.activeQuestion.question}</S.Title>
              <S.Divider />
              {gameState.activeQuestionShuffle.map((q: string, activeQuestionAnswer) => {
                return (
                  <S.MButton
                    key={q}
                    onClick={() => {
                      if (gameState.activeQuestionAnswer > -1) {
                        return;
                      }

                      const answeredCorrectly =
                        q == gameState.activeQuestion?.correctAnswer;
                      const score = gameState.score + (answeredCorrectly ? 100 : 0);
                      const turn = gameState.turn + 1;
                      const time = gameState.time + 180;
                      const visitedPoints = [
                        ...gameState.visitedPoints,
                        {
                          answeredCorrectly,
                          point: gameState.selectedPoint as ChallengePoint,
                        },
                      ];

                      updateGameState({
                        turn,
                        time,
                        score,
                        visitedPoints,
                        activeQuestionAnswer,
                      });
                    }}
                    type={
                      activeQuestionAnswer == gameState.activeQuestionAnswer
                        ? getLastVisitedPoint().answeredCorrectly
                          ? 'correct'
                          : 'incorrect'
                        : ''
                    }
                    disabled={gameState.activeQuestionAnswer > -1}
                  >
                    {q}{' '}
                    {gameState.activeQuestionAnswer > -1 &&
                      activeQuestionAnswer == gameState.activeQuestionAnswer && (
                        <S.MButtonScore>
                          {getLastVisitedPoint().answeredCorrectly ? '+100' : '+0'}
                        </S.MButtonScore>
                      )}
                  </S.MButton>
                );
              })}
              <S.Divider />
              <Button
                label='Turpināt'
                type='primary'
                disabled={gameState.activeQuestionAnswer === -1}
                onClick={() => {
                  const { visitedPoints, points } = gameState;

                  updateGameState({
                    activeQuestion: null,
                    activeQuestionShuffle: [],
                    activeQuestionAnswer: -1,
                    ended: visitedPoints.length === points.length,
                  });

                  if (gameState.ended) {
                    return;
                  }

                  // Game has ended, open modal
                  if (visitedPoints.length === points.length) {
                    endChallenge();
                  }
                }}
              />
            </S.Modal>
          </S.MapOverlay>
        )}
        {gameState.ended && (
          <S.MapOverlay>
            <S.Modal>
              <h2>Izaicinājums ir beidzies!</h2>
              <p>
                Ceļojumā pavadītais laiks bija{' '}
                <strong>{(gameState.time / 3600 + 8).toFixed(0)} stundas</strong> un
                <strong>{((gameState.time % 3600) / 60).toFixed(0)} minūtes</strong>
              </p>
            </S.Modal>
          </S.MapOverlay>
        )}
      </S.MapWrapper>
      <S.DetailsContainer>
        <SideMenu challenge={challenge} gameState={gameState} />
      </S.DetailsContainer>
    </S.Container>
  );
};

export default Challenge;
