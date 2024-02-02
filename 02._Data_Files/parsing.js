const fs = require('fs');
const xml2js = require('xml2js');
const yaml = require('js-yaml');
const csv = require('csv-parser');
const readline = require('readline');

const xmlFile = 'me.xml';
const jsonFile = 'me.json';
const yamlFile = 'me.yaml';
const csvFile = 'me.csv';
const textFile = 'me.txt';

function readAndParseText(textFile) {
    const textContent = fs.readFileSync(textFile, 'utf-8');
    console.log("Text content:");
    console.log(textContent);
}

function readAndParseXML(xmlFile) {
    const xmlContent = fs.readFileSync(xmlFile, 'utf-8');
    xml2js.parseString(xmlContent, (err, result) => {
        console.log("XML content:");
        console.log(result);
    });
}

function readAndParseYAML(yamlFile) {
    const yamlContent = yaml.safeLoad(fs.readFileSync(yamlFile, 'utf-8'));
    console.log("YAML content:");
    console.log(yamlContent);
}

function readAndParseJSON(jsonFile) {
    const jsonContent = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));
    console.log("JSON content:");
    console.log(jsonContent);
}

function readAndParseCSV(csvFile) {
    const csvContent = [];
    fs.createReadStream(csvFile)
        .pipe(csv())
        .on('data', (row) => {
            csvContent.push(row);
        })
        .on('end', () => {
            console.log("CSV content:");
            console.log(csvContent);
        });
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("Choose a function to run:");
console.log("1. Read and Parse Text");
console.log("2. Read and Parse XML");
console.log("3. Read and Parse YAML");
console.log("4. Read and Parse JSON");
console.log("5. Read and Parse CSV");

rl.question("Enter the number of your choice (1-5): ", (choice) => {
    if (!['1', '2', '3', '4', '5'].includes(choice)) {
        console.log("Invalid choice. Exiting.");
        rl.close();
    }

    if (choice === '1') {
        readAndParseText(textFile);
    } else if (choice === '2') {
        readAndParseXML(xmlFile);
    } else if (choice === '3') {
        readAndParseYAML(yamlFile);
    } else if (choice === '4') {
        readAndParseJSON(jsonFile);
    } else if (choice === '5') {
        readAndParseCSV(csvFile);
    }

    rl.close();
});
