const express = require("express");
const route = express.Router();
const controllers = require("../controllers/track.controller");

route.get("/", controllers.track);

module.exports = route;