import express from "express";

const app = express();

app.get("/requestFastAPI", async (req, res) => {
    
    const fastAPIServerUrl = 'http://localhost:8000';

    const response = await fetch(`${fastAPIServerUrl}/fastapiData`);

    const dataFromFastAPI = await response.json();

            
   //res.json(dataFromFastAPI);
    
    res.send({data: dataFromFastAPI});
});

app.get("/expressData"), (req, res) => {
    res.send ({message: "isRunning"})
}


const PORT = 8080;
app.listen(PORT, () => console.log("Server is running on port", PORT));