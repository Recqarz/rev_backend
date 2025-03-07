const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  addressLine1: {
    type: String,
    required: true,
  },
  addressLine2: {
    type: String,
  },
  plotNumber: {
    type: String,
  },
  streetName: {
    type: String,
  },
  landMark: {
    type: String,
  },
  pincode: {
    type: String,
    required: true,
    match: [/^\d{6}$/, "Pincode must be exactly 6 digits"],
  },
});

const verifiedBySchema = new mongoose.Schema({
  fieldExecutive: { type: Boolean, default: false },
  supervisor: { type: Boolean, default: false },
  auditor: { type: Boolean, default: false },
});

const dailyQuerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);


const reportDeliverySchema = new mongoose.Schema({
  whatsAppStatus: {
    pdf: {
      status: { type: Boolean, default: false },
      wpUserLists: { type: [String], default: [] },
    },
  },
  emailStatus: {
    pdf: {
      status: { type: Boolean, default: false },
      emailUserLists: { type: [String], default: [] },
    },
    msWord: {
      status: { type: Boolean, default: false },
      emailUserLists: { type: [String], default: [] },
    },
  },
});







const caseSchema = new mongoose.Schema(
  {
    caseCode: {
      type: String,
      required: true,
    },
    bankId: {
      type: mongoose.Schema.ObjectId,
      ref: "banks",
      required: true,
    },
    bankRefNo: {
      type: String,
      required: true,
    },
    clientName: {
      type: String,
      required: true,
    },
    BOV_ReportNo: {
      type: String,
      required: true,
    },
    state: {
      type: mongoose.Schema.ObjectId,
      ref: "State",
      required: true,
    },
    district: {
      type: mongoose.Schema.ObjectId,
      ref: "District",
      required: true,
    },
    zone: {
      type: mongoose.Schema.ObjectId,
      ref: "Zone",
      required: true,
    },
    clientAddress: {
      type: addressSchema,
      required: true,
    },
    clientGeolocation: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: function (coords) {
            return coords.length === 2;
          },
          message: "Coordinates must be an array of [longitude, latitude]",
        },
      },
    },
    clientGeoFormattedAddress: {
      type: String,
      required: true,
    },
    contactNo: {
      type: String,
      required: true,
    },
    alterNateContactNo: {
      type: String,
      default: null,
    },
    product: {
      type: String,
      default: null,
    },
    feeTypes: {
      type: String,
      default: null,
    },
    dailyQuery: {
      type: [dailyQuerySchema],
    },
    coordinatorId: {
      type: mongoose.Schema.ObjectId,
      ref: "users",
      required: true,
    },
    fieldExecutiveId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "users",
    },
    verifiedBy: {
      type: verifiedBySchema,
      default: () => ({
        fieldExecutive: false,
        supervisor: false,
        auditor: false,
      }),
    },
    supervisorId: {
      type: mongoose.Schema.ObjectId,
      ref: "users",
      default: null,
    },
    auditorId: {
      type: mongoose.Schema.ObjectId,
      ref: "users",
      default: null,
    },
    status: {
      type: String,
      enum: ["process", "pending", "completed", "rejected"],
      default: "process",
      required: true,
    },
    visitDate: {
      type: Date,
      required: true,
    },
    reportDelivery: { type: reportDeliverySchema, default: () => ({}) },
  },
  { timestamps: true }
);

/** Ensure a 2dsphere index is created for geospatial queries */
caseSchema.index({ clientGeolocation: "2dsphere" });

const CaseModel = mongoose.model("cases", caseSchema);

module.exports = CaseModel;
