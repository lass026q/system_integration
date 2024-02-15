from fastapi import FastAPI
import requests
from requests import get

app = FastAPI()

@app.get("/fastapiData")
def server_data():
    return { "message": [1, 2, 3, 4, 5] }

@app.get("/requestExpress")
def get_express_data():
    
    response = requests.get('http://127.0.0.1:8080/expressData').json
    
    print(response.json)
        
    return {"data": response }