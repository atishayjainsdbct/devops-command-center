from fastapi import APIRouter
from app.services.k8s_service import get_deployments

router = APIRouter()

@router.get("/deployments")
def list_deployments():
    return get_deployments()