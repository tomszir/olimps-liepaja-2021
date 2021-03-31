import styled from 'styled-components';

import React, { useState, useRef, FormEvent } from 'react';
import Modal, { ModalProps } from '@/components/Modal';
import { firestore, storage } from '@/firebase';

import { Image } from 'react-feather';

import { Input } from '@/components/Form';
import { StyledObject, ChallengeData } from '@/types';
import { useAuth } from '@/context/auth';

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

S.ThumbnailPreviewEmpty = styled.div`
  width: 100%;
  height: 220px;
  border-radius: 4px;
  background-color: #535359;
  color: #a3a3a3;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-family: 'Poppins', sans-serif;
`;

S.Button = styled.button`
  width: 100%;
  border: none;
  outline: none;
  background-color: transparent;
  cursor: pointer;

  &:hover {
    ${S.ThumbnailPreview}, ${S.ThumbnailPreviewEmpty} {
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

const ThumbnailUpload: React.FC<{
  url?: string;
  onUpload: (file: File) => void;
}> = ({ url, onUpload }) => {
  const [image, setImage] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = ({ currentTarget }: FormEvent<HTMLInputElement>) => {
    if (currentTarget.files) {
      const image = currentTarget.files[0];

      if (image) {
        onUpload(image);
        setImage(URL.createObjectURL(image));
      }
    }
  };

  return (
    <S.ThumbnailUpload>
      <S.Input ref={inputRef} onChange={handleChange} type='file' accept='image/*' />
      <S.Button onClick={() => inputRef.current && inputRef.current.click()}>
        {image || url ? (
          <S.ThumbnailPreview src={image ? image : url} />
        ) : (
          <S.ThumbnailPreviewEmpty>
            <Image size={48} />
          </S.ThumbnailPreviewEmpty>
        )}
      </S.Button>
    </S.ThumbnailUpload>
  );
};

export default ThumbnailUpload;
