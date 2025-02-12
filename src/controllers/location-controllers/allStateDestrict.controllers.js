const path = require("path");
const fs = require("fs");

const getAllStateDistrict = async (req, res) => {
  try {
    // Load the JSON file
    const filePath = path.join(
      __dirname,
      "../../public/india_state_district.json"
    );
    const jsonData = fs.readFileSync(filePath, "utf-8");

    // Send JSON response
    return res.status(200).json({
      message: "States and districts fetched successfully",
      data: JSON.parse(jsonData),
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllStateDistrict };
