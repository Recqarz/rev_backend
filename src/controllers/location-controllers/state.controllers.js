const { State } = require("../../models/locationModel");

const addState = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) {
      return res.status(400).send({ error: "Name is required" });
    }
    // Format name to lowercase and remove leading/trailing whitespaces
    const formattedName = name.trim().toLowerCase();

    // Check if state already exists
    const existingState = await State.findOne({ name: formattedName });
    if (existingState) {
      return res.status(400).send({ error: "State already exists" });
    }
    const state = new State({ name: formattedName });
    await state.save();
    return res
      .status(201)
      .send({ message: "State added successfull!", data: state });
  } catch (err) {
    return res.status(400).send({ error: err.message });
  }
};

// GET all states;

const getAllStates = async (req, res) => {
  try {
    const states = await State.find();
    if (!states.length) {
      return res.status(404).json({ error: "No states found!" });
    }
    return res
      .status(200)
      .send({ message: "states fetched successfully!", data: states });
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
};

module.exports = { addState, getAllStates };
