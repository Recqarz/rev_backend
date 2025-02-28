const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ImageRun,
  AlignmentType,
} = require("docx");
const axios = require("axios");
const PropertyDetailsModel = require("../../models/propertyDetailsByFieldExecutiveModel");
const CaseModel = require("../../models/caseModel");

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

    let imageParagraphs = imageBuffers
      .filter((img) => img !== null) // Remove failed image requests
      .map(
        (img, index) =>
          new Paragraph({
            children: [
              new TextRun({ text: `Image ${index + 1}`, bold: true }),
              new ImageRun({
                data: img,
                transformation: { width: 200, height: 150 },
              }),
            ],
            spacing: { after: 300 },
          })
      );

    // **Table for General Information**
    const generalTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Name of the Customer")],
            }),
            new TableCell({ children: [new Paragraph(clientName)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Customer Number")],
            }),
            new TableCell({ children: [new Paragraph(contactNum)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Date of Technical Visit")],
            }),
            new TableCell({
              children: [new Paragraph(visitDate.toString().split("GMT")[0])],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Person(s) Met Name")] }),
            new TableCell({ children: [new Paragraph(personMetAtSite)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Person(s) Met Mobile No.")],
            }),
            new TableCell({
              children: [new Paragraph(personMetAtMobile.toString())],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Longitude")],
            }),
            new TableCell({ children: [new Paragraph(longitude.toString())] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Latitude")],
            }),
            new TableCell({ children: [new Paragraph(latitude.toString())] }),
          ],
        }),
      ],
    });

    // **Table for Property Details**
    const propertyTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Address1")] }),
            new TableCell({ children: [new Paragraph(addressLine1)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Address2")] }),
            new TableCell({ children: [new Paragraph(addressLine2)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Flat/House/Plot No.")] }),
            new TableCell({ children: [new Paragraph(plot.toString())] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Street")] }),
            new TableCell({ children: [new Paragraph(street)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Zone")] }),
            new TableCell({ children: [new Paragraph(zone)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("City")] }),
            new TableCell({ children: [new Paragraph(city)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Land Mark")] }),
            new TableCell({ children: [new Paragraph(landMark)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("State")] }),
            new TableCell({ children: [new Paragraph(state)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Pin Code")] }),
            new TableCell({ children: [new Paragraph(pinCode.toString())] }),
          ],
        }),
      ],
    });
    // bank details
    const bankTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Bank Name")] }),
            new TableCell({ children: [new Paragraph(bankName)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Branch Name")] }),
            new TableCell({ children: [new Paragraph(branchName)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("IFSC Code")] }),
            new TableCell({ children: [new Paragraph(IFSCCode)] }),
          ],
        }),
      ],
    });
    //roadPropertySubject
    const roadPropertyTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Road Width")] }),
            new TableCell({ children: [new Paragraph(roadWidth)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Primary Road Type")] }),
            new TableCell({ children: [new Paragraph(primaryRoadType)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Secondary Road Type")] }),
            new TableCell({ children: [new Paragraph(secondaryRoadType)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Roadwidening Proposal")],
            }),
            new TableCell({
              children: [new Paragraph(roadWideningProposal.toString())],
            }),
          ],
        }),
      ],
    });

    // Structure of building
    const structureBuidingTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Number of floors")] }),
            new TableCell({
              children: [new Paragraph(numberOfFloors.toString())],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Number of basement")] }),
            new TableCell({
              children: [new Paragraph(numberOfBasements.toString())],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Height of building")] }),
            new TableCell({
              children: [new Paragraph(heightOfCompleteBuilding.toString())],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Roof Right")],
            }),
            new TableCell({ children: [new Paragraph(roofRights.toString())] }),
          ],
        }),
      ],
    });

    //dwellingUnits
    const dwellingUnitsTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Number Of Units At Stilt Floor")],
            }),
            new TableCell({
              children: [new Paragraph(numberOfUnitsAtStiltFloor.toString())],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Number Of Units Per Floor")],
            }),
            new TableCell({
              children: [new Paragraph(numberOfUnitsPerFloor.toString())],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Total Units")] }),
            new TableCell({ children: [new Paragraph(totalUnits.toString())] }),
          ],
        }),
      ],
    });

    // ground floot details
    const groundFloorDetailsTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Use Of Ground Floor")] }),
            new TableCell({ children: [new Paragraph(useOfGroundFloor)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Height Of Stilt Floor")],
            }),
            new TableCell({
              children: [new Paragraph(heightOfStiltFloor.toString())],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Area Of Parking")] }),
            new TableCell({
              children: [new Paragraph(areaOfParking.toString())],
            }),
          ],
        }),
      ],
    });
    // details of rented properties
    const rentDetailsTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Tenant Name")] }),
            new TableCell({ children: [new Paragraph(tenantName)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Tenant Mobile No.")],
            }),
            new TableCell({
              children: [new Paragraph(tenantMobileNo.toString())],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Year of tenancy")] }),
            new TableCell({
              children: [new Paragraph(yearsOfTenancy.toString())],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Monthly Rent")] }),
            new TableCell({
              children: [new Paragraph(monthlyRent.toString())],
            }),
          ],
        }),
      ],
    });

    // plot area
    const plotAreaTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Plot Length")] }),
            new TableCell({ children: [new Paragraph(plotLength.toString())] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Plot Width")],
            }),
            new TableCell({ children: [new Paragraph(plotWidth.toString())] }),
          ],
        }),
      ],
    });

    // Coordinator Data
    const coordinatorDetailsTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Name")] }),
            new TableCell({ children: [new Paragraph(coName)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Email")] }),
            new TableCell({ children: [new Paragraph(coEmail)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Mobile Number")],
            }),
            new TableCell({ children: [new Paragraph(coMobile.toString())] }),
          ],
        }),
      ],
    });

    // FE Data
    const feDetailsTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Name")] }),
            new TableCell({ children: [new Paragraph(feName)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Email")] }),
            new TableCell({ children: [new Paragraph(feEmail)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Mobile Number")],
            }),
            new TableCell({ children: [new Paragraph(feMobile.toString())] }),
          ],
        }),
      ],
    });

    // SuperVisor Data
    const supervisorTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Name")] }),
            new TableCell({ children: [new Paragraph(superName)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Email")] }),
            new TableCell({ children: [new Paragraph(superEmail)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Mobile Number")],
            }),
            new TableCell({
              children: [new Paragraph(superMobile.toString())],
            }),
          ],
        }),
      ],
    });

    // Auditor Data
    const auditorTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Name")] }),
            new TableCell({ children: [new Paragraph(auditorName)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Email")] }),
            new TableCell({ children: [new Paragraph(auditorEmail)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Mobile Number")],
            }),
            new TableCell({
              children: [new Paragraph(auditorMobile.toString())],
            }),
          ],
        }),
      ],
    });

    // value and remarks
    const remarksTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Remarks")] }),
            new TableCell({ children: [new Paragraph(remarks)] }),
          ],
        }),
      ],
    });

    // value and remarks
    const valueTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Value Of Property")] }),
            new TableCell({
              children: [new Paragraph(valueOfProperty.toString())],
            }),
          ],
        }),
      ],
    });

    // Others
    const otherDataTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Building Cracks")] }),
            new TableCell({
              children: [new Paragraph(buildingCracks.toString())],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Identification Of Property")],
            }),
            new TableCell({
              children: [new Paragraph(identificationOfProperty)],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Location Of Property")],
            }),
            new TableCell({ children: [new Paragraph(locationOfProperty)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Type Of Locality")] }),
            new TableCell({ children: [new Paragraph(typesOfLocality)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Type Of Area")] }),
            new TableCell({ children: [new Paragraph(typesOfArea)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Neighboudhood")] }),
            new TableCell({ children: [new Paragraph(neighbourhood)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Type Of Property")] }),
            new TableCell({ children: [new Paragraph(typesOfProperty)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Current Use Of Property")],
            }),
            new TableCell({ children: [new Paragraph(currentUseOfProperty)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Occupancy Status")] }),
            new TableCell({ children: [new Paragraph(occupancyStatus)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Relation with Loan Applicant")],
            }),
            new TableCell({
              children: [new Paragraph(relationWithLoanApplicant)],
            }),
          ],
        }),

        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Stage Of Construction")],
            }),
            new TableCell({ children: [new Paragraph(stageOfConstruction)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Year Of Construction")],
            }),
            new TableCell({
              children: [new Paragraph(yearOfConstruction.toString())],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Demarcation of plot")] }),
            new TableCell({
              children: [new Paragraph(demarcationOfPlot.toString())],
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Elecgtricity Meter No.")],
            }),
            new TableCell({ children: [new Paragraph(electricityMeterNo)] }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph("Sewerage Connection")] }),
            new TableCell({
              children: [new Paragraph(sewerageConnection.toString())],
            }),
          ],
        }),
      ],
    });

    // **Table for Floor Details**
    const floorTable = new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph("Floor Name")],
              width: { size: 25, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [new Paragraph("Accommodation")],
              width: { size: 25, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [new Paragraph("Built-Up Area")],
              width: { size: 25, type: WidthType.PERCENTAGE },
            }),
            new TableCell({
              children: [new Paragraph("Projection Area")],
              width: { size: 25, type: WidthType.PERCENTAGE },
            }),
          ],
        }),
        ...floorData.map(
          (floor) =>
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph(floor.floorName)] }),
                new TableCell({
                  children: [new Paragraph(floor.accommodation)],
                }),
                new TableCell({
                  children: [new Paragraph(floor.builtupArea.toString())],
                }),
                new TableCell({
                  children: [new Paragraph(floor.projectionArea.toString())],
                }),
              ],
            })
        ),
      ],
    });

    // **Generating the document**
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              children: [
                new TextRun({ text: "Final Report", bold: true, size: 32 }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
            }),
            // new Paragraph({ children: [new TextRun({ text: `Ref No: KOTAK/${caseId}`, bold: true })] }),

            new Paragraph({ text: "" }), // Spacer
            new Paragraph({ text: "1. General", bold: true }),
            generalTable,
            new Paragraph({ text: "" }), // Spacer
            new Paragraph({ text: "2. Details of the Property", bold: true }),
            propertyTable,
            new Paragraph({ text: "" }), // Spacer
            new Paragraph({ text: "3. Bank Details", bold: true }),
            bankTable,
            new Paragraph({ text: "" }), // Spacer
            new Paragraph({ text: "4. Road Property", bold: true }),
            roadPropertyTable,

            new Paragraph({ text: "" }), // Spacer
            new Paragraph({ text: "5. Structure Of Building", bold: true }),
            structureBuidingTable,

            new Paragraph({ text: "" }), // Spacer
            new Paragraph({ text: "6. Dwelling Unit", bold: true }),
            dwellingUnitsTable,

            new Paragraph({ text: "" }), // Spacer
            new Paragraph({ text: "7. Ground Floor Details", bold: true }),
            groundFloorDetailsTable,

            new Paragraph({ text: "" }), // Spacer
            new Paragraph({ text: "8. Details of rent", bold: true }),
            rentDetailsTable,

            new Paragraph({ text: "" }), // Spacer
            new Paragraph({ text: "9. Plot Area", bold: true }),
            plotAreaTable,

            new Paragraph({ text: "" }), // Spacer
            new Paragraph({
              text: "10. Remarks Of Property",
              bold: true,
            }),
            remarksTable,

            new Paragraph({ number: "" }), // Spacer
            new Paragraph({
              text: "11. Value Of Property",
              bold: true,
            }),
            valueTable,

            new Paragraph({ text: "" }), // Spacer
            new Paragraph({ text: "12. Floor Details", bold: true }),
            floorTable,

            new Paragraph({ text: "" }), // Spacer
            new Paragraph({
              text: "13. Others",
              bold: true,
            }),
            otherDataTable,

            new Paragraph({ text: "" }), // Spacer
            new Paragraph({
              text: "14. Coordinator Details",
              bold: true,
            }),
            coordinatorDetailsTable,

            new Paragraph({ text: "" }), // Spacer
            new Paragraph({
              text: "15. Engineer who visited the property",
              bold: true,
            }),
            feDetailsTable,

            new Paragraph({ text: "" }), // Spacer
            new Paragraph({
              text: "16. Drafter details",
              bold: true,
            }),
            supervisorTable,

            new Paragraph({ text: "" }), // Spacer
            new Paragraph({
              text: "17. Finalizer details",
              bold: true,
            }),
            auditorTable,

            new Paragraph({
              text: "18. Images:",
              bold: true,
              spacing: { after: 100 },
            }),
            ...imageParagraphs,
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
