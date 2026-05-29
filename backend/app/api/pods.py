from fastapi import APIRouter
from app.services.k8s_service import get_pods

print("PODS ROUTER LOADED")

router = APIRouter()

@router.get("/pods")
def list_pods():
    return get_pods()