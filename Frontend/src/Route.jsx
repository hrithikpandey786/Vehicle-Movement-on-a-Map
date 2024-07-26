import React from "react";
import { Popup, useMap } from "react-leaflet";
import L, { marker } from 'leaflet';
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import 'leaflet-routing-machine';


export default function Route({start, end}){
    const map = useMap();
    const [marker, setMarker] = React.useState(null);
    const [polyline, setPolyline] = React.useState(null);

    const taxiIcon = L.icon({
        iconUrl: "./car.png",
        iconSize: [38, 38]
    })
    
    
    React.useEffect(()=>{
        if(!map){
            return;
        }
        
        if(!marker){
            const newMarker = L.marker([25.4358, 81.8463], {icon: taxiIcon}).addTo(map)
            .bindPopup("Vehicle Starting Position", { closeOnClick: false, autoClose: false })
            // .openPopup();
            setMarker(newMarker);
        }

        if(!polyline){
            const newPolyline = L.polyline([],{color: 'green'}).addTo(map);
            setPolyline(newPolyline);
        }

        const routingControl = L.Routing.control({
            waypoints: [
                L.latLng(start[0], start[1]),
                L.latLng(end[0], end[1])
            ],
            // routeWhileDragging: true,
            // show: true,
            // addWaypoints: false
        }).on('routesfound', (e)=>{
            const routeCoordinates = e.routes[0].coordinates;
            
            if(polyline){
                polyline.setLatLngs(routeCoordinates);
            }

            routeCoordinates.forEach((coord, index)=>{
                
                setTimeout(()=>{
                    if(marker){
                        

                        marker.setLatLng([coord.lat, coord.lng]);  
                        marker.getPopup().setContent(`Vehicle is at ${coord.lat.toFixed(4)}, ${coord.lng.toFixed(4)}`)
                    }
                    
                    if(polyline){
                        const traveledPath = routeCoordinates.slice(0, index+1);
                        polyline.setLatLngs(traveledPath);
                    }
                }, 30*index);
            })
        }).addTo(map);

        return ()=>{
            if(routingControl){
                map.removeControl(routingControl);
            }

            if(polyline){
                map.removeControl(polyline);
            }
        }
        
    }, [map, start, end, marker, polyline, taxiIcon]);
    
    return null
}