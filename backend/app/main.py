from fastapi import FastAPI
from app.api.health import router as health_router
from app.api.pods import router as pods_router
from app.api.namespaces import router as namespaces_router
from app.api.deployments import router as deployments_router
from app.api.logs import router as logs_router
from app.api.events import router as events_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

print("CORS ENABLED")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(health_router)
app.include_router(pods_router)
app.include_router(namespaces_router)
app.include_router(deployments_router)
app.include_router(logs_router)
app.include_router(events_router)

@app.get("/")
def home():
    return {"message": "DevOps Command Center API"}