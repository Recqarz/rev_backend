const multer = require("multer");
const fs = require("fs");
const path = require("path");
//** Multer Disk Storage */

// Define the upload directory
const uploadDir = path.join(__dirname, "../public/temp");

// Ensure the directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // console.log(file);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname + "-" + uniqueSuffix}_${file.originalname}`);
  },
});

// ** File Filter Function for Validation **
const fileFilter = (req, file, cb) => {
  // console.log("====file===>", file);
  const allowedTypes = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/svg+xml",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    cb(
      new Error("Invalid file type. Only PNG, JPG, and SVG are allowed."),
      false
    ); // Reject file
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 5 MB file size limit
  },
});

module.exports = { upload };
