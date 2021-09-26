const createFile = require('./createFile');
const config = require('../../config');
const fs = require('fs');
const XLSX = require('xlsx');

async function convertToCsv(path) {
    const workbook = XLSX.readFile(path);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_csv(sheet);


    fs.writeFile(config.rootDir + '/unlimited/uploads/Expirations.csv', data, 'utf-8', (err) => {
        if (err) {
            console.error(err);
        }
        else {
            createFile(config.rootDir + '/unlimited/uploads/Expirations.csv');
        }
    });
}




module.exports = convertToCsv; 