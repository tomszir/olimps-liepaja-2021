import React from 'react';
import { Popup } from 'react-leaflet';
import styled from 'styled-components';

import { StyledObject } from '@/types';

const S: StyledObject = {};

S.Popup = styled(Popup)`
  .leaflet-popup-content-wrapper {
    background-color: #434349;
    border-radius: 4px;
  }

  .leaflet-popup-content {
    margin: 10px 18px;
    color: #f1f1f1;
    display: flex;
    align-items: center;
    font-family: 'Poppins', sans-serif;
  }

  .leaflet-popup-content-wrapper,
  .leaflet-popup-tip {
    background: #434349;
  }
`;

export default S.Popup;
