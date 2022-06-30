const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  }
})


const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === "video/mp4") {
    cb(null, true)
  } else {
    //reject file
    console.log("tidak diterima");
    req.fileValidationError = 'goes wrong on the mimetype';
    return cb(null, false, new Error('goes wrong on the mimetype'));
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2048 * 2048
  },
  fileFilter: fileFilter
})

module.exports = upload;