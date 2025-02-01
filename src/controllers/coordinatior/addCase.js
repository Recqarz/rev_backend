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
      zone,
      contactNo,
      visitDate,
      clientGeolocation,
      clientGeoFrmattedAddresses,
    } = req.body;

    if (
      (!bankId ||
        !bankRefNo ||
        !clientName ||
        !BOV_ReportNo ||
        !clientAddress ||
        !zone ||
        !contactNo ||
        !visitDate ||
        !clientGeolocation,
      !clientGeoFrmattedAddresses)
    ) {
      return res
        .status(400)
        .send({ error: "Oops! Please fill all required fields!" });
    }

    const { longitude, latitude } = clientGeolocation;
    if (!longitude || !latitude) {
      return res.status(400).send({ error: "Invalid geolocation data." });
    }

    // Case code creation
    const allCase = await CaseModel.find();
    const newCaseNumber = allCase.length
      ? Number(allCase[allCase.length - 1].caseCode.split("_")[1]) + 1
      : 1;
    const caseCode = `CS_${String(newCaseNumber).padStart(4, "0")}`;

    // auto assign fieldexecutive based on location

    const allFieldExecutives = await UserModel.find({ role: "fieldExecutive" });
    const fieldExecutive = allFieldExecutives.find(
      (executive) => executive?.address?.zone === zone
    );
    let fieldExecutiveId;
    if (fieldExecutive) {
      fieldExecutiveId = fieldExecutive._id;
    } else {
      // Check if the array is not empty to avoid errors
      if (allFieldExecutives.length > 0) {
        // Generate a random index between 0 and the length of the array - 1
        const randomIndex = Math.floor(
          Math.random() * allFieldExecutives.length
        );

        // Get the _id of the randomly selected field executive
        fieldExecutiveId = allFieldExecutives[randomIndex]._id;
      }
    }

    const data = {
      bankId,
      bankRefNo,
      clientName,
      BOV_ReportNo,
      clientAddress,
      zone,
      contactNo,
      visitDate,
      caseCode,
      coordinatorId: req.user._id,
      fieldExecutiveId,
      clientGeolocation: {
        type: "Point",
        coordinates: [longitude, latitude],
      },
      clientGeoFrmattedAddresses,
    };

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
