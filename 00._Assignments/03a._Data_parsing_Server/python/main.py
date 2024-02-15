from fastapi import FastAPI
import requests
from requests import get
import os

app = FastAPI()


data_samples = {
    "xml": "data.xml",
    "csv": "data.csv",
    "yaml": "data.yaml",
    "txt": "data.txt",
    "json": "data.json"
}


@app.get("/getData/{data_type}")
def get_data(data_type: str):
    
        
        if data_type not in data_samples:
            raise HTTPException(status_code=400, detail="Unsupported data type")
        
        file_name = data_samples[data_type]
        
        file_path = os.path.join(os.path.dirname(__file__), file_name)
        with open(file_path, "r", encoding="utf-8") as file:
            data = file.read()
        
        return {"data": data}
    


@app.get("/getFromServerA/{data_type}")
def get_data_from_server_a(data_type: str):
  
        server_a_url = 'http://localhost:8080'
        
        response = requests.get(f"{server_a_url}/getLocalData/{data_type}")
        
        response.raise_for_status()
        
        data_from_server_a = response.json()
        
        return {"data": data_from_server_a}

    