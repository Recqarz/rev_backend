const express = require("express");
const { userLogin } = require("../controllers/common/userLogin");
const { updateUser } = require("../controllers/common/updateUser");
const authMiddleware = require("../middlewares/authMiddleware");

const commonRoute = express.Router();

commonRoute.post("/login", userLogin);
commonRoute.patch("/update", authMiddleware, updateUser);

module.exports = commonRoute;
