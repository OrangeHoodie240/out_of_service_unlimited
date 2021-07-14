const fs = require('fs'); 



let data = fs.readFileSync('Expirations.csv', 'utf-8'); 
data = data.split(/\r?\n/); 
while(data[0].split(',')[0].trim() !== 'Resource ID'){
    data.shift(); 
}
data.shift();
let trailers = ''; 
for(let row of data){
    trailers += row + '\n'; 
}

fs.writeFileSync('Expirations.js', "var expirations = `" + trailers  + "`;"); 

