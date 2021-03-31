import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import styled from 'styled-components';

import { StyledObject, GameState, UserData, ChallengeData, Comment } from '@/types';

import { firestore } from '@/firebase';
import { useAuth } from '@/context/auth';
import Button from '@/components/Button';
import { TextArea } from '@/components/Form';

const S: StyledObject = {};

S.Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

S.Content = styled.div`
  flex: 1;
  overflow-y: auto;

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

S.ScoreTable = styled.div`
  display: flex;
  margin: 12px;
  margin-bottom: 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #38383e;
`;

S.ScoreLabel = styled.span`
  font-family: 'Poppins', sans-serif;
  color: #a3a3a3;
  font-size: 14px;
`;

S.Score = styled.h4`
  font-family: 'Poppins', sans-serif;
  color: #f1f1f1;
`;

S.ScoreTableItem = styled.div`
  flex: 1;
  background-color: #141419;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  & + & {
    border-left: 1px solid #242429;
  }

  &:first-child {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }

  &:last-child {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
`;

S.Details = styled.div`
  padding: 12px;
  padding-bottom: 0;
`;

S.Divider = styled.div`
  height: 10px;
`;

S.Thumbnail = styled.img`
  width: 100%;
  height: 140px;
  object-fit: cover;

  border-radius: 4px;
`;

S.TabContainer = styled.div`
  display: flex;
  width: 100%;
  height: 50px;
`;

S.TabButton = styled.button<{ active: boolean }>`
  border: none;
  outline: none;
  cursor: pointer;

  height: 100%;
  display: flex;
  border-bottom: 3px solid transparent;
  flex: 1;
  align-items: center;
  justify-content: center;
  font-family: 'Poppins', sans-serif;
  color: #b3b3b3;
  background-color: #141419;

  &:hover {
    color: #fff;
  }

  ${p =>
    p.active &&
    `
    border-color: #3eb489;
  `}
`;

S.CommentContainer = styled.div`
  padding: 12px;
`;

S.TextArea = styled(TextArea)`
  height: 120px;
`;

S.Comment = styled.div`
  display: flex;
  padding: 12px 0;
  border-top: 1px solid #343439;
`;
S.CommentLeft = styled.div`
  display: flex;
  align-items: flex-start;
  margin-right: 16px;
`;
S.CommentContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;
S.CommentAvatar = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 48px;
`;
S.CommentHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;
S.CommentLink = styled(RouterLink)`
  color: #3eb489;
  font-family: 'Poppins', sans-serif;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;
S.CommentMessage = styled.div`
  color: #f1f1f1;
  font-family: 'Poppins', sans-serif;
  font-size: 14px;
  margin: 4px 0;
`;

export interface SideMenuProps {
  gameState: GameState;
  challenge: ChallengeData;
}

const SideMenu: React.FC<SideMenuProps> = ({ challenge, gameState }) => {
  const { currentUser } = useAuth();
  const [comments, setComments] = React.useState<Comment[]>(
    gameState.selectedPoint?.comments || [],
  );
  const [commentMessage, setCommentMessage] = React.useState('');

  React.useEffect(() => {
    setComments(gameState.selectedPoint?.comments || []);
  }, [gameState]);

  const handleComment = () => {
    const { selectedPoint } = gameState;

    if (!challenge || !selectedPoint || !currentUser) {
      return;
    }

    if (commentMessage.length < 3) {
      return;
    }

    const comments = [
      ...(selectedPoint.comments || []),
      {
        author: {
          id: currentUser.id,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
        },
        message: commentMessage,
      },
    ];

    challenge.points[challenge.points.indexOf(selectedPoint)] = Object.assign(
      {},
      selectedPoint,
      {
        comments,
      },
    );

    firestore.collection('challenges').doc(challenge.id).update({
      points: challenge.points,
    });

    setComments(comments);
  };

  return (
    <S.Container>
      <S.Content>
        <S.ScoreTable>
          <S.ScoreTableItem>
            <S.ScoreLabel>Gājiens</S.ScoreLabel>
            <S.Score>{gameState.turn + 1}</S.Score>
          </S.ScoreTableItem>
          <S.ScoreTableItem>
            <S.ScoreLabel>Laiks</S.ScoreLabel>
            <S.Score>
              {(gameState.time / 3600 + 8).toFixed(0).padStart(2, '0')}:
              {((gameState.time % 3600) / 60).toFixed(0).padStart(2, '0')}
            </S.Score>
          </S.ScoreTableItem>
          <S.ScoreTableItem>
            <S.ScoreLabel>Punkti</S.ScoreLabel>
            <S.Score>{gameState.score}</S.Score>
          </S.ScoreTableItem>
        </S.ScoreTable>
        <S.Details>
          {gameState.selectedPoint ? (
            <>
              <S.Score>{gameState.selectedPoint.title}</S.Score>
              <S.Divider />
              <S.ScoreLabel>{gameState.selectedPoint.description}</S.ScoreLabel>
              <S.Divider />
              <S.Thumbnail src={gameState.selectedPoint.image_url} />
              <S.Divider />
            </>
          ) : (
            <S.ScoreLabel>
              Uzspied uz kāda punkta, lai varētu uz to pārvietoties!
            </S.ScoreLabel>
          )}
        </S.Details>
        <S.CommentContainer>
          <S.TextArea
            label='Komentāri'
            defaultValue={commentMessage}
            placeholder='Tempor incididunt fugiat voluptate dolore.'
            onChange={setCommentMessage}
          />
          <Button label='Komentēt' type='primary' onClick={handleComment} />
          <S.Divider />
          {comments.map((comment, i) => {
            return (
              <S.Comment key={i}>
                <S.CommentLeft>
                  <S.CommentAvatar src={comment.author.photoURL} />
                </S.CommentLeft>
                <S.CommentContent>
                  <S.CommentHeader>
                    <S.CommentLink to='/'>{comment.author.displayName}</S.CommentLink>
                  </S.CommentHeader>
                  <S.CommentMessage>{comment.message}</S.CommentMessage>
                </S.CommentContent>
              </S.Comment>
            );
          })}
        </S.CommentContainer>
      </S.Content>
    </S.Container>
  );
};

export default SideMenu;
