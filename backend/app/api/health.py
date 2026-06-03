from fastapi import APIRouter
from app.services.k8s_service import get_cluster_health

print("HEALTH ROUTER LOADED")

router = APIRouter()

@router.get("/health")
def health_check():
    return get_cluster_health()