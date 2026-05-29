from fastapi import APIRouter
from app.services.k8s_service import get_pod_logs

router = APIRouter()

@router.get("/logs/{pod_name}")
def logs(pod_name: str):
    return get_pod_logs(pod_name)