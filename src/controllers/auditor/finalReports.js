const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  VerticalAlign,
  ImageRun,
  AlignmentType,
} = require("docx");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const PropertyDetailsModel = require("../../models/propertyDetailsByFieldExecutiveModel");
const CaseModel = require("../../models/caseModel");
require("dotenv").config();


const imagePath = path.join(__dirname, "../../utils/REV_logo.png");
const imageBuffer = fs.readFileSync(imagePath);

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

const getImageBuffer = async (url) => {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" });
    return response.data;
  } catch (error) {
    console.error("Error fetching image:", error);
    return null;
  }
};

const generateFinalReport = async (req, res) => {
  try {
    const { caseId } = req.params;
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

    const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=600x300&markers=color:red%7C${latitude},${longitude}&key=${GOOGLE_API_KEY}`;

    const response = await axios.get(mapUrl, { responseType: "arraybuffer" });
    const locationImage = response.data;

    //coordinator data
    let coName =
      `${caseData?.coordinatorId?.firstName}, ${caseData?.coordinatorId?.lastName}` ||
      "N/A";
    let coEmail = caseData?.coordinatorId?.email || "N/A";
    let coMobile = caseData?.coordinatorId?.mobile || "N/A";

    //fe data
    let feName =
      `${caseData?.fieldExecutiveId?.firstName}, ${caseData?.fieldExecutiveId?.lastName}` ||
      "N/A";
    let feEmail = caseData?.fieldExecutiveId?.email || "N/A";
    let feMobile = caseData?.fieldExecutiveId?.mobile || "N/A";

    //supervisor data
    let superName =
      `${caseData?.supervisorId?.firstName}, ${caseData?.supervisorId?.lastName}` ||
      "N/A";
    let superEmail = caseData?.supervisorId?.email || "N/A";
    let superMobile = caseData?.supervisorId?.mobile || "N/A";

    //auditor data
    let auditorName =
      `${caseData?.auditorId?.firstName}, ${caseData?.auditorId?.lastName}` ||
      "N/A";
    let auditorEmail = caseData?.auditorId?.email || "N/A";
    let auditorMobile = caseData?.auditorId?.mobile || "N/A";

    // property details
    let electricityMeterNo = PropertyDetails?.electricityMeterNo || "N/A";
    let sewerageConnection = PropertyDetails?.sewerageConnection || false;

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
    // details of rent property
    let tenantName =
      PropertyDetails?.detailsOfRentedProperty?.nameOfTenant || "N/A";
    let tenantMobileNo =
      PropertyDetails?.detailsOfRentedProperty?.mobileNo || "N/A";
    let yearsOfTenancy =
      PropertyDetails?.detailsOfRentedProperty?.yearsOfTenancy || "N/A";
    let monthlyRent =
      PropertyDetails?.detailsOfRentedProperty?.monthlyRent || "N/A";

    let stageOfConstruction = PropertyDetails?.stageOfConstruction || "N/A";
    let yearOfConstruction = PropertyDetails?.yearOfConstruction || "N/A";
    let demarcationOfPlot = PropertyDetails?.demarcationOfPlot || "N/A";

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
    // Fetch images as buffers
    const imageBuffers = await Promise.all(images.map(getImageBuffer));

    let imageRows = [];
    for (let i = 0; i < imageBuffers.length; i += 2) {
      let firstImage = imageBuffers[i]
        ? new TableCell({
            children: [
              new Paragraph({
                children: [
                  new ImageRun({
                    data: imageBuffers[i],
                    transformation: { width: 200, height: 150 },
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
              new Paragraph({
                children: [new TextRun({ text: `Image ${i + 1}`, bold: true })],
                alignment: AlignmentType.CENTER,
              }),
            ],
            margins: { top: 50, bottom: 50, left: 50, right: 50 },
          })
        : new TableCell({ children: [] });
    
      let secondImage = imageBuffers[i + 1]
        ? new TableCell({
            children: [
              new Paragraph({
                children: [
                  new ImageRun({
                    data: imageBuffers[i + 1],
                    transformation: { width: 200, height: 150 },
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
              new Paragraph({
                children: [new TextRun({ text: `Image ${i + 2}`, bold: true })],
                alignment: AlignmentType.CENTER,
              }),
            ],
            margins: { top: 50, bottom: 50, left: 50, right: 50 },
          })
        : new TableCell({ children: [] });
    
      imageRows.push(
        new TableRow({
          children: [firstImage, secondImage],
        })
      );
    }
    
    // Create the table
    const imageTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: imageRows,
    });
    

    const commonTableProperties = {
      width: { size: 100, type: WidthType.PERCENTAGE },
      columnWidths: [4500, 4500], // Fixed width for equal columns
    };

    const commonTableFloorDetails = {
      width: { size: 100, type: WidthType.PERCENTAGE },
      columnWidths: [2500, 2500, 2500, 2500], // Fixed width for equal columns
    };

    const commonCellProperties = {
      verticalAlign: VerticalAlign.CENTER,
      margins: { top: 100, bottom: 100, left: 100, right: 100 },
    };

    const createTableRow = (label, value) =>
      new TableRow({
        children: [
          new TableCell({
            ...commonCellProperties,
            width: { size: 50, type: WidthType.PERCENTAGE }, // Ensure equal width
            children: [
              new Paragraph({
                text: label,
                alignment: AlignmentType.LEFT,
              }),
            ],
          }),
          new TableCell({
            ...commonCellProperties,
            width: { size: 50, type: WidthType.PERCENTAGE }, // Ensure equal width
            children: [
              new Paragraph({
                text: value,
                alignment: AlignmentType.LEFT,
              }),
            ],
          }),
        ],
      });

    // **Table for General Information**
    const generalTable = new Table({
      ...commonTableProperties,
      rows: [
        createTableRow("Name of the Customer", clientName),
        createTableRow("Customer Number", contactNum),
        createTableRow(
          "Date of Technical Visit",
          visitDate.toString().split("GMT")[0]
        ),
        createTableRow("Person(s) Met Name", personMetAtSite),
        createTableRow(
          "Person(s) Met Mobile No.",
          personMetAtMobile.toString()
        ),
        createTableRow("Longitude", longitude.toString()),
        createTableRow("Latitude", latitude.toString()),
      ],
    });

    // **Table for Property Details**
    const propertyTable = new Table({
      ...commonTableProperties,
      rows: [
        createTableRow("Address1", addressLine1),
        createTableRow("Address2", addressLine2),
        createTableRow("Flat/House/Plot No.", plot.toString()),
        createTableRow("Street", street),
        createTableRow("Zone", zone),
        createTableRow("City", city),
        createTableRow("Land Mark", landMark),
        createTableRow("State", state),
        createTableRow("Pin Code", pinCode.toString()),
      ],
    });

    // bank details

    const bankTable = new Table({
      ...commonTableProperties, // Applying the same table properties
      rows: [
        createTableRow("Bank Name", bankName),
        createTableRow("Branch Name", branchName),
        createTableRow("IFSC Code", IFSCCode),
      ],
    });

    //roadPropertySubject
    const roadPropertyTable = new Table({
      ...commonTableProperties, // Applying the same table properties
      rows: [
        createTableRow("Road Width", roadWidth),
        createTableRow("Primary Road Type", primaryRoadType),
        createTableRow("Secondary Road Type", secondaryRoadType),
        createTableRow(
          "Roadwidening Proposal",
          roadWideningProposal.toString()
        ),
      ],
    });

    // Structure of building
    const structureBuidingTable = new Table({
      ...commonTableProperties, // Applying the same table properties
      rows: [
        createTableRow("Number of floors", numberOfFloors.toString()),
        createTableRow("Number of basement", numberOfBasements.toString()),
        createTableRow(
          "Height of building",
          heightOfCompleteBuilding.toString()
        ),
        createTableRow("Roof Right", roofRights.toString()),
      ],
    });

    //dwellingUnits
    const dwellingUnitsTable = new Table({
      ...commonTableProperties, // Applying the same table properties
      rows: [
        createTableRow(
          "Number Of Units At Stilt Floor",
          numberOfUnitsAtStiltFloor.toString()
        ),
        createTableRow(
          "Number Of Units Per Floor",
          numberOfUnitsPerFloor.toString()
        ),
        createTableRow("Total Units", totalUnits.toString()),
      ],
    });

    // ground floot details
    const groundFloorDetailsTable = new Table({
      ...commonTableProperties, // Applying the same table properties
      rows: [
        createTableRow("Use Of Ground Floor", useOfGroundFloor),
        createTableRow("Height Of Stilt Floor", heightOfStiltFloor.toString()),
        createTableRow("Area Of Parking", areaOfParking.toString()),
      ],
    });

    // details of rented properties
    const rentDetailsTable = new Table({
      ...commonTableProperties, // Applying the same table properties
      rows: [
        createTableRow("Tenant Name", tenantName),
        createTableRow("Tenant Mobile No.", tenantMobileNo.toString()),
        createTableRow("Year of tenancy", yearsOfTenancy.toString()),
        createTableRow("Monthly Rent", monthlyRent.toString()),
      ],
    });

    // plot area
    const plotAreaTable = new Table({
      ...commonTableProperties, // Applying the same table properties
      rows: [
        createTableRow("Plot Length", plotLength.toString()),
        createTableRow("Plot Width", plotWidth.toString()),
      ],
    });

    // Remarks Table
    const remarksTable = new Table({
      ...commonTableProperties, // Applying the same table properties
      rows: [
        new TableRow({
          children: [
            new TableCell({
              columnSpan: 2, // Make it span across both columns
              ...commonCellProperties,
              children: [
                new Paragraph({
                  text: remarks,
                  alignment: AlignmentType.LEFT, // Ensures left alignment
                }),
              ],
            }),
          ],
        }),
      ],
    });

    // Value Table
    const valueTable = new Table({
      ...commonTableProperties, // Applying the same table properties
      rows: [createTableRow("Value Of Property", valueOfProperty.toString())],
    });

    // **Table for Floor Details**
    const floorTable = new Table({
      ...commonTableFloorDetails,
      rows: [
        new TableRow({
          ...commonCellProperties,
          children: [
            new TableCell({
              children: [new Paragraph("Floor Name")],
              width: { size: 25, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              ...commonCellProperties,
              children: [new Paragraph("Accommodation")],
              width: { size: 25, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              ...commonCellProperties,
              children: [new Paragraph("Built-Up Area")],
              width: { size: 25, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              ...commonCellProperties,
              children: [new Paragraph("Projection Area")],
              width: { size: 25, type: WidthType.PERCENTAGE },
            }),
          ],
        }),
        ...floorData.map(
          (floor) =>
            new TableRow({
              children: [
                new TableCell({
                  ...commonCellProperties,
                  children: [new Paragraph(floor.floorName)],
                  width: { size: 25, type: WidthType.PERCENTAGE },
                }),
                new TableCell({
                  ...commonCellProperties,
                  children: [new Paragraph(floor.accommodation)],
                  width: { size: 25, type: WidthType.PERCENTAGE },
                }),
                new TableCell({
                  ...commonCellProperties,
                  children: [new Paragraph(floor.builtupArea.toString())],
                  width: { size: 25, type: WidthType.PERCENTAGE },
                }),
                new TableCell({
                  ...commonCellProperties,
                  children: [new Paragraph(floor.projectionArea.toString())],
                  width: { size: 25, type: WidthType.PERCENTAGE },
                }),
              ],
            })
        ),
      ],
    });

    // Others
    const otherDataTable = new Table({
      ...commonTableProperties, // Applying the same table properties
      rows: [
        createTableRow("Building Cracks", buildingCracks.toString()),
        createTableRow("Identification Of Property", identificationOfProperty),
        createTableRow("Location Of Property", locationOfProperty),
        createTableRow("Type Of Locality", typesOfLocality),
        createTableRow("Type Of Area", typesOfArea),
        createTableRow("Neighbourhood", neighbourhood),
        createTableRow("Type Of Property", typesOfProperty),
        createTableRow("Current Use Of Property", currentUseOfProperty),
        createTableRow("Occupancy Status", occupancyStatus),
        createTableRow(
          "Relation with Loan Applicant",
          relationWithLoanApplicant
        ),
        createTableRow("Stage Of Construction", stageOfConstruction),
        createTableRow("Year Of Construction", yearOfConstruction.toString()),
        createTableRow("Demarcation of plot", demarcationOfPlot.toString()),
        createTableRow("Electricity Meter No.", electricityMeterNo),
        createTableRow("Sewerage Connection", sewerageConnection.toString()),
      ],
    });

    // Coordinator Data
    const coordinatorDetailsTable = new Table({
      ...commonTableProperties, // Applying the same table properties
      rows: [
        createTableRow("Name", coName),
        createTableRow("Email", coEmail),
        createTableRow("Mobile Number", coMobile.toString()),
      ],
    });

    // FE Data
    const feDetailsTable = new Table({
      ...commonTableProperties, // Applying the same table properties
      rows: [
        createTableRow("Name", feName),
        createTableRow("Email", feEmail),
        createTableRow("Mobile Number", feMobile.toString()),
      ],
    });

    // SuperVisor Data
    const supervisorTable = new Table({
      ...commonTableProperties, // Applying the same table properties
      rows: [
        createTableRow("Name", superName),
        createTableRow("Email", superEmail),
        createTableRow("Mobile Number", superMobile.toString()),
      ],
    });

    // Auditor Data
    const auditorTable = new Table({
      ...commonTableProperties, // Applying the same table properties
      rows: [
        createTableRow("Name", auditorName),
        createTableRow("Email", auditorEmail),
        createTableRow("Mobile Number", auditorMobile.toString()),
      ],
    });

    // **Generating the document**
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new ImageRun({
                  data: imageBuffer,
                  transformation: { width: 200, height: 75 }, // Adjust size as needed
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 20 }, // Space between image and text
            }),

            new Paragraph({
              children: [
                new TextRun({ text: "Final Report", bold: true, size: 40 }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
            }),
           
            new Paragraph({
              children: [new TextRun({ text: `Ref No: ${caseData?.bankRefNo}`, bold: true })],
              spacing: { before: 1000, after: 150 }, // Adds margin below the paragraph
              alignment: AlignmentType.LEFT, // Aligns text to the left
            }),
            new Paragraph({
              children: [new TextRun({ text: `Report No: ${caseData?.BOV_ReportNo}`, bold: true })],
              spacing: { after: 150 },
              alignment: AlignmentType.LEFT,
            }),
            new Paragraph({
              children: [new TextRun({ text: `Case: ${caseId}`, bold: true })],
              spacing: { after: 150 },
              alignment: AlignmentType.LEFT,
            }),

            new Paragraph({ text: "" }), // Spacer
            new Paragraph({
              children: [
                new TextRun({ text: "1. General", bold: true, size: 24 }),
              ],
              spacing: { before: 100, after: 100 }, // Add space before and after
              alignment: AlignmentType.LEFT,
            }),
            generalTable,

            new Paragraph({ text: "" }), // Spacer
            new Paragraph({
              children: [
                new TextRun({
                  text: "2. Details of the Property",
                  bold: true,
                  size: 24,
                }),
              ],
              spacing: { before: 100, after: 100 }, // Add space before and after
              alignment: AlignmentType.LEFT,
            }),
            propertyTable,

            new Paragraph({ text: "" }), // Spacer
            new Paragraph({
              children: [
                new TextRun({ text: "3. Bank Details", bold: true, size: 24 }),
              ],
              spacing: { before: 100, after: 100 }, // Add space before and after
              alignment: AlignmentType.LEFT,
            }),
            bankTable,
            new Paragraph({ text: "" }), // Spacer
            new Paragraph({
              children: [
                new TextRun({ text: "4. Road Property", bold: true, size: 24 }),
              ],
              spacing: { before: 100, after: 100 }, // Add space before and after
              alignment: AlignmentType.LEFT,
            }),
            roadPropertyTable,

            new Paragraph({ text: "" }), // Spacer
            new Paragraph({
              children: [
                new TextRun({
                  text: "5. Structure Of Building",
                  bold: true,
                  size: 24,
                }),
              ],
              spacing: { before: 100, after: 100 }, // Add space before and after
              alignment: AlignmentType.LEFT,
            }),
            structureBuidingTable,

            new Paragraph({ text: "" }), // Spacer
            new Paragraph({
              children: [
                new TextRun({ text: "6. Dwelling Unit", bold: true, size: 24 }),
              ],
              spacing: { before: 100, after: 100 }, // Add space before and after
              alignment: AlignmentType.LEFT,
            }),
            dwellingUnitsTable,

            new Paragraph({ text: "" }), // Spacer
            new Paragraph({
              children: [
                new TextRun({
                  text: "7. Ground Floor Details",
                  bold: true,
                  size: 24,
                }),
              ],
              spacing: { before: 100, after: 100 }, // Add space before and after
              alignment: AlignmentType.LEFT,
            }),
            groundFloorDetailsTable,

            new Paragraph({ text: "" }), // Spacer
            new Paragraph({
              children: [
                new TextRun({
                  text: "8. Rent Details",
                  bold: true,
                  size: 24,
                }),
              ],
              spacing: { before: 100, after: 100 }, // Add space before and after
              alignment: AlignmentType.LEFT,
            }),
            rentDetailsTable,

            new Paragraph({ text: "" }), // Spacer
            new Paragraph({
              children: [
                new TextRun({ text: "9. Plot Area", bold: true, size: 24 }),
              ],
              spacing: { before: 100, after: 100 }, // Add space before and after
              alignment: AlignmentType.LEFT,
            }),
            plotAreaTable,

            new Paragraph({ text: "" }), // Spacer
            new Paragraph({
              children: [
                new TextRun({
                  text: "10. Remarks",
                  bold: true,
                  size: 24,
                }),
              ],
              spacing: { before: 100, after: 100 }, // Add space before and after
              alignment: AlignmentType.LEFT,
            }),
            remarksTable,

            new Paragraph({ number: "" }), // Spacer
            new Paragraph({
              children: [
                new TextRun({
                  text: "11. Value Of Property",
                  bold: true,
                  size: 24,
                }),
              ],
              spacing: { before: 100, after: 100 }, // Add space before and after
              alignment: AlignmentType.LEFT,
            }),
            valueTable,

            new Paragraph({ text: "" }), // Spacer
            new Paragraph({
              children: [
                new TextRun({
                  text: "12. Floor Details",
                  bold: true,
                  size: 24,
                }),
              ],
              spacing: { before: 100, after: 100 }, // Add space before and after
              alignment: AlignmentType.LEFT,
            }),
            floorTable,

            new Paragraph({ text: "" }), // Spacer
            new Paragraph({
              children: [
                new TextRun({ text: "13. Others", bold: true, size: 24 }),
              ],
              spacing: { before: 100, after: 100 }, // Add space before and after
              alignment: AlignmentType.LEFT,
            }),
            otherDataTable,

            new Paragraph({ text: "" }), // Spacer
            new Paragraph({
              children: [
                new TextRun({
                  text: "14. Coordinator Details",
                  bold: true,
                  size: 24,
                }),
              ],
              spacing: { before: 100, after: 100 }, // Add space before and after
              alignment: AlignmentType.LEFT,
            }),
            coordinatorDetailsTable,

            new Paragraph({ text: "" }), // Spacer
            new Paragraph({
              children: [
                new TextRun({
                  text: "15. Engineer who visited the property",
                  bold: true,
                  size: 24,
                }),
              ],
              spacing: { before: 100, after: 100 }, // Add space before and after
              alignment: AlignmentType.LEFT,
            }),
            feDetailsTable,

            new Paragraph({ text: "" }), // Spacer
            new Paragraph({
              children: [
                new TextRun({
                  text: "16. Drafter details",
                  bold: true,
                  size: 24,
                }),
              ],
              spacing: { before: 100, after: 100 }, // Add space before and after
              alignment: AlignmentType.LEFT,
            }),
            supervisorTable,

            new Paragraph({ text: "" }), // Spacer
            new Paragraph({
              children: [
                new TextRun({
                  text: "17. Finalizer details",
                  bold: true,
                  size: 24,
                }),
              ],
              spacing: { before: 100, after: 100 }, // Add space before and after
              alignment: AlignmentType.LEFT,
            }),
            auditorTable,

            new Paragraph({
              children: [
                new TextRun({
                  text: "18. Property Images",
                  bold: true,
                  size: 24,
                }),
              ],
              spacing: { before: 100, after: 100, top: 200 }, // Add space before and after
              alignment: AlignmentType.LEFT,
            }),
            imageTable,

            new Paragraph({ text: "" }), // Spacer
            new Paragraph({
              children: [
                new TextRun({
                  text: "19. Location Map",
                  bold: true,
                  size: 24,
                }),
              ],
              spacing: { before: 100, after: 100 },
              alignment: AlignmentType.LEFT,
            }),
            new Paragraph({
              children: [
                new ImageRun({
                  data: locationImage,
                  transformation: { width: 600, height: 300 },
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `${clientGeoFormattedAddress}`,
                  italics: true,
                }),
              ],
              alignment: AlignmentType.CENTER,
            }),
          ],
        },
      ],
    });

    // Convert document to buffer
    const buffer = await Packer.toBuffer(doc);
    // Set headers for download
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="technical_report.docx"'
    );

    // Send the generated file
    res.send(buffer);
  } catch (error) {
    console.error("Error generating report:", error);
    res.status(500).send("Failed to generate report");
  }
};

module.exports = { generateFinalReport };
