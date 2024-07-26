const prisma = require("../lib/prsima-client");

const track = (req, res) =>{
    try{

    } catch(err){
        console.log(err);
        res.status(500).json({message: "Error to get data"});
    }
}

module.exports = {track};