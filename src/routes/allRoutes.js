const express = require("express");
const commonRoute = require("./commonRoute");
const authMiddleware = require("../middlewares/authMiddleware");
const adminRoute = require("./adminRoute");
const coordinatorRoute = require("./coordinatiorRoute");
const fieldExecutiveRoute = require("./field-executiveRoute");
const locationRoute = require("./locationRoutes");
const { supervisorRoute } = require("./supervisorRoute");

const allRoutes = express.Router();

allRoutes.use("/v1/user", commonRoute);
allRoutes.use("/v1/coordinator", authMiddleware, coordinatorRoute);
allRoutes.use("/v1/field-executive", authMiddleware, fieldExecutiveRoute);
allRoutes.use("/v1/admin", authMiddleware, adminRoute);
allRoutes.use("/v1/location", locationRoute);
allRoutes.use("/v1/supervisor", authMiddleware, supervisorRoute);

module.exports = allRoutes;
