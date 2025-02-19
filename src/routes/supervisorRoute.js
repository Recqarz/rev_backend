const express = require("express");
const {
  getSupervisorCase,
} = require("../controllers/supervisor/getAllSupervisorAssignCase");

const superRoute = express.Router();

superRoute.get("/data", getSupervisorCase);

module.exports = { superRoute };
