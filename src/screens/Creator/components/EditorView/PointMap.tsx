import React from 'react';
import { Marker } from 'react-leaflet';
import styled from 'styled-components';

import { StyledObject, ChallengeData, ChallengePoint } from '@/types';

import LeafletMap from '@/components/LeafletMap';

const S: StyledObject = {};

S.LeafletMap = styled(LeafletMap)`
  width: 100%;
  height: 280px;
  border-radius: 4px;
`;

export type EditorViewPointMapProps = {
  challenge: ChallengeData;
  onClick?: (point: ChallengePoint) => void;
};

const EditorViewPointMap: React.FC<EditorViewPointMapProps> = ({
  challenge,
  onClick,
}) => {
  const getBounds = () => {
    if (challenge.points && challenge.points.length > 0) {
      return challenge.points.map(({ lat, lng }) => [lat, lng]);
    }
    return [[56.51667, 21.01667]];
  };

  return (
    <S.LeafletMap bounds={getBounds()}>
      {challenge.points &&
        challenge.points.map(point => {
          return (
            <Marker
              key={point.title}
              position={[point.lat, point.lng]}
              eventHandlers={{ click: () => onClick && onClick(point) }}
            />
          );
        })}
    </S.LeafletMap>
  );
};

export default EditorViewPointMap;
