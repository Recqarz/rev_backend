const express = require("express");
const {
  getFieldExecutiveAssignCase,
} = require("../controllers/field-executive/getAssignCases");
const {
  createFieldExecutiveForm,
} = require("../controllers/field-executive/createFieldExecutiveForm");
const { upload } = require("../middlewares/multer.middleware");
const {
  getCaseAndFieldExecutiveDetailsByCaseId,
} = require("../controllers/field-executive/getCaseAndFieldExecutiveDetailsByCaseId");
const {
  updateFieldExecutiveForm,
} = require("../controllers/field-executive/updateFieldExecutiveForm");

const fieldExecutiveRoute = express.Router();

// get list of assign users
fieldExecutiveRoute.get("/cases/list", getFieldExecutiveAssignCase);
fieldExecutiveRoute.get(
  "/case-fieldExecutive/:caseId",
  getCaseAndFieldExecutiveDetailsByCaseId
);

// create field-executive form-data
fieldExecutiveRoute.post(
  "/cases/:id/property-details/create",
  upload.fields([
    { name: "images", maxCount: 10 }, // Adjust maxCount as needed
    { name: "fieldExecutiveSpotImage", maxCount: 1 },
  ]),
  createFieldExecutiveForm
);

// update field-executive form-data
fieldExecutiveRoute.patch(
  "/cases/:id/property-details/update",
  upload.fields([
    { name: "images", maxCount: 10 }, // Adjust maxCount as needed
    { name: "fieldExecutiveSpotImage", maxCount: 1 },
  ]),
  updateFieldExecutiveForm
);

module.exports = fieldExecutiveRoute;
