import React from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import "leaflet/dist/leaflet.css";
import {data} from "../../src/lib/dummydata";
import axios from "axios";


export default function Route({start, dest}) {
  const map = useMap();
  const [marker, setMarker] = React.useState(null);
  const [polyline, setPolyline] = React.useState(null);
  let prevDateTime = new Date(0);
  let dateTime = new Date(0);
  let seconds = 0;
  let diffInMilliseconds = 0;

  const taxiIcon = L.icon({
    iconUrl: "../public/car.png",
    iconSize: [38, 38]
  });

  const addCoordinates = async (latitude, longitude, dateTime)=>{ 
    // console.log(dateTime);
    dateTime = dateTime.toISOString();
    const isOffset = 1000*60*60*5.5;
    
    const newDateTime = new Date(dateTime);  
    const newDate = new Date(isOffset);

    // console.log(dateTime)
    
    const t1 = newDateTime.getTime();
    const t2 = newDate.getTime();
    
    const t = new Date(t1+t2).toISOString();  //Indian Standard Time
    // console.log(t);
    try{
          const newCoord = await axios.post("http://localhost:8800/api/add", {
            longitude: longitude,
            latitude: latitude,
            date: t
        })
        console.log(newCoord, seconds);
      }
     catch(err){
        console.log(err);
    }
  }

  React.useEffect(() => {
    if (!map || !data || data.length < 2) return;

    // Initialize marker
    if (!marker) {
      const newMarker = L.marker([51.5072, 0.1276], { icon: taxiIcon })
        .addTo(map)
        .bindPopup("Vehicle Starting Position", { closeOnClick: false, autoClose: false });
      setMarker(newMarker);
    }

    // Initialize polyline
    if (!polyline) {
      const newPolyline = L.polyline([], { color: 'green' }).addTo(map);
      setPolyline(newPolyline);
    }

    // Set up routing
    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(start[0], start[1]),
        L.latLng(dest[0], dest[1])
      ],
      addWaypoints: false,
      routeWhileDragging: false,
    })
      .on('routesfound', (e) => {
        const routeCoordinates = e.routes[0].coordinates;

        if (polyline) {
          polyline.setLatLngs(routeCoordinates);
        }

        routeCoordinates.forEach((coord, index) => {
          setTimeout(() => {
            if (marker) {
              marker.setLatLng([coord.lat, coord.lng]);
              marker.getPopup().setContent(`Vehicle is at ${coord.lat.toFixed(4)}, ${coord.lng.toFixed(4)}`);
              
              dateTime = new Date();
              diffInMilliseconds = dateTime-prevDateTime;
              seconds = diffInMilliseconds/1000;
              
              if(seconds>=10){
                addCoordinates(coord.lat, coord.lng, dateTime);
                prevDateTime = dateTime;
              }
            }

            if (polyline) {
              const traveledPath = routeCoordinates.slice(0, index + 1);
              polyline.setLatLngs(traveledPath);
            }
          }, 100 * index);
        });
      })
      .addTo(map);

    // Cleanup on component unmount or data change
    return () => {
      if (routingControl) {
        map.removeControl(routingControl);
      }
      if (polyline) {
        map.removeLayer(polyline);
      }
      if (marker) {
        map.removeLayer(marker);
      }
    };
  }, [map, data, marker, polyline, taxiIcon]);

  return null;
}









































































































// import React from "react";
// import { Popup, useMap } from "react-leaflet";
// import L, { marker } from 'leaflet';
// import "leaflet/dist/leaflet.css";
// import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
// import 'leaflet-routing-machine';
// import {data} from "./lib/dummydata.js";

// export default function Route(){
//     // console.log(data);
//     const map = useMap();
//     // var map = L.map('map').setView([51.505, -0.09], 13);
// //     const startMarkerRef = React.useRef(null);
// //   const endMarkerRef = React.useRef(null);
// // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     // maxZoom: 19,
// // }).addTo(map);
//     const [marker, setMarker] = React.useState(null);
//     const [polyline, setPolyline] = React.useState(null);

//     const taxiIcon = L.icon({
//         iconUrl: "./car.png",
//         iconSize: [38, 38]
//     })
    
    
//     React.useEffect(()=>{
//         if(!map){
//             return;
//         }
        
//         if(!marker){
//             const newMarker = L.marker([25.4358, 81.8463], {icon: taxiIcon}).addTo(map)
//             .bindPopup("Vehicle Starting Position", { closeOnClick: false, autoClose: false })
//             // .openPopup();
//             setMarker(newMarker);
//         }

//         if(!polyline){
//             const newPolyline = L.polyline([],{color: 'green'}).addTo(map);
//             setPolyline(newPolyline);
//         }

//         const routingControl = L.Routing.control({
//             waypoints: [
//                 L.latLng(data[0].latitude, data[0].longitude),
//                 L.latLng(data[1].latitude, data[1].longitude)
//             ],
//             // routeWhileDragging: true,
//             // show: true,
//             // addWaypoints: false
//         }).on('routesfound', (e)=>{
//             const routeCoordinates = e.routes[0].coordinates;
            
//             if(polyline){
//                 polyline.setLatLngs(routeCoordinates);
//             }

//             routeCoordinates.forEach((coord, index)=>{
                
//                 setTimeout(()=>{
//                     if(marker){
                        

//                         marker.setLatLng([coord.lat, coord.lng]);  
//                         marker.getPopup().setContent(`Vehicle is at ${coord.lat.toFixed(4)}, ${coord.lng.toFixed(4)}`)
//                     }
                    
//                     if(polyline){
//                         const traveledPath = routeCoordinates.slice(0, index+1);
//                         polyline.setLatLngs(traveledPath);
//                     }
//                 }, 30*index);
//             })
//         }).addTo(map);

//         // if (!startMarkerRef.current) {
//         //     startMarkerRef.current = L.marker(data[0]).addTo(map)
//         //       .bindPopup('Start Point')
//         //       .openPopup();
//         //   }
      
//         //   if (!endMarkerRef.current) {
//         //     endMarkerRef.current = L.marker(data[1]).addTo(map)
//         //       .bindPopup('End Point')
//         //       .openPopup();
//         //   }

//         return ()=>{
//             if(routingControl){
//                 map.removeControl(routingControl);
//             }

//             if(polyline){
//                 map.removeControl(polyline);
//             }

//     //         if (startMarkerRef.current) map.removeLayer(startMarkerRef.current);
//     //   if (endMarkerRef.current) map.removeLayer(endMarkerRef.current);
//         }
        
//     }, [map, data[0], data[1], marker, polyline, taxiIcon]);
    
//     return null
// }