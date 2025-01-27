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
  },
  { timestamps: true }
);

const PropertyDetailsModel = mongoose.model(
  "PropertyDetails",
  propertyDetailsSchema
);

module.exports = PropertyDetailsModel;

/** JSON formate */
/**
{
  "caseId": "CASE12345",
  "bankName": "State Bank of India",
  "applicantName": "John Doe",
  "mobileNo": "9876543210",
  "dateOfVisit": "2025-01-22T00:00:00Z",
  "geolocation": {
    "type": "Point",
    "coordinates": [77.5946, 12.9716]
  },
  "personMetAtSite": "Jane Doe",
  "personMetAtSiteMobileNo": "9123456789",
  "electricityMeterNo": "EM123456",
  "propertyAddress": {
    "street": "123 Main Street",
    "pinCode": 560001,
    "zone": "East Zone",
    "city": "Bangalore",
    "state": "Karnataka",
    "country": "India"
  },
  "sewerageConnection": true,
  "roadPropertySubject": {
    "roadWidth": "12 meters",
    "roadWideningProposal": false,
    "primaryRoadType": "Concrete",
    "secondaryRoadType": "Asphalt"
  },
  "buildingCracks": false,
  "identificationOfProperty": "self",
  "locationOfProperty": "parkFacing",
  "typesOfLocality": "residential",
  "typesOfArea": "authorized",
  "neighbourhood": "middleClassArea",
  "typesOfProperty": "builderFlat",
  "currentUseOfProperty": "residential",
  "occupancyStatus": "selfOccupied",
  "relationWithLoanApplicant": "Owner",
  "detailsOfRentedProperty": {
    "nameOfTenant": "Alice Smith",
    "mobileNo": "9876543211",
    "yearsOfTenancy": 2,
    "monthlyRent": 15000
  },
  "stageOfConstruction": "completed",
  "yearOfConstruction": 2018,
  "demarcationOfPlot": true,
  "areaOfPlot": {
    "length": 30,
    "width": 40
  },
  "structureOfBuilding": {
    "numberOfFloors": 5,
    "numberOfBasements": 1,
    "heightOfCompleteBuilding": 15,
    "roofRights": true
  },
  "dwellingUnits": {
    "numberOfUnitsAtStiltFloor": 2,
    "numberOfUnitsPerFloor": 4,
    "totalUnits": 20
  },
  "groundFloorDetails": {
    "useOfGroundFloor": "Stilt",
    "heightOfStiltFloor": 3.5,
    "areaOfParking": 100
  },
  "details": [
    {
      "floorName": "Ground Floor",
      "accommodation": "2BHK",
      "builtupArea": 1200,
      "projectionArea": 200
    },
    {
      "floorName": "First Floor",
      "accommodation": "3BHK",
      "builtupArea": 1500,
      "projectionArea": 250
    }
  ],
  "valueOfProperty": 5000000,
  "remarks": "Well-maintained property with good road connectivity.",
  "geoTagPhotos": ["photo1.jpg", "photo2.jpg"],
  "images": ["image1.jpg", "image2.jpg"]
}

 ****/
