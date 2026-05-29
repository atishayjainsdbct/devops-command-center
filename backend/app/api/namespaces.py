from fastapi import APIRouter
from app.services.k8s_service import get_namespaces

router = APIRouter()

@router.get("/namespaces")
def list_namespaces():
    return get_namespaces()