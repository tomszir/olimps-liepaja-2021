import styled, { createGlobalStyle } from 'styled-components';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import { StyledObject } from './types';

import { AuthProvider, useAuth } from './context/auth';

import Screens from './screens';

import Spinner from './components/Spinner';
import TopNav from './components/TopNav';
import MainNav from './components/MainNav';

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    height: 100%;
  }
`;

const S: StyledObject = {};

S.AppLoading = styled.div`
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: #28282e;
`;

S.App = styled.div`
  height: 100%;
  display: flex;
  background-color: #28282e;
`;

S.AppContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const App: React.FC = () => {
  /*
  if (isLoading) {
    return (
      <S.AppLoading>
        <Spinner />
      </S.AppLoading>
    );
  }*/

  return (
    <S.App>
      <MainNav />
      <S.AppContent>
        <TopNav />
        <Screens />
      </S.AppContent>
    </S.App>
  );
};

ReactDOM.render(
  <>
    <GlobalStyle />
    <AuthProvider>
      <Router>
        <App />
      </Router>
    </AuthProvider>
  </>,
  document.getElementById('root'),
);
