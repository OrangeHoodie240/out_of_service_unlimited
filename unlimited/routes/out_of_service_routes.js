const express = require('express');
const router = new express.Router();
const path = require("path");
const createFile = require('../helpers/createFile');
const convertToCsv = require('../helpers/convertToCsv');
const config = require('../../config');
const multer = require('multer');
const fs = require('fs');

const aws = require('aws-sdk');
aws.config.region = 'us-east-2';
const s3 = new aws.S3({
    'accessKeyId': process.env.S3_ACCESS_KEY_ID,
    'secretAccessKey': process.env.S3_SECRET_ACCESS_KEY
});


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.rootDir + '/unlimited/uploads');
    },
    filename: (req, file, cb) => {
        let extension = '.csv';
        if (!file.originalname.includes('.csv')) extension = '.xlsx';
        cb(null, 'Expirations' + extension);
    }
});
const upload = multer({ storage });

router.get('/', (req, res, next) => {
    // if(!fs.existsSync(config.rootDir + '/static/unlimited/Expirations.js')){
    const params = {
        Bucket: process.env.S3_BUCKET,
        Key: 'Expirations.js'
    };
        
        s3.getObject(params, (err, data) => {
            fs.writeFile(config.rootDir + '/static/unlimited/Expirations.js', data.Body.toString('utf-8'), (err => {
                if (err) {
                    throw err;
                }
            }));
        });
    // }
    return res.sendFile(path.join(config.rootDir, './static/unlimited', 'index.html'));
});

router.get('/submit', (req, res, next) => {
    return res.sendFile(path.join(config.rootDir, './static/unlimited', 'submit.html'));
});


router.post('/', upload.single('myFile'), async (req, res, next) => {
    if (req.file.originalname.includes('.csv')) {
        createFile(req.file.path);
    }
    else {
        convertToCsv(req.file.path);
    }
    return res.json({ sucess: true });
});






module.exports = router;