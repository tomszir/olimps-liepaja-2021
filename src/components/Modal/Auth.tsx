import styled from 'styled-components';

import React, { useState } from 'react';
import Modal, { ModalProps } from '.';

import firebase from '@/firebase';
import { StyledObject } from '@/types';

import Button from '@/components/Button';
import { Input } from '@/components/Form';

const S: StyledObject = {};

S.Divider = styled.div`
  height: 1px;
  background-color: #242429;
  margin: 16px 0;
`;

S.Button = styled(Button)`
  width: 100%;
  margin-top: 12px;
`;

S.MediaButton = styled.button`
  cursor: pointer;

  position: relative;
  font-family: 'Poppins', sans-serif;

  border: none;
  outline: none;

  display: flex;
  align-items: center;
  justify-content: center;

  width: 100%;

  margin-top: 16px;
  padding: 10px 16px;
  border-radius: 4px;

  color: #afafaf;
  background-color: #242429;
  text-decoration: none;

  &:hover {
    color: #f1f1f1;
  }

  & + & {
    margin-top: 8px;
  }
`;

S.SDivider = styled.div`
  height: 10px;
`;

S.MediaIcon = styled.img`
  position: absolute;

  left: 12px;

  height: 22px;
  width: 22px;
`;

const continueWithProvider = async (
  provider: firebase.auth.AuthProvider,
  onClose: () => void,
  setError: (message: string) => void,
) => {
  firebase
    .auth()
    .signInWithPopup(provider)
    .then(() => {
      onClose();
      setError('');
    })
    .catch(({ message }) => setError(message));
};

export type AuthModalProps = Omit<ModalProps, 'title'>;

export const SignInModal: React.FC<AuthModalProps> = ({ onClose, ...props }) => {
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signInWithEmail = async () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        onClose();
        setError('');
      })
      .catch(({ message }) => setError(message));
  };

  const reset = () => {
    setError('');
    onClose();
  };

  const continueWithGoogle = () =>
    continueWithProvider(new firebase.auth.GoogleAuthProvider(), onClose, setError);

  const continueWithFacebook = () =>
    continueWithProvider(new firebase.auth.FacebookAuthProvider(), onClose, setError);

  const continueWithTwitter = () =>
    continueWithProvider(new firebase.auth.TwitterAuthProvider(), onClose, setError);

  return (
    <Modal title='Pieslēgties' onClose={reset} {...props}>
      {error && <div>{error}</div>}
      <S.Divider />
      <Input label='E-pasts' onChange={setEmail} placeholder='generic@email.com' />
      <S.SDivider />
      <Input label='Parole' onChange={setPassword} placeholder='********' />
      <S.Button type='primary' label='Turpināt' onClick={signInWithEmail} />
      <S.Divider />
      <S.MediaButton onClick={continueWithGoogle}>
        <S.MediaIcon src='https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png' />
        Turpināt ar Google
      </S.MediaButton>
      <S.MediaButton onClick={continueWithFacebook}>
        <S.MediaIcon src='https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/600px-Facebook_f_logo_%282019%29.svg.png' />
        Turpināt ar Facebook
      </S.MediaButton>
      <S.MediaButton onClick={continueWithTwitter}>
        <S.MediaIcon src='https://brandlogos.net/wp-content/uploads/2015/11/twitter-logo.png' />
        Turpināt ar Twitter
      </S.MediaButton>
    </Modal>
  );
};

export const SignUpModal: React.FC<AuthModalProps> = ({ onClose, ...props }) => {
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const signUpWithEmail = async () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(({ user }) => {
        if (user != null) {
          user.updateProfile({
            displayName: username,
            photoURL:
              'https://t4.ftcdn.net/jpg/04/10/43/77/360_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg',
          });

          onClose();
          setError('');
          window.location.reload(false);
        }
      })
      .catch(({ message }) => setError(message));
  };

  const reset = () => {
    setError('');
    onClose();
  };

  const continueWithGoogle = () =>
    continueWithProvider(new firebase.auth.GoogleAuthProvider(), onClose, setError);

  const continueWithFacebook = () =>
    continueWithProvider(new firebase.auth.FacebookAuthProvider(), onClose, setError);

  const continueWithTwitter = () =>
    continueWithProvider(new firebase.auth.TwitterAuthProvider(), onClose, setError);

  return (
    <Modal title='Reģistrēties' onClose={reset} {...props}>
      {error && <div>{error}</div>}
      <Input label='Vārds' onChange={setUsername} placeholder='John Doe' />
      <S.SDivider />
      <Input label='E-pasts' onChange={setEmail} placeholder='generic@email.com' />
      <S.SDivider />
      <Input label='Parole' onChange={setPassword} placeholder='********' />
      <S.Button type='primary' label='Turpināt' onClick={signUpWithEmail} />
      <S.Divider />
      <S.MediaButton onClick={continueWithGoogle}>
        <S.MediaIcon src='https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png' />
        Turpināt ar Google
      </S.MediaButton>
      <S.MediaButton onClick={continueWithFacebook}>
        <S.MediaIcon src='https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/600px-Facebook_f_logo_%282019%29.svg.png' />
        Turpināt ar Facebook
      </S.MediaButton>
      <S.MediaButton onClick={continueWithTwitter}>
        <S.MediaIcon src='https://brandlogos.net/wp-content/uploads/2015/11/twitter-logo.png' />
        Turpināt ar Twitter
      </S.MediaButton>
    </Modal>
  );
};
