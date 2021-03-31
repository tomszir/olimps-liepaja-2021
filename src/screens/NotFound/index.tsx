import styled from 'styled-components';
import React from 'react';

import { StyledObject } from '@/types';

const S: StyledObject = {};

S.Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h1,
  p {
    color: #f1f1f1;
    font-family: 'Poppins', sans-serif;
  }
`;

S.CatGif = styled.img`
  position: absolute;
  opacity: 0.3;
  z-index: 0;
`;

S.Text = styled.div``;

const NotFound: React.FC = () => {
  return (
    <S.Container>
      <S.CatGif src='https://cataas.com/cat/gif' />

      <h1>404</h1>
      <p>Lapu nevarēja atrast 😔</p>
    </S.Container>
  );
};

export default NotFound;
