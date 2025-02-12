const express = require("express");
const {
  addState,
  getAllStates,
} = require("../controllers/location-controllers/state.controllers");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const {
  addDistrict,
  getAllDistricts,
} = require("../controllers/location-controllers/district.controllers");
// const {
//   addCity,
//   getAllCity,
// } = require("../controllers/location-controllers/city.controllers");
const {
  addZone,
  getAllZones,
} = require("../controllers/location-controllers/zone.controllers");

const locationRoute = express.Router();

// Add State
locationRoute.post("/state", addState);
locationRoute.get("/state-list", getAllStates);

// Add District
locationRoute.post("/district", addDistrict);
locationRoute.get("/district-list/:stateId", getAllDistricts);

// Add City
// locationRoute.post("/city", addCity);
// locationRoute.get("/city-list/:districtId", getAllCity);

// Add Zone
locationRoute.post("/zone", addZone);
locationRoute.get("/zone-list/:districtId", getAllZones);

module.exports = locationRoute;
