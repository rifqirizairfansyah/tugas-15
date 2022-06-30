const express = require('express')
const multer = require('multer');

const app = express();
const cloudinary = require('./cloudinary')
const fs = require('fs');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2048 * 2048 * 5
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype === "video/mp4" || file.mimetype === "application/pdf" || file.mimetype === "application/msword") {
            cb(null, true);
        } else {
            return cb(new Error('Invalid mime type'));
        }
    }
});

const uploadSingleImage = upload.single('file');

app.post('/upload', async function (req, res) {

    uploadSingleImage(req, res, async function (err) {

        if (err) {
            return res.status(400).send({ message: err.message })
        }

        // Everything went fine.
        const file = req.file;
        
        const uploader = async (path) => await cloudinary.uploads(path, 'DEV');
        const onlinePath = await uploader(file.path)
        fs.unlinkSync(file.path)

        res.status(200).send({
            online_path: onlinePath, 
            path: file.path,
            filename: file.filename,
            mimetype: file.mimetype,
            originalname: file.originalname,
            size: file.size,
            fieldname: file.fieldname
        })
    })
})

app.listen(5002, () => {
    console.log("Server is listening on port: 5002");
});