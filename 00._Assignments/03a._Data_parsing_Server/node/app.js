import express from "express";
import fs from "fs/promises"; 
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const serverBUrl = 'http://localhost:8000';

const dataSamples = {
    "xml": "data.xml",
    "csv": "data.csv",
    "yaml": "data.yaml",
    "txt": "data.txt",
    "json": "data.json"
};


app.get("/getLocalData/:dataType", async (req, res) => {
        const dataType = req.params.dataType;

        if (!(dataType in dataSamples)) {
            res.status(400).json({ error: "Unsupported data type" });
            return;
        }
        const fileName = dataSamples[dataType];
        const filePath = path.join(__dirname, fileName);

        const dataFromLocalFile = await fs.readFile(filePath, "utf-8");

        console.log(`Sending data from Server A for ${dataType}`);
        res.json({ data: dataFromLocalFile });
    
});

app.get("/getFromServerB/:dataType", async (req, res) => {
   
        const dataType = req.params.dataType;

        const response = await fetch(`${serverBUrl}/getData/${dataType}`);
        
        if (!response.ok) {
            throw new Error(`Error fetching data from Server B: ${response.statusText}`);
        }
        const dataFromServerB = await response.text();
        
        res.json({ data: dataFromServerB });
    
});

const PORT = 8080;
app.listen(PORT, () => console.log("Server A is running on port", PORT));
