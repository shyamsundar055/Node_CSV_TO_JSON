const fs = require('fs');
const path = require('path');
const uuidv1 = require('uuid/v1');
const readline = require('readline');

const convertCsvToJson = (inputFileName = 'customer-data.csv') => {

    if (inputFileName.length == 0) {
        console.log('Please enter a csv file name to convert');
        return;
    }

    console.log('\n\nchecking for file existance...');

    if (fs.existsSync('csvfiles\\' + inputFileName)) {

        console.log('---file found---');

        let dataInterface = readline.createInterface({
            input: fs.createReadStream('csvfiles\\' + inputFileName)
        }).on('error', (error) => {
            console.error("Error accessing file !")
        });


        let jsonKeys;
        let jsonKeyCount = 0,
            lineNumber = 0;
        let customerData = [];

        dataInterface.on('line', function (line) {
            lineNumber++;
            //console.log(lineNumber +':'+ line);
            if (lineNumber == 1) {
                console.log('File conversion under progress...');

                jsonKeys = line.split(',');
                jsonKeyCount = jsonKeys.length;
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

convertCsvToJson(process.argv[2]);