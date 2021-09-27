const fs = require('fs');
const config = require('../../config');
const aws = require('aws');

const upload = multer({storage});

aws.config.region = 'us-east-2';
const s3 = new aws.S3({
    'accessKeyId': process.env.S3_ACCESS_KEY_ID, 
    'secretAccessKey': process.env.S3_SECRET_ACCESS_KEY
}); 


function uploadFile(path){
    fs.readFile(path, (err, data)=>{
        const params = {
            key: 'Expirations.js', 
            bucket: process.env.S3_BUCKET, 
            body: data
        }; 

        s3.upload(params,(err, info)=>{
            if(err){
                throw err; 
            }
            console.log('success', info.Location);
        });
    });
}


function createFile(path){
    fs.readFile(path, 'utf-8', (err, data)=>{
        if(err){
            console.error(err); 
            throw new Error(); 
        }
        data = data.split(/\r?\n/); 
        while(data[0].split(',')[0].trim() !== 'Resource ID'){
            data.shift(); 
        }
        data.shift();
        let trailers = ''; 
        for(let row of data){
            trailers += row + '\n'; 
        }
        fs.writeFile(config.rootDir + '/static/unlimited/Expirations.js', "var expirations = `" + trailers  + "`;", 'utf-8', (err)=>{
            if(err){
                console.error(err);
                throw new Error();  
            }
            uploadFile(config.rootDir + '/static/unlimited/Expirations.js');
        }); 
    });

}



module.exports = createFile; 