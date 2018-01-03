const fs = require('fs');
const path = require('path');
const uuidv1 = require('uuid/v1');
const readline = require('readline');

const ConvertCsvToJson = (inputFileName = 'customer-data.csv') => {

    if (fs.existsSync('csvfiles\\' + inputFileName)) {

        let dataInterface = readline.createInterface({
            input: fs.createReadStream('csvfiles\\' + inputFileName)
        }).on('error', (error) => {
            console.error("Error reading file !")
        });

        let jsonKeys;
        let lineNumber = 0;
        let customerData = [];

        dataInterface.on('line', function (line) {
            lineNumber++;
            if (lineNumber == 1) {
                console.log('File conversion under progress...');
                jsonKeys = line.split(',');
            }
            if (lineNumber > 1) {
                let jsonValues = line.split(',');
                let valuePosition = 0;
                let buff = {}
                jsonKeys.forEach(element => {
                    buff[element] = jsonValues[valuePosition];
                    valuePosition++;
                });
                customerData.push(buff);
            }

        }).on('error', (error) => {
            console.error("Error reading file !")
        });

        dataInterface.on("close", () => {
            const fileName = uuidv1();
            let jsonData = JSON.stringify(customerData,null,2,{offset:4});
            fs.writeFileSync(path.join(__dirname, "jsonfiles", fileName + '.json'), jsonData);
            console.log("File converted successfully.\nfolder name: jsonfiles \nfile Name:" + fileName + '.json');
        });
    }
    else{
        console.log("File not found");
        return;
    }
}

ConvertCsvToJson(process.argv[2]);