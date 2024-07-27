import "./header.scss";
import React from "react";
import axios from "axios";


export default function Header(){
    const [distanceTraveled, setDistanceTraveled] = React.useState("");

    async function fetchDistanceTraveled(e){
        // e.preventDefault();
        setDistanceTraveled("");

        const dateTime = new Date(e.target.value).toISOString();
        

        try{
            const dist = await axios.get(`http://localhost:8800/api/traveledDist?dateTime=${dateTime}`)
            
            setDistanceTraveled(dist.data);
        } catch(err){
            console.log(err);
        }
    }

    return(
        <nav>
        <h2>Vehicle Movement on Map</h2>
        <div className="inputs">
            <div>
            <label for='date'>Distance Travelled: </label>
            <input 
                type="date"
                onChange={fetchDistanceTraveled}
                name="date"
            >
            </input>
            </div>
            {distanceTraveled && <span>{distanceTraveled} km</span>}
        </div>
      </nav>
    )
}
