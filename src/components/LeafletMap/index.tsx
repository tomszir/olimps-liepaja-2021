import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

export interface LeafletMapProps {
  center?: [number, number];
  bounds?: number[][];
  centerOnLocation?: boolean;
}

const LeafletMap: React.FC = ({ children, ...props }) => {
  return (
    <MapContainer zoom={13} scrollWheelZoom={true} {...props}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      {children}
    </MapContainer>
  );
};

export default LeafletMap;
