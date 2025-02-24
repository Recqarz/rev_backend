const express = require("express");
const {
  getSupervisorCase,
} = require("../controllers/supervisor/getAllSupervisorAssignCase");
const getCaseAndFieldExecutiveFomData = require("../controllers/supervisor/getCaseAndFieldExecutiveFomData");
const verifyCaseBySupervsor = require("../controllers/supervisor/verifyCaseBySupervsor");

const supervisorRoute = express.Router();

supervisorRoute.get("/cases", getSupervisorCase);
supervisorRoute.get("/case/:caseId", getCaseAndFieldExecutiveFomData);
supervisorRoute.patch("/case/:caseId/verify", verifyCaseBySupervsor);

module.exports = { supervisorRoute };
