from fastapi import APIRouter
from app.services.k8s_service import get_pods
from typing import Optional
from app.services.k8s_service import delete_pod

print("PODS ROUTER LOADED")

router = APIRouter()


@router.get("/pods")
def list_pods(namespace: Optional[str] = None):
    return get_pods(namespace)

@router.delete("/pods/{pod_name}")
def delete_pod_api(pod_name: str):
    return delete_pod(pod_name)