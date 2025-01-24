const multer = require("multer");



//** Multer Disk Storage */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/public/temp");
  },
  filename: function (req, file, cb) {
    // console.log(file);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname + "-" + uniqueSuffix}_${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// //** Multer Memory Storage */
// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// module.exports = upload;

//***************** */


module.exports = { upload };
