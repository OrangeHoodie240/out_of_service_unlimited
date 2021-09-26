const express = require('express');
const router = new express.Router(); 
const path = require("path");
const createFile = require('../helpers/createFile');
const convertToCsv = require('../helpers/convertToCsv');
const config = require('../../config');

const multer = require('multer');

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