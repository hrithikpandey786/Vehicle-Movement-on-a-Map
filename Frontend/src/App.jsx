import { useState } from 'react'
import './App.css'
import 'leaflet/dist/leaflet.css';
import {MapContainer, TileLayer, Marker} from "react-leaflet";
import "leaflet-routing-machine";
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

import Route from "./Route";

function App() {
  
  return (
    <MapContainer center={[48.8566, 2.3522]} zoom={11}>
      <TileLayer
        attribution= '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url= 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
      />

      {/* <Marker position={[48.86, 2.3552]}>

      </Marker> */}

      <Route/>

    </MapContainer>
  )
}

export default App
