const dotenv = require("dotenv");
dotenv.config()
const nodemailer = require("nodemailer");
const axios = require("axios");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const CaseModel = require("../models/caseModel");
const PropertyDetailsModel = require("../models/propertyDetailsByFieldExecutiveModel");

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const logoPath = path.join(__dirname, "../utils/REV_logo.png");
class EmailQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
  }

  async addToQueue(task) {
    this.queue.push(task);
    if (!this.isProcessing) {
      await this.processQueue();
    }
  }

  async processQueue() {
    this.isProcessing = true;
    while (this.queue.length > 0) {
      const task = this.queue.shift();
      await task();
    }
    this.isProcessing = false;
  }
}

const emailQueue = new EmailQueue();
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendEmailWithOrderSheet(email, filepath, fileName) {
  const maxRetries = 4;
  let attempts = 0;

  const outlookEmail = process.env.OUTLOOK_EMAIL;
  const outlookPassword = process.env.OUTLOOK_PASSWORD;
  const fromEmail = process.env.FROMEMAIL;
  const subject = `Final Report`;
  const body = `Please find the attached PDF report.`;

  await emailQueue.addToQueue(async () => {
    while (attempts < maxRetries) {
      try {
        const transporter = nodemailer.createTransport({
          host: "smtp.office365.com",
          port: 587,
          secure: false,
          auth: {
            user: outlookEmail,
            pass: outlookPassword,
          },
        });

        const mailOptions = {
          from: fromEmail,
          to: email,
          subject: subject,
          text: body,
          attachments: [
            {
              filename: fileName, 
              path: filepath, 
            },
          ],
        };

        await transporter.sendMail(mailOptions);
        await delay(500);
        break;
      } catch (error) {
        attempts++;
        if (attempts === maxRetries) {
          throw new Error("Failed to send email");
        }
      }
    }
  });
}

const sendFinalReportInPDF = async (req, res) => {
  try {
    const { caseId } = req.params;
    const { email } = req.body; // Array of emails

    if (!email || !Array.isArray(email) || email.length === 0) {
      return res.status(400).json({ message: "Invalid email array" });
    }

    const caseData = await CaseModel.findById(caseId).populate([
      { path: "bankId", select: "bankName branchName IFSC" },
      { path: "zone", select: "name" },
      { path: "district", select: "name" },
      { path: "state", select: "name" },
      {
        path: "coordinatorId",
        select: "firstName lastName mobile email role",
      },
      {
        path: "fieldExecutiveId",
        select: "firstName lastName mobile email role",
      },
      {
        path: "supervisorId",
        select: "firstName lastName mobile email role",
      },
      {
        path: "auditorId",
        select: "firstName lastName mobile email role",
      },
    ]);

    if (!caseData) return res.status(404).send({ error: "Case not found" });

    const PropertyDetails = await PropertyDetailsModel.findOne({ caseId });
    if (!PropertyDetails)
      return res.status(404).send({ error: "Property details not found" });

    //caseData

    //bank details
    let bankName = caseData?.bankId?.bankName || "N/A";
    let branchName = caseData?.bankId?.branchName || "N/A";
    let IFSCCode = caseData?.bankId?.IFSC || "N/A";

    //general information
    let clientName = caseData?.clientName || "N/A";
    let contactNum = caseData?.contactNo;
    let visitDate = caseData?.visitDate || "N/A";
    let personMetAtSite = PropertyDetails?.personMetAtSite || "N/A";
    let personMetAtMobile = PropertyDetails?.personMetAtSiteMobileNo || "N/A";

    // address
    let addressLine1 = caseData?.clientAddress?.addressLine1 || "N/A";
    let addressLine2 = caseData?.clientAddress?.addressLine2 || "N/A";
    let plot = caseData?.clientAddress?.plotNumber || "N/A";
    let street = caseData?.clientAddress?.streetName || "N/A";
    let landMark = caseData?.clientAddress?.landMark || "N/A";
    let city = caseData?.district?.name || "N/A";
    let zone = caseData?.zone?.name || "N/A";
    let state = caseData?.state?.name || "N/A";
    let pinCode = caseData?.clientAddress?.pincode || "N/A";
    let longitude = PropertyDetails?.geolocation?.coordinates[0] || "N/A";
    let latitude = PropertyDetails?.geolocation?.coordinates[1] || "N/A";
    let clientGeoFormattedAddress =
      caseData?.clientGeoFormattedAddress || "N/A";

    //coordinator data
    let coName =
      `${caseData?.coordinatorId?.firstName} ${caseData?.coordinatorId?.lastName}` ||
      "N/A";
    let coEmail = caseData?.coordinatorId?.email || "N/A";
    let coMobile = caseData?.coordinatorId?.mobile || "N/A";

    //fe data
    let feName =
      `${caseData?.fieldExecutiveId?.firstName} ${caseData?.fieldExecutiveId?.lastName}` ||
      "N/A";
    let feEmail = caseData?.fieldExecutiveId?.email || "N/A";
    let feMobile = caseData?.fieldExecutiveId?.mobile || "N/A";

    //supervisor data
    let superName =
      `${caseData?.supervisorId?.firstName} ${caseData?.supervisorId?.lastName}` ||
      "N/A";
    let superEmail = caseData?.supervisorId?.email || "N/A";
    let superMobile = caseData?.supervisorId?.mobile || "N/A";

    //auditor data
    let auditorName =
      `${caseData?.auditorId?.firstName} ${caseData?.auditorId?.lastName}` ||
      "N/A";
    let auditorEmail = caseData?.auditorId?.email || "N/A";
    let auditorMobile = caseData?.auditorId?.mobile || "N/A";

    // property details

    //roadPropertySubject
    let roadWidth = PropertyDetails?.roadPropertySubject?.roadWidth || "N/A";
    let roadWideningProposal =
      PropertyDetails?.roadPropertySubject?.roadWideningProposal || false;
    let primaryRoadType =
      PropertyDetails?.roadPropertySubject?.primaryRoadType || "N/A";
    let secondaryRoadType =
      PropertyDetails?.roadPropertySubject?.secondaryRoadType || "N/A";

    let buildingCracks = PropertyDetails?.buildingCracks || false;
    let identificationOfProperty =
      PropertyDetails?.identificationOfProperty || "N/A";
    let locationOfProperty = PropertyDetails?.locationOfProperty || "N/A";
    let typesOfLocality = PropertyDetails?.typesOfLocality || "N/A";
    let typesOfArea = PropertyDetails?.typesOfArea || "N/A";
    let neighbourhood = PropertyDetails?.neighbourhood || "N/A";
    let typesOfProperty = PropertyDetails?.typesOfProperty || "N/A";
    let currentUseOfProperty = PropertyDetails?.currentUseOfProperty || "N/A";
    let occupancyStatus = PropertyDetails?.occupancyStatus || "N/A";
    let relationWithLoanApplicant =
      PropertyDetails?.relationWithLoanApplicant || "N/A";

    let stageOfConstruction = PropertyDetails?.stageOfConstruction || "N/A";
    let yearOfConstruction = PropertyDetails?.yearOfConstruction || "N/A";
    let demarcationOfPlot = PropertyDetails?.demarcationOfPlot || "N/A";

    let electricityMeterNo = PropertyDetails?.electricityMeterNo || "N/A";
    let sewerageConnection = PropertyDetails?.sewerageConnection || false;

    // details of rent property
    let tenantName =
      PropertyDetails?.detailsOfRentedProperty?.nameOfTenant || "N/A";
    let tenantMobileNo =
      PropertyDetails?.detailsOfRentedProperty?.mobileNo || "N/A";
    let yearsOfTenancy =
      PropertyDetails?.detailsOfRentedProperty?.yearsOfTenancy || "N/A";
    let monthlyRent =
      PropertyDetails?.detailsOfRentedProperty?.monthlyRent || "N/A";

    let plotLength = PropertyDetails?.areaOfPlot.length || "N/A";
    let plotWidth = PropertyDetails?.areaOfPlot.width || "N/A";
    // Structure of building
    let numberOfFloors =
      PropertyDetails?.structureOfBuilding?.numberOfFloors || "N/A";
    let numberOfBasements =
      PropertyDetails?.structureOfBuilding?.numberOfBasements || "N/A";
    let heightOfCompleteBuilding =
      PropertyDetails?.structureOfBuilding?.heightOfCompleteBuilding || "N/A";
    let roofRights = PropertyDetails?.structureOfBuilding?.roofRights || "N/A";
    // Dweling units
    let numberOfUnitsAtStiltFloor =
      PropertyDetails?.dwellingUnits?.numberOfUnitsAtStiltFloor || "N/A";
    let numberOfUnitsPerFloor =
      PropertyDetails?.dwellingUnits?.numberOfUnitsPerFloor || "N/A";
    let totalUnits = PropertyDetails?.dwellingUnits?.totalUnits || "N/A";
    // ground floor details
    let useOfGroundFloor =
      PropertyDetails?.groundFloorDetails?.useOfGroundFloor || "N/A";
    let heightOfStiltFloor =
      PropertyDetails?.groundFloorDetails?.heightOfStiltFloor || "N/A";
    let areaOfParking =
      PropertyDetails?.groundFloorDetails?.areaOfParking || "N/A";

    let valueOfProperty = PropertyDetails?.valueOfProperty || "N/A";
    let remarks = PropertyDetails?.remarks || "N/A";

    let floorData =
      PropertyDetails?.details?.map((item) => ({
        floorName: item?.floorName || "N/A",
        accommodation: item?.accommodation || "N/A",
        builtupArea: item?.builtupArea || "N/A",
        projectionArea: item?.projectionArea || "N/A",
      })) || [];

    let images = PropertyDetails?.images;

    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=600x300&markers=color:red%7C${latitude},${longitude}&key=${GOOGLE_API_KEY}`;

    const response = await axios.get(mapUrl, { responseType: "arraybuffer" });
    const locationImage = response.data;

    const doc = new PDFDocument({ margin: 30 });
    const fileName = `Final_Report_${caseId}.pdf`;
    const filePath = `./${fileName}`;
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // Logo
    const leftMargin2 = 230;
    const topMargin2 = 0;

    doc.image(logoPath, leftMargin2, doc.y + topMargin2, {
      fit: [200, 75],
    });
    doc.moveDown();

    const topMargin = 60; // Adjust the margin as needed

    doc.y += topMargin;
    // Title
    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .text(`TECHNICAL APPRAISAL REPORT FOR ${bankName.toUpperCase()}`, {
        align: "center",
      })
      .moveDown();

    const leftMargin = 100;
    const topMargin3 = 30;
    doc.y += topMargin3;

    doc
      .font("Helvetica-Bold")
      .fontSize(8)
      .text(`Report No: ${caseData?.BOV_ReportNo}`, leftMargin, doc.y)
      .moveDown();
    doc
      .font("Helvetica-Bold")
      .fontSize(8)
      .text(`Ref No: ${caseData?.bankRefNo}`, leftMargin, doc.y)
      .moveDown();
    doc
      .font("Helvetica-Bold")
      .fontSize(8)
      .text(`Case: ${caseId}`, leftMargin, doc.y)
      .moveDown();

    const GeneralData = [
      ["Name of the Customer", clientName || "N/A"],
      ["Customer Number", contactNum || "N/A"],
      [
        "Date of Technical Visit",
        visitDate.toString().split("GMT")[0] || "N/A",
      ],
      ["Person(s) Met Name", personMetAtSite || "N/A"],
      ["Person(s) Met Mobile No.", personMetAtMobile || "N/A"],
      ["Longitude", longitude || "N/A"],
      ["Latitude", latitude || "N/A"],
    ];

    const addressDetails = [
      ["Address Line 1", addressLine1 || "N/A"],
      ["Address Line 2", addressLine2 || "N/A"],
      ["Plot", plot || "N/A"],
      ["Street", street || "N/A"],
      ["Landmark", landMark || "N/A"],
      ["City", city || "N/A"],
      ["Zone", zone || "N/A"],
      ["State", state || "N/A"],
      ["Pin Code", pinCode || "N/A"],
    ];

    const bankDetails = [
      ["Bank Name", bankName || "N/A"],
      ["Branch Name", branchName || "N/A"],
      ["IFSC Code", IFSCCode || "N/A"],
    ];

    const roadPropertyDetails = [
      ["Road Width", roadWidth || "N/A"],
      ["Primary Road Type", primaryRoadType || "N/A"],
      ["Secondary Road type", secondaryRoadType || "N/A"],
      ["IFSC Code", roadWideningProposal || "N/A"],
    ];

    const buildingStructureDetails = [
      ["Number Of Floors", numberOfFloors || "N/A"],
      ["Number Of Basements", numberOfBasements || "N/A"],
      ["Height Of Building", heightOfCompleteBuilding || "N/A"],
      ["Roof Right", roofRights || "N/A"],
    ];

    const dwelingDataDetails = [
      ["Number Of Units At Stilt Floor", numberOfUnitsAtStiltFloor || "N/A"],
      ["Number Of Units Per Floor", numberOfUnitsPerFloor || "N/A"],
      ["Total Units", totalUnits || "N/A"],
    ];

    const groundFloorDetails = [
      ["Use Of Ground Floor", useOfGroundFloor || "N/A"],
      ["Height Of Stilt Floor", heightOfStiltFloor || "N/A"],
      ["Area Of Parking", areaOfParking || "N/A"],
    ];

    const rentDataDetails = [
      ["Tenant Name", tenantName || "N/A"],
      ["Tenant Mobile No.", tenantMobileNo || "N/A"],
      ["Year of tenancy", yearsOfTenancy || "N/A"],
      ["Monthly Rent", monthlyRent || "N/A"],
    ];

    const plotAreaDetails = [
      ["Plot Length", plotLength || "N/A"],
      ["Plot Width", plotWidth || "N/A"],
    ];

    const remarksDetails = [["Remarks", remarks || "N/A"]];
    const valueOfPropertyDetails = [["Value", valueOfProperty || "N/A"]];

    const otherDetails = [
      ["Building Cracks", buildingCracks || "N/A"],
      ["Identification Of Property", identificationOfProperty || "N/A"],
      ["Location Of Property", locationOfProperty || "N/A"],
      ["Type Of Locality", typesOfLocality || "N/A"],
      ["Type Of Area", typesOfArea || "N/A"],
      ["Neighbourhood", neighbourhood || "N/A"],
      ["Type Of Property", typesOfProperty || "N/A"],
      ["Current Use Of Property", currentUseOfProperty || "N/A"],
      ["Occupancy Status", occupancyStatus || "N/A"],
      ["Relation with Loan Applicant", relationWithLoanApplicant || "N/A"],
      ["Stage Of Construction", stageOfConstruction || "N/A"],
      ["Year Of Construction", yearOfConstruction || "N/A"],
      ["Demarcation of plot", demarcationOfPlot || "N/A"],
      ["Electricity Meter No.", electricityMeterNo || "N/A"],
      ["Sewerage Connection", sewerageConnection || "N/A"],
    ];

    const coordinatorDetails = [
      ["Name", coName || "N/A"],
      ["Email", coEmail || "N/A"],
      ["Mobile Number", coMobile || "N/A"],
    ];
    const fieldExecutiveDetails = [
      ["Name", feName || "N/A"],
      ["Email", feEmail || "N/A"],
      ["Mobile Number", feMobile || "N/A"],
    ];
    const supervisorDetails = [
      ["Name", superName || "N/A"],
      ["Email", superEmail || "N/A"],
      ["Mobile Number", superMobile || "N/A"],
    ];
    const auditorDetails = [
      ["Name", auditorName || "N/A"],
      ["Email", auditorEmail || "N/A"],
      ["Mobile Number", auditorMobile || "N/A"],
    ];

    const leftPadding = 10;
    const tableWidth = 400;
    const pageWidth = doc.page.width;
    const startX = (pageWidth - tableWidth) / 2;
    let startY = doc.y + 10;

    const drawTable = (title, data) => {
      if (startY + data.length * 30 > doc.page.height - 100) {
        doc.addPage();
        startY = 50; // Reset startY for new page
      }

      // Draw Title
      doc.fontSize(12).font("Helvetica-Bold").text(title, startX, startY);
      startY += 15;

      // Draw Table
      data.forEach((row) => {
        let x = startX; // Start from the centered position
        row.forEach((cell) => {
          doc.rect(x, startY, tableWidth / 2, 30).stroke();
          doc
            .font("Helvetica")
            .fontSize(12)
            .text(cell, x + leftPadding, startY + 8, {
              width: tableWidth / 2 - leftPadding,
              align: "left",
            });
          x += tableWidth / 2;
        });
        startY += 30;
      });

      startY += 15; // Add spacing after the table
    };

    const drawRemarks = (title, remarks) => {
      if (startY + 50 > doc.page.height - 100) {
        doc.addPage();
        startY = 50;
      }

      doc.fontSize(12).font("Helvetica-Bold").text(title, startX, startY);
      startY += 20;

      const remarksWidth = tableWidth; // Full width
      const textHeight = doc.heightOfString(remarks, {
        width: remarksWidth - leftPadding,
        align: "left",
      });

      if (startY + textHeight > doc.page.height - 50) {
        doc.addPage();
        startY = 50;
      }

      doc.rect(startX, startY, remarksWidth, textHeight + 10).stroke();
      doc
        .font("Helvetica")
        .fontSize(12)
        .text(remarks, startX + leftPadding, startY + 5, {
          width: remarksWidth - leftPadding,
          align: "left",
        });

      startY += textHeight + 20;
    };

    const drawFloorTable = (title, data) => {
      if (startY + data.length * 30 > doc.page.height - 100) {
        doc.addPage();
        startY = 50;
      }

      doc.fontSize(12).font("Helvetica-Bold").text(title, startX, startY);
      startY += 15;

      const colWidth = tableWidth / 4;

      // Draw Table Header
      let x = startX;
      const headers = [
        "Floor Name",
        "Accommodation",
        "Built-Up Area",
        "Projection Area",
      ];
      headers.forEach((header) => {
        doc.rect(x, startY, colWidth, 30).stroke();
        doc
          // .font("Helvetica-Bold")
          .fontSize(10)
          .text(header, x + leftPadding, startY + 8, {
            width: colWidth - leftPadding,
            align: "left",
          });
        x += colWidth;
      });
      startY += 30;

      // Draw Table Rows
      data.forEach((row) => {
        let x = startX;
        const values = [
          row.floorName,
          row.accommodation,
          row.builtupArea.toString(),
          row.projectionArea.toString(),
        ];
        values.forEach((cell) => {
          doc.rect(x, startY, colWidth, 30).stroke();
          doc
            .font("Helvetica")
            .fontSize(12)
            .text(cell, x + leftPadding, startY + 8, {
              width: colWidth - leftPadding,
              align: "left",
            });
          x += colWidth;
        });
        startY += 30;
      });

      startY += 15;
    };

    // List of tables
    const tables = [
      { title: "1. General", data: GeneralData },
      { title: "2. Details of the Property", data: addressDetails },
      { title: "3. Bank details", data: bankDetails },
      { title: "4. Road property", data: roadPropertyDetails },
      { title: "5. Structure of building", data: buildingStructureDetails },
      { title: "6. Dwelling unit", data: dwelingDataDetails },
      { title: "7. Ground floor details", data: groundFloorDetails },
      { title: "8. Rent details", data: rentDataDetails },
      { title: "9. Plot area", data: plotAreaDetails },
      { title: "11. Value of property", data: valueOfPropertyDetails },
      { title: "13. Others", data: otherDetails },
      { title: "14. Coordinator details", data: coordinatorDetails },
      {
        title: "15. Engineer who visited the property",
        data: fieldExecutiveDetails,
      },
      { title: "16. Drafter details", data: supervisorDetails },
      { title: "17. Finalizer details", data: auditorDetails },
    ];

    // Render tables
    tables.forEach(({ title, data }) => {
      if (title === "11. Value of property") {
        drawRemarks("10. Remarks", remarksDetails);
      }
      drawTable(title, data);
      if (title === "11. Value of property") {
        drawFloorTable("12. Floor details", floorData);
      }
    });

    if (startY + 420 > doc.page.height - 50) {
      startY = 50;
    }

    const imageWidth = 200; // Reduced width
    const imageHeight = 120; // Reduced height
    const columnGap = 20; // Space between columns
    const rowGap = 30; // Space between rows

    let imageY = 50;

    if (images.length > 0) {
      doc.addPage();
      let imagesPerRow = 2; // Number of images per row
      let totalImageWidth =
        imagesPerRow * imageWidth + (imagesPerRow - 1) * columnGap;
      let startX = (doc.page.width - totalImageWidth) / 2; // Center images horizontally

      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("18. Property images", startX, imageY)
        .moveDown(0.5);

      imageY += 20; // Extra space after heading

      let imageX = startX;

      for (let i = 0; i < images.length; i++) {
        try {
          const response = await axios.get(images[i], {
            responseType: "arraybuffer",
          });
          const imageBuffer = Buffer.from(response.data, "binary");

          doc.image(imageBuffer, imageX, imageY, {
            width: imageWidth,
            height: imageHeight,
          });

          // Add Image Text BELOW the image
          doc
            .fontSize(12)
            .fillColor("black")
            .text(`Image ${i + 1}`, imageX, imageY + imageHeight + 5, {
              align: "center",
              width: imageWidth,
            });

          // Adjust X and Y positioning for next image
          if ((i + 1) % imagesPerRow === 0) {
            imageX = startX;
            imageY += imageHeight + rowGap + 20; // Space for text
          } else {
            imageX += imageWidth + columnGap;
          }

          // Check if we need a new page
          if (imageY + imageHeight > doc.page.height - 100) {
            doc.addPage();
            imageX = startX;
            imageY = 50;
          }
        } catch (error) {
          console.error(`Error adding image ${images[i]}:`, error.message);
        }
      }
    }

    // Extra space before "Location Map"
    imageY += 100;

    if (imageY + 350 > doc.page.height - 50) {
      doc.addPage();
      imageY = 80;
    }
    doc.moveDown(10);

    doc
    .fontSize(12)
    .font("Helvetica-Bold")
    .text("19. Location map", startX, imageY+60)
    .moveDown(2);

  doc.image(locationImage, startX, imageY + 80, {
    width: doc.page.width - 2 * startX,
  });

    doc.end();
    writeStream.on("finish", async () => {
      await sendEmailWithOrderSheet(email, filePath, fileName);
      res.status(200).json({ message: "PDF sent on email successfully" });
      fs.unlinkSync(filePath);
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};





module.exports = {sendFinalReportInPDF};

