const cloudinary = require('cloudinary');
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
  cloud_name: 'dfexqsxvh',
  api_key: '671778718739459',
  api_secret: '_R8-5uEnB7euHeO71XrWBUN5CnM'
})

exports.uploads = (file, folder) => {
  return new Promise(resolve => {
    cloudinary.uploader.upload(file, (result) => {
      resolve({
        url: result.url,
        id: result.public_id
      })
    }, {
      resource_type: "auto",
      folder: folder
    })
  })
}

exports.uploadsVideo = (file, folder) => {
  return new Promise(resolve => {
    cloudinary.uploader.upload(file, (result) => {
      resolve({
        url: result.url,
        id: result.public_id
      })
    }, {
      resource_type: "video",
      folder: folder,
      chunk_size: 6000000,
    eager: [
      { width: 300, height: 300, crop: "pad", audio_codec: "none" }, 
      { width: 160, height: 100, crop: "crop", gravity: "south", audio_codec: "none" } ],                                   
    eager_async: true
    })
  })
}


