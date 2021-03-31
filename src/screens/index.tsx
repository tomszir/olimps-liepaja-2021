import styled from 'styled-components';
import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './Home';
import Leaderboards from './Leaderboards';
import Challenge from './Challenge';
import Profile from './Profile';
import Creator from './Creator';
import NotFound from './NotFound';

const S = {
  Screens: styled.div`
    flex: 1;
    overflow: auto;
  `,
};

const Screens: React.FC = () => {
  return (
    <S.Screens>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/leaderboards' component={Leaderboards} />
        <Route exact path='/challenge/:id' component={Challenge} />
        <Route exact path='/user/:id' component={Profile} />
        <Route exact path='/creator' component={Creator} />
        <Route path='*' component={NotFound} />
      </Switch>
    </S.Screens>
  );
};

export default Screens;
