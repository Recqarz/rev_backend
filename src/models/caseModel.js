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
    minlength: 6,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  // geoLocation: {
  //   type: {
  //     type: String,
  //     enum: ["Point"],
  //     required: true,
  //   },
  //   coordinates: {
  //     type: [Number],
  //     required: true,
  //   },
  // },
});
/**  Ensure a 2dsphere index is created for geospatial queries */
// addressSchema.index({ geoLocation: "2dsphere" });

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
    clientAddress: {
      type: addressSchema,
      required: true,
    },
    zone: {
      type: String,
      required: true,
      enum: ["north", "south", "east", "west"], // Example zones
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
      ref: "users",
      default: null,
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
      default: "pending",
      required: true,
    },
    visitDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const CaseModel = mongoose.model("cases", caseSchema);

module.exports = CaseModel;
