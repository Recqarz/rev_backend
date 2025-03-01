const express = require("express");
const {
  getSupervisorCase,
} = require("../controllers/supervisor/getAllSupervisorAssignCase");
const getCaseAndFieldExecutiveFomData = require("../controllers/supervisor/getCaseAndFieldExecutiveFomData");
const verifyCaseBySupervsor = require("../controllers/supervisor/verifyCaseBySupervsor");
const { supervisorDashboard } = require("../controllers/supervisor/supervisor.dashboard.controller");


const supervisorRoute = express.Router();

supervisorRoute.get("/cases", getSupervisorCase);
supervisorRoute.get("/case/:caseId", getCaseAndFieldExecutiveFomData);
supervisorRoute.patch("/case/:caseId/verify", verifyCaseBySupervsor);
supervisorRoute.get("/dashboard-data", supervisorDashboard);

module.exports = { supervisorRoute };
