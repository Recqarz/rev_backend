const express = require("express");
const {
  getSupervisorCase,
} = require("../controllers/supervisor/getAllSupervisorAssignCase");

const superRoute = express.Router();

superRoute.get("/cases", getSupervisorCase);

module.exports = { superRoute };
