const express = require("express");
const app = express();
const trackRoute = require("./routes/traveledDist.route");
const addRoute = require("./routes/add.route");
const cors = require("cors");

app.use(express.json());
app.use(cors({origin: "http://localhost:5173", credentials: true}));

app.use("/api/traveledDist", trackRoute);
app.use("/api/add", addRoute);

app.listen(8800, ()=>{
    console.log("Server is listening to port 8800");
})