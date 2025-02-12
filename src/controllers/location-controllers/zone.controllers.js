const { Zone } = require("../../models/locationModel");

const addZone = async (req, res) => {
  try {
    const { name, districtId } = req.body;

    if (!districtId) {
      return res.status(404).json({ error: "district-id is required" });
    }

    if (!name?.trim()) {
      return res.status(400).json({ error: "Zone name is required" });
    }

    const formattedName = name.trim().toLowerCase();

    // Validate against enum values (case-sensitive)
    const allowedZones = ["north", "south", "east", "west"];
    if (!allowedZones.includes(formattedName)) {
      return res.status(400).json({
        error: `Invalid zone name. Allowed values: ${allowedZones.join(", ")}`,
      });
    }

    const existingZone = await Zone.findOne({
      $and: [{ district: districtId, name: formattedName }],
    });

    if (existingZone && existingZone.name === formattedName) {
      return res.status(400).json({ error: "Zone name already exists" });
    }

    const zone = new Zone({ name: formattedName, district: districtId });
    await zone.save();
    res.status(201).json({ message: "Zone added", data: zone });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getAllZones = async (req, res) => {
  try {
    const { districtId } = req.params;

    // Validate input
    if (!districtId) {
      return res.status(400).json({ error: "district-ID is required" });
    }

    // Fetch zones for the specified district
    const zones = await Zone.find({ district: districtId })
      .select("name district createdAt updatedAt")
      .populate({
        path: "district",
        select: "name state", // Select district name and state reference
        populate: {
          path: "state", // Populate state inside district
          select: "name", // Select state name
        },
      });

    console.log(zones);

    return res
      .status(200)
      .json({ message: "Zones fetched successfully", data: zones });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: err.message });
  }
};

module.exports = { addZone, getAllZones };
