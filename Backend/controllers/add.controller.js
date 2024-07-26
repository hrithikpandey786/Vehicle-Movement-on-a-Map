const prisma = require("../lib/prsima-client");

const addCoordinates = async (req, res) =>{
    const latitude = req.latitude;
    const longitude = req.longitude;

    try{
        const newCoordinates = await prisma.vehicleCoordinates.create({
            data:{
                latitude,
                longitude
            }
        })

        res.status(200).json(newCoordinates);
    } catch(err){
        console.log(err);
        res.status(500).json({message: "Error while adding coordinates to database"})
    }
}

module.exports = {addCoordinates}