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
const { getFinalReportInPDF } = require("../controllers/auditor/finalReportsPdf");
const { sendFinalReportInPDF } = require("../services/email.pdf");
const { sendEmailFinalReportWord } = require("../services/email.word");
const { sendwhatsappFinalReportInPDF } = require("../services/whatsapp.pdf");
// const { sendwhatsappFinalReportWord } = require("../services/whatsapp.word");
const auditorRoute = express.Router();

auditorRoute.get("/cases", getAllAuditorCases);
auditorRoute.get("/cases/:caseId", getCaseDataByIdForAuditor);
auditorRoute.patch("/cases/:caseId/verify", verifyCaseByAuditor);
auditorRoute.get("/cases/:caseId/finalreport", generateFinalReport);
auditorRoute.get("/cases/:caseId/finalreport/pdf", getFinalReportInPDF);
auditorRoute.get("/dashboard-data", auditorDashboard);

auditorRoute.post("/cases/:caseId/finalreport/pdf/send/email", sendFinalReportInPDF);
auditorRoute.post("/cases/:caseId/finalreport/word/send/email", sendEmailFinalReportWord);
auditorRoute.post("/cases/:caseId/finalreport/pdf/send/whatsapp", sendwhatsappFinalReportInPDF);
// auditorRoute.post("/cases/:caseId/finalreport/word/send/whatsapp", sendwhatsappFinalReportWord);

module.exports = { auditorRoute };
