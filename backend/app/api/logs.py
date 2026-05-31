from fastapi import APIRouter
from app.services.k8s_service import get_pod_logs

router = APIRouter()

@router.get("/logs/{namespace}/{pod_name}")
def logs(namespace: str, pod_name: str):
    return get_pod_logs(
        pod_name=pod_name,
        namespace=namespace
    )