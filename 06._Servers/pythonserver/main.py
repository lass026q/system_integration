from fastapi import FastAPI

app= FastAPI()

@app.get("/")
def root():
    return {"message: Welcome to our first server."}

@app.get("/message")
def root():
    return {"messageeee"}