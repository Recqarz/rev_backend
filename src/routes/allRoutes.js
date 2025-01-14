const express = require("express");
const commonRoute = require("./commonRoute");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const adminRoute = require("./adminRoute");

const allRoutes = express.Router();

allRoutes.use("/v1/user", commonRoute);
allRoutes.use("/v1/admin", authMiddleware, adminMiddleware, adminRoute);

module.exports = allRoutes;
