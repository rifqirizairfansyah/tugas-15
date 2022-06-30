const express = require('express');
const bodyParser = require('body-parser');
const app = express()
// const upload = require('./multer')
const cloudinary = require('./cloudinary')
const fs = require('fs');

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

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
    return cb(new Error('goes wrong on the mimetype'), false);
  }
}

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2048 * 2048
  },
  fileFilter: fileFilter
})

app.use('/upload-images', async (req, res) => {
  
  const uploads = upload.array('image')
  uploads(req, res, (err) => {
    console.log("masuk")
    if(err) {
      res.status(400).send("Something went wrong!");
    }
    console.log(req.files)

    res.send(req.file);
  });

  // const uploader = async (path) => await cloudinary.uploads(path, 'DEV');

  if (req.method === 'POST') {
  //   const urls = []
  //   const files = req.files;
  //   for (const file of files) {
  //     const { path } = file;
  //     const newPath = await uploader(path)
  //     urls.push(newPath)
  //     fs.unlinkSync(path)
  //   }

    res.status(200).json({
      message: 'images uploaded successfully',
      // data: urls
    })

  } else {
    res.status(405).json({
      err: `${req.method} method not allowed`
    })
  }
})

app.use('/upload-video', upload.array('video'), async (req, res) => {

  const uploader = async (path) => await cloudinary.uploadsVideo(path, 'DEV');

  if (req.method === 'POST') {
    const urls = []
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path)
      urls.push(newPath)
      fs.unlinkSync(path)
    }

    res.status(200).json({
      message: 'images uploaded successfully',
      data: urls
    })

  } else {
    res.status(405).json({
      err: `${req.method} method not allowed`
    })
  }
})

module.exports = app;

