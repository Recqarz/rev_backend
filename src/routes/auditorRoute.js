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
const auditorRoute = express.Router();

auditorRoute.get("/cases", getAllAuditorCases);
auditorRoute.get("/cases/:caseId", getCaseDataByIdForAuditor);
auditorRoute.patch("/cases/:caseId/verify", verifyCaseByAuditor);

module.exports = { auditorRoute };
