import styled from 'styled-components';

import React, { useState } from 'react';

import { StyledObject } from '@/types';
import { useChallengeModifier } from '@/hooks';
import { useAuth } from '@/context/auth';

import Button from '@/components/Button';
import { Input } from '@/components/Form';
import Modal, { ModalProps } from '@/components/Modal';

import ThumbnailUpload from './ThumbnailUpload';

const S: StyledObject = {};

S.Label = styled.h5`
  margin-bottom: 10px;
  color: #f1f1f1;
  font-family: 'Poppins', sans-serif;
`;

S.ThumbnailPreview = styled.img`
  width: 100%;
  height: 220px;
  border-radius: 4px;
  background-color: #535359;
  object-fit: cover;
`;

S.Button = styled.button`
  width: 100%;
  border: none;
  outline: none;
  background-color: transparent;
  cursor: pointer;

  &:hover {
    ${S.ThumbnailPreview} {
      opacity: 0.8;
    }
  }
`;

S.ThumbnailUpload = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
`;

S.Input = styled.input`
  display: none;
`;

S.Divider = styled.div`
  height: 12px;
`;

S.Alert = styled.div`
  padding: 10px 16px;
  background-color: #e74a556f;
  border: 1px solid #e74a55;
  border-radius: 4px;
  color: #f1f1f1;
  font-family: 'Poppins', sans-serif;
`;

export type CreationModalProps = {
  onCreate: (challengeId: string) => void;
} & Omit<ModalProps, 'title'>;

export const CreationModal: React.FC<CreationModalProps> = ({
  onClose,
  onCreate,
  ...props
}) => {
  const { currentUser } = useAuth();
  const { createChallenge } = useChallengeModifier();

  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [thumbnail, setThumbnail] = useState<File | undefined>();

  const reset = () => {
    setError('');
    onClose();
  };

  const handleSubmit = async () => {
    // Shouldn't happen.
    if (!currentUser) {
      return;
    }

    if (!title || title == '') {
      return setError('Nosaukums nevar būt tukšs!');
    }

    if (title.length < 3) {
      return setError('Nosaukumam jābūt vismaz 3 rakstvienību garam!');
    }

    const challenge = await createChallenge({
      title,
      thumbnail,
      author: currentUser.id,
    });

    reset();
    onCreate(challenge.id);
  };

  return (
    <Modal title='Izveidot jaunu izaicinājumu' onClose={reset} {...props}>
      {error && <S.Alert>{error}</S.Alert>}
      <S.Divider />
      <S.Label>Attēls</S.Label>
      <ThumbnailUpload onUpload={setThumbnail} />
      <Input
        label='Nosaukums'
        onChange={setTitle}
        placeholder='Tava izaicinājuma nosaukums'
      />
      <S.Divider />
      <Button label='Turpināt' type='primary' onClick={handleSubmit} />
    </Modal>
  );
};

export default CreationModal;
