from fastapi import FastAPI
from app.api.health import router as health_router
from app.api.pods import router as pods_router

print("MAIN FILE LOADED")

app = FastAPI()

app.include_router(health_router)
app.include_router(pods_router)

@app.get("/")
def home():
    return {"message": "DevOps Command Center API"}