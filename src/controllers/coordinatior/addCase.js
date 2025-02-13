const CaseModel = require("../../models/caseModel");
const UserModel = require("../../models/userModel");

const addCase = async (req, res) => {
  try {
    const {
      bankId,
      bankRefNo,
      clientName,
      BOV_ReportNo,
      clientAddress,
      contactNo,
      visitDate,
      clientGeolocation,
      clientGeoFormattedAddress,
      stateId,
      districtId,
      zoneId,
      fieldExecutiveId,
    } = req.body;

    // Fix required field validation
    if (
      !bankId ||
      !bankRefNo ||
      !clientName ||
      !BOV_ReportNo ||
      !stateId ||
      !districtId ||
      !zoneId ||
      !clientAddress ||
      !contactNo ||
      !visitDate ||
      !clientGeolocation ||
      !clientGeoFormattedAddress
    ) {
      return res
        .status(400)
        .send({ error: "Oops! Please fill all required fields!" });
    }

    // Fix geolocation validation
    const longitude = clientGeolocation?.longitude;
    const latitude = clientGeolocation?.latitude;
    if (!longitude || !latitude) {
      return res.status(400).send({ error: "Invalid geolocation data." });
    }

    // Case code creation
    const allCase = await CaseModel.find();
    const newCaseNumber = allCase.length
      ? Number(allCase[allCase.length - 1].caseCode.split("_")[1]) + 1
      : 1;
    const caseCode = `CS_${String(newCaseNumber).padStart(4, "0")}`;

    // Auto-assign field executive based on location
    let fieldexecutive = null;
    if (!fieldExecutiveId) {
      fieldexecutive = await UserModel.findOne({
        role: "fieldExecutive",
        userGeolocation: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
          },
        },
      });
      ("");
    }
    // console.log("***********fieldexecutive=====", fieldexecutive);

    // Prepare case data
    const data = {
      bankId,
      bankRefNo,
      clientName,
      BOV_ReportNo,
      state: stateId,
      district: districtId,
      zone: zoneId,
      clientAddress,
      contactNo,
      visitDate,
      caseCode,
      coordinatorId: req.user._id,
      fieldExecutiveId: fieldExecutiveId || fieldexecutive?._id || null, // Ensure it doesn't crash
      clientGeolocation: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      clientGeoFormattedAddress,
    };

    // Create and save case
    const newCase = await CaseModel.create(data);
    if (!newCase) {
      return res.status(400).send({ error: "Oops. Case not created!" });
    }

    await newCase.save();
    return res
      .status(200)
      .send({ message: "Case created successfully", data: newCase });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: error?.message });
  }
};

module.exports = { addCase };
