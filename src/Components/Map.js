import React from 'react'
import { GoogleMap, LoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '1280px',
  height: '545px'
};

const center = {
  lat: -3.386925,
  lng: 36.682995
};

function Map() {
  return (
    <LoadScript
      googleMapsApiKey="AIzaSyDOcN1jiA7n7uaBd1h1JTTRA1dCQM1W7eU"
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
      >
        { /* Child components, such as markers, info windows, etc. */ }
        <></>
      </GoogleMap>
    </LoadScript>
  )
}

export default Map;