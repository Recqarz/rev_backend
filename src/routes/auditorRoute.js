const express = require("express");
const {
  getAllAuditorCases,
} = require("../controllers/auditor/getAllAuditorAssignCase");
const {
  getCaseDataByIdForAuditor,
} = require("../controllers/auditor/getCaseDataByIdForAuditor");
const {
  verifyCaseByAuditor,
} = require("../controllers/auditor/verifyCaseByAuditor");
const { generateFinalReport } = require("../controllers/auditor/finalReports");
const { auditorDashboard } = require("../controllers/auditor/auditor.dashboard.controller");
const auditorRoute = express.Router();

auditorRoute.get("/cases", getAllAuditorCases);
auditorRoute.get("/cases/:caseId", getCaseDataByIdForAuditor);
auditorRoute.patch("/cases/:caseId/verify", verifyCaseByAuditor);
auditorRoute.get("/cases/:caseId/finalreport", generateFinalReport);
auditorRoute.get("/dashboard-data", auditorDashboard);

module.exports = { auditorRoute };
