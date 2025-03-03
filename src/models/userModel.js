const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { hashData } = require("../utils/hasData");

const otpSchema = new mongoose.Schema({
  expirationTime: Number,
  emailOtp: String,
  mobileOtp: String,
  isVerify: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const BankDetailsSchema = new mongoose.Schema({
  accountNumber: {
    type: Number,
    required: true,
  },
  bankName: {
    type: String,
    required: true,
  },
  branchName: {
    type: String,
    required: true,
  },
  IFSC: {
    type: String,
    required: true,
  },
  nameAsPerBank: {
    type: String,
    required: true,
  },
});

const addressSchema = new mongoose.Schema({
  country: {
    type: String,
    default: "India",
  },
  state: {
    type: mongoose.Schema.ObjectId,
    ref: "State",
  },
  district: {
    type: mongoose.Schema.ObjectId,
    ref: "District",
  },
  pinCode: {
    type: Number,
    default: null,
  },
  street: {
    type: String,
    default: "",
  },
  zone: {
    type: mongoose.Schema.ObjectId,
    ref: "Zone",
  },
});

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    userCode: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "coordinator", "fieldExecutive", "supervisor", "auditor"],
      required: true,
    },
    panNumber: {
      type: String,
    },
    aadhaarNumber: {
      type: String,
    },
    voterId: {
      type: String,
    },
    workForBank: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "banks",
        default: [],
      },
    ],
    bankDetails: {
      type: BankDetailsSchema,
      default: null, // Optional: Set to null if not required
    },
    modules: {
      type: [String],
      default: [],
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    avatar: {
      type: String,
      default: null,
    },
    address: {
      type: addressSchema,
      default: null,
    },
    userGeolocation: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: {
        type: [Number],
        validate: {
          validator: function (coords) {
            return coords.length === 2;
          },
          message: "userGeolocation must be an array of [longitude, latitude]",
        },
      },
    },
    userGeoFormattedAddress: {
      type: String,
    },
    otp: {
      type: otpSchema,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    refreshToken: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
userSchema.index({ userGeolocation: "2dsphere" });

// Pre-save middleware to hash password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      this.password = await hashData(this.password);
      next(); // Continue with the save operation
    } catch (err) {
      next(err); // Pass any error to the next middleware
    }
  } else {
    next(); // If the password is not modified, just proceed
  }
});

const UserModel = mongoose.model("users", userSchema);

module.exports = UserModel;
