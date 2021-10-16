const fs = require('fs');
const config = require('../../config');
const aws = require('aws-sdk');


aws.config.region = 'us-east-2';
const s3 = new aws.S3({
    'accessKeyId': process.env.S3_ACCESS_KEY_ID,
    'secretAccessKey': process.env.S3_SECRET_ACCESS_KEY
});


function uploadFile(path) {
    fs.readFile(path, (err, data) => {
        const params = {
            Key: 'Expirations.js',
            Bucket: process.env.S3_BUCKET,
            Body: data
        };

        s3.upload(params, (err, info) => {
            if (err) {
                throw err;
            }
            console.log('success', info.Location);
        });
    });
}


function isOutOfService(trl) {
    trl = trl.slice(-4);
    if (trl[2].toUpperCase().trim() === 'OUT OF SERVICE') {
        return true;
    }
    else if (trl[3].trim().toUpperCase() === 'REQUIRED' && trl[1].trim().toUpperCase() === 'PRE') {
        return true;
    }
    return false;
}

function filterTrailers(data) {
    return data.reduce((a, b, i) => {
        if (i === 0 || !b || !b[0]) {
            return a;
        }
        b = b.split(',');
        if (!isOutOfService(b)) {
            return a;
        }
        else if (b.toUpperCase().includes('UL')) {
            b = b.slice(2);
        }
        else if (b.toUpperCase().includes('UCIQ')) {
            b = b.slice(3);
        }


        a.push(b);
        return a;
    }, []);
}

function createFile(path) {
    fs.readFile(path, 'utf-8', (err, data) => {
        if (err) {
            console.error(err);
            throw new Error();
        }

        // array of rows delimted by the new line
        data = data.split(/\r?\n/);

        // get rid of every empty row before the header
        while (data[0].split(',')[0].trim() !== 'Resource ID') {
            data.shift();
        }

        // get rid of the header row
        data.shift();

        data = filterTrailers(data);
        
        let trailers = '';
        for (let row of data) {
            trailers += row + '\n';
        }


        // write javascript code
        fs.writeFile(config.rootDir + '/static/unlimited/Expirations.js', "var expirations = `" + trailers + "`;", 'utf-8', (err) => {
            if (err) {
                console.error(err);
                throw new Error();
            }
            uploadFile(config.rootDir + '/static/unlimited/Expirations.js');
        });
    });

}






module.exports = createFile;