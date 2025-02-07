const mongoose = require("mongoose");

// Sub-schema: Property Address
const propertyAddressSchema = mongoose.Schema({
  plotNo: { type: String, required: true, trim: true },
  street: { type: String, required: true, trim: true },
  landmark: { type: String, required: true, trim: true },
  pinCode: { type: Number, required: true, min: 100000, max: 999999 },
  zone: {
    type: String,
    required: true,
    enum: ["east", "west", "south", "north"],
  },
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  country: { type: String, default: "india", trim: true },
});

// Sub-schema: Road Property Subject
const roadPropertySubjectSchema = mongoose.Schema({
  roadWidth: { type: String, required: true },
  roadWideningProposal: { type: Boolean, default: false },
  primaryRoadType: {
    type: String,
    required: true,
    enum: ["mainRoad", "innerRoad"],
  },
  secondaryRoadType: {
    type: String,
    required: true,
    enum: ["pakkaRoad", "kachaRoad"],
  },
});

// Sub-schema: Details
const detailsSchema = mongoose.Schema({
  floorName: { type: String, required: true, trim: true },
  accommodation: { type: String, required: true, trim: true },
  builtupArea: { type: String, required: true },
  projectionArea: { type: String, required: true },
});

// Main Schema: Property Details
const propertyDetailsSchema = new mongoose.Schema(
  {
    caseId: { type: mongoose.Schema.ObjectId, required: true, ref: "cases" },
    caseCode: { type: String, required: true, trim: true },
    bankName: { type: String, required: true, trim: true },
    applicantName: { type: String, required: true, trim: true },
    mobileNo: {
      type: String,
      required: true,
      match: /^[6-9]\d{9}$/, // Validates Indian mobile numbers
    },
    dateOfVisit: { type: Date, required: true },
    geolocation: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], required: true },
    },
    personMetAtSite: { type: String, required: true, trim: true },
    personMetAtSiteMobileNo: {
      type: String,
      required: true,
      match: /^[6-9]\d{9}$/,
    },
    electricityMeterNo: { type: String, required: true, trim: true },
    propertyAddress: { type: propertyAddressSchema, required: true },
    sewerageConnection: { type: Boolean, required: true },
    roadPropertySubject: { type: roadPropertySubjectSchema, required: true },
    buildingCracks: { type: Boolean, required: true },
    identificationOfProperty: {
      type: String,
      enum: [
        "self",
        "helpOfApplicant",
        "nonIdentifiable",
        "otherNumbersInStreet",
        "localInquiry",
      ],
      required: true,
    },
    locationOfProperty: {
      type: String,
      enum: ["normal", "parkFacing", "corner", "mainRoad"],
      required: true,
    },
    typesOfLocality: {
      type: String,
      enum: [
        "residential",
        "commercial",
        "industrial",
        "agricultural",
        "institutional",
      ],
      required: true,
    },
    typesOfArea: {
      type: String,
      enum: ["authorized", "regularized", "unauthorized", "urbanizedVillage"],
      required: true,
    },
    neighbourhood: {
      type: String,
      enum: ["poshArea", "middleClassArea", "jhuggiArea", "villageArea"],
      required: true,
    },
    typesOfProperty: {
      type: String,
      enum: [
        "rowHouse",
        "builderFloor",
        "builderFlat",
        "developerFlat",
        "authorityFlat",
        "shop",
        "office",
        "industry",
        "warehouse",
        "vacantPlot",
      ],
      required: true,
    },
    currentUseOfProperty: {
      type: String,
      enum: [
        "residential",
        "commercial",
        "industrial",
        "agricultural",
        "mixedUse",
      ],
      required: true,
    },
    occupancyStatus: {
      type: String,
      enum: ["vacant", "tenantOccupied", "selfOccupied", "sellerOccupied"],
      required: true,
    },
    relationWithLoanApplicant: { type: String, required: true, trim: true },
    detailsOfRentedProperty: {
      type: {
        nameOfTenant: { type: String, required: true, trim: true },
        mobileNo: {
          type: String,
          required: true,
          match: /^[6-9]\d{9}$/,
        },
        yearsOfTenancy: { type: Number, required: true },
        monthlyRent: { type: Number, required: true },
      },
      required: true,
    },
    stageOfConstruction: {
      type: String,
      enum: ["completed", "underConstruction", "underRenovation"],
      required: true,
    },
    yearOfConstruction: { type: Number, required: true },
    demarcationOfPlot: { type: Boolean, required: true },
    areaOfPlot: {
      type: {
        length: { type: Number, required: true },
        width: { type: Number, required: true },
      },
      required: true,
    },
    structureOfBuilding: {
      type: {
        numberOfFloors: { type: Number, required: true },
        numberOfBasements: { type: Number, required: true },
        heightOfCompleteBuilding: { type: Number, required: true },
        roofRights: { type: Boolean, required: true },
      },
      required: true,
    },
    dwellingUnits: {
      type: {
        numberOfUnitsAtStiltFloor: { type: Number, required: true },
        numberOfUnitsPerFloor: { type: Number, required: true },
        totalUnits: { type: Number, required: true },
      },
      required: true,
    },
    groundFloorDetails: {
      type: {
        useOfGroundFloor: {
          type: String,
          enum: ["stilt", "unit", "partStilt", "partUnit"],
          required: true,
        },
        heightOfStiltFloor: { type: Number, required: true },
        areaOfParking: { type: Number, required: true },
      },
      required: true,
    },
    details: { type: [detailsSchema], required: true },
    valueOfProperty: { type: Number, required: true },
    remarks: { type: String, required: true, trim: true },
    images: { type: [String], default: [] },
    fieldExecutiveSpotImage: { type: String, required: true },
  },
  { timestamps: true }
);

const PropertyDetailsModel = mongoose.model(
  "PropertyDetails",
  propertyDetailsSchema
);

module.exports = PropertyDetailsModel;
