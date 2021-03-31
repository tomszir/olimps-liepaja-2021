import styled from 'styled-components';
import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { firestore } from '@/firebase';
import { StyledObject } from '@/types';
import Spinner from '@/components/Spinner';

import NotFound from '../NotFound';

const S: StyledObject = {};

S.SpinnerContainer = styled.div`
  height: 100%;

  display: flex;

  display: flex;
  align-items: center;
  justify-content: center;
`;

S.Container = styled.div`
  height: 100%;
  padding: 24px;
  display: flex;
  justify-content: center;
`;

S.Body = styled.div`
  background-color: #353539;
  border-radius: 4px;
  position: relative;
  padding: 16px;
  max-width: 758px;
  width: 100%;
  padding-top: 64px;
  margin-top: 64px;
`;

S.UserAvatar = styled.img`
  position: absolute;

  height: 96px;
  width: 96px;
  top: -48px;
  border-radius: 100%;
`;

export type UserData = {
  displayName: string;
  photoURL: string;
};

export type ProfileProps = RouteComponentProps<{
  id: string;
}>;

const Profile: React.FC<ProfileProps> = ({ match }) => {
  const [isLoading, toggleLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);

  const fetchUser = async () => {
    toggleLoading(true);

    const response = firestore.collection('users').doc(match.params.id);
    const data = (await response.get()).data() as UserData;

    setUser(data);
    toggleLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, [match]);

  if (isLoading) {
    return (
      <S.SpinnerContainer>
        <Spinner />
      </S.SpinnerContainer>
    );
  }

  if (!match.params.id || !user) {
    return <NotFound />;
  }

  return (
    <S.Container>
      <S.Body>
        <S.UserAvatar src={user.photoURL} />
        {user.displayName}
      </S.Body>
    </S.Container>
  );
};

export default Profile;
