const express = require("express");
const { addCase } = require("../controllers/coordinatior/addCase");

const coordinatorRoute = express.Router();

coordinatorRoute.post("/add-case", addCase);

module.exports = coordinatorRoute;
