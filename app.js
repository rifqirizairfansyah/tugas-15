const express = require('express');
const bodyParser = require('body-parser');
const app = express()
const upload = require('./multer')
const cloudinary = require('./cloudinary')
const fs = require('fs');

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

app.use(
  '/create',
  async (req, res, next) => {
      upload.array(
        'image'
      )(req, res, (err) => {
          if (err) {
                  // SEND CAUGHT ERROR!
                  res.send(err)
              }
              else { next() }
          })
      },
      async (req, res) => {
          // do stuff here
      }
)

app.use('/upload-images',upload.array('image'), async (req, res) => {
  
  uploads(req, res, (err) => {
    console.log("masuk")
    if(err) {
      res.status(400).send("Something went wrong!");
    }
    console.log(req.files)

    res.send(req.file);
  });

  const uploader = async (path) => await cloudinary.uploads(path, 'DEV');

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

