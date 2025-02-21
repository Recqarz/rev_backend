const express = require("express");
const {
  getSupervisorCase,
} = require("../controllers/supervisor/getAllSupervisorAssignCase");
const getCaseAndFieldExecutiveFomData = require("../controllers/supervisor/getCaseAndFieldExecutiveFomData");

const superRoute = express.Router();

superRoute.get("/cases", getSupervisorCase);
superRoute.get("/case/:caseId", getCaseAndFieldExecutiveFomData);

module.exports = { superRoute };
