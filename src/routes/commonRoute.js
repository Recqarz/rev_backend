const express = require("express");
const { userLogin } = require("../controllers/common/userLogin");

const commonRoute = express.Router();

commonRoute.post("/login", userLogin);

module.exports = commonRoute;
