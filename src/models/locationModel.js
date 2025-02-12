const mongoose = require("mongoose");

const stateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

const districtSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State",
      required: true,
    },
  },
  { timestamps: true }
);

// const citySchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     district: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "District",
//       required: true,
//     },
//   },
//   { timestamps: true }
// );

const zoneSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enum: ["north", "south", "east", "west"], // Allowed values
      trim: true,
    },
    district: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "District",
      required: true,
    },
  },
  { timestamps: true }
);

const State = mongoose.model("State", stateSchema);
const District = mongoose.model("District", districtSchema);
// const City = mongoose.model("City", citySchema);
const Zone = mongoose.model("Zone", zoneSchema);

module.exports = { State, District, Zone };
