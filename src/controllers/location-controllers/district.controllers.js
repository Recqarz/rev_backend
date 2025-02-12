const { District } = require("../../models/locationModel");

const addDistrict = async (req, res) => {
  try {
    const { name, stateId } = req.body;
    if (!stateId) {
      return res.status(404).send({ error: "state-id is required" });
    }
    if (!name?.trim()) {
      return res.status(404).send({ error: "name is required" });
    }
    // Format name to lowercase and remove leading/trailing whitespaces
    const formattedName = name.trim().toLowerCase();
    const district = new District({ name: formattedName, state: stateId });
    await district.save();
    return res.status(201).json({ message: "District added", district });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const getAllDistricts = async (req, res) => {
  try {
    const { stateId } = req.params;
    const districts = await District.find({ state: stateId }).populate({
      path: "state",
      select: "name",
    });
    return res
      .status(200)
      .json({ message: "District fetched successfully!", data: districts });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = { addDistrict, getAllDistricts };
