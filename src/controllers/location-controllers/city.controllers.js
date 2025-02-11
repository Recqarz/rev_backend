// const { City } = require("../../models/locationModel");

// const addCity = async (req, res) => {
//   try {
//     const { name, districtId } = req.body;
//     if (!districtId) {
//       return res.status(404).send({ error: "district-id is required" });
//     }

//     if (!name?.trim()) {
//       return res.status(404).send({ error: "name is required" });
//     }

//     // Format name to lowercase and remove leading/trailing whitespaces
//     const formattedName = name.trim().toLowerCase();
//     const city = new City({ name: formattedName, district: districtId });
//     await city.save();
//     res
//       .status(201)
//       .json({ message: "City added successfully!", city: formattedName });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// const getAllCity = async (req, res) => {
//   try {
//     const { districtId } = req.params;
//     const cities = await City.find({ district: districtId });
//     res.status(200).json({ cities });
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

// module.exports = { addCity, getAllCity };
