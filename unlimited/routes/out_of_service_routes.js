const express = require('express');
const router = new express.Router(); 
const path = require("path");
const createFile = require('../helpers/createFile');
const convertToCsv = require('../helpers/convertToCsv');
const config = require('../../config');
const multer = require('multer');
const aws = require('aws');

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, config.rootDir + '/unlimited/uploads');
    },
    filename: (req, file, cb)=>{
        let extension = '.csv'; 
        if(!file.originalname.includes('.csv')) extension = '.xlsx';
        cb(null, 'Expirations' + extension); 
    }
});

const upload = multer({storage});

aws.config.region = 'us-east-2';
const s3 = new aws.S3({
    'accessKeyId': process.env.S3_ACCESS_KEY_ID, 
    'secretAccessKey': process.env.S3_SECRET_ACCESS_KEY
}); 


router.get('/', (req, res, next) => {
    return res.sendFile(path.join(config.rootDir,'./static/unlimited','index.html'));
});

router.get('/submit', (req, res, next) => {
    return res.sendFile(path.join(config.rootDir, './static/unlimited', 'submit.html'));
});


router.post('/', upload.single('myFile'), async (req, res, next) => {
    if(req.file.originalname.includes('.csv')){
        createFile(req.file.path);
    }
    else{
        convertToCsv(req.file.path);
    }
    return res.json({sucess:true});
});






module.exports = router; 