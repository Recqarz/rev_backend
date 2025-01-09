const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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
  street: {
    type: String,
    default: "",
  },
  pinCode: {
    type: Number,
    default: null,
  },
  city: {
    type: String,
    default: "",
  },
  state: {
    type: String,
    default: "",
  },
  country: {
    type: String,
    default: "India",
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
      unique: true,
    },
    mobile: {
      type: Number,
      unique: true,
      required: true,
    },
    userCode: {
      type: String,
      required: true,
      unique: true,
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
      unique: true,
    },
    aadhaarNumber: {
      type: String,
      unique: true,
    },
    voterId: {
      type: String,
      unique: true,
    },
    workForBank: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "banks",
    },
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
    Geolocation: {
      type: String,
      required: false, // Optional: Remove required if you want it optional
      default: null, // or use a valid default value
    },
    otpMobile: {
      type: String, // Changed to String for OTP as it's often in string format
      default: null,
    },
    otpEmail: {
      type: String, // Changed to String for OTP as it's often in string format
      default: null,
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

// Pre-save middleware to hash password
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      const salt = await bcrypt.genSalt(10); // Generate a salt with a 10-round cost factor
      this.password = await bcrypt.hash(this.password, salt); // Hash the password
      next(); // Continue with the save operation
    } catch (err) {
      next(err); // Pass any error to the next middleware
    }
  } else {
    next(); // If the password is not modified, just proceed
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const UserModel = mongoose.model("users", userSchema);

module.exports = UserModel;
