import styled from 'styled-components';
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, User } from 'react-feather';

import { StyledObject, ChallengeData, UserData } from '@/types';
import ChallengeItemSkeleton from './Skeleton';
import { firestore } from '@/firebase';

const S: StyledObject = {};

// TODO: Rewrite this

S.Thumbnail = styled.img`
  cursor: pointer;

  width: 100%;
  height: 180px;
  object-fit: cover;

  border-radius: 4px;

  &:hover {
    opacity: 0.7;
  }
`;

S.Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  margin-top: 8px;
  margin-bottom: 4px;
`;

S.Title = styled(Link)`
  cursor: pointer;

  font-size: 15px;
  font-weight: bold;
  font-family: 'Poppins', sans-serif;
  text-decoration: none;
  color: #3eb489;

  &:hover {
    text-decoration: underline;
  }
`;

S.SubTitle = styled.span`
  display: flex;
  align-items: center;
  font-family: 'Poppins', sans-serif;

  font-size: 13px;
  color: #a3a3a3;

  & * {
    margin-right: 4px;
  }
`;

S.UserLink = styled(Link)`
  margin-left: 4px;
  text-decoration: none;
  color: #f1f1f1;

  &:hover {
    text-decoration: underline;
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

export interface ChallengeItemProps {
  challenge: ChallengeData | null;
}

const ChallengeItem: React.FC<ChallengeItemProps> = ({ challenge }) => {
  if (!challenge) {
    return <ChallengeItemSkeleton />;
  }

  const [author, setAuthor] = React.useState<UserData | null>(null);
  const fetchAuthor = async () => {
    const doc = await firestore.collection('users').doc(challenge.author).get();
    setAuthor(Object.assign({}, { id: challenge.author }, doc.data()) as UserData);
  };

  React.useEffect(() => {
    fetchAuthor();
  }, []);

  if (!author) {
    return <ChallengeItemSkeleton />;
  }

  return (
    <S.Container>
      <Link to={`/challenge/${challenge.id}`}>
        <S.Thumbnail src={challenge.thumbnailURL} />
      </Link>
      <S.Footer>
        <S.SubTitle>
          <MapPin size={12} />
          {challenge.points.length} objekti
        </S.SubTitle>
        <S.SubTitle>
          <User size={13} /> Izveidoja{' '}
          <S.UserLink to={`/user/${author.id}`}>{author.displayName}</S.UserLink>
        </S.SubTitle>
      </S.Footer>
      <S.Title to={`/challenge/${challenge.id}`}>{challenge.title}</S.Title>
    </S.Container>
  );
};

export default ChallengeItem;
