const fs = require('fs');
const config = require('../../config');

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
        }); 
    });

}



module.exports = createFile; 