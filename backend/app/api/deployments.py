from fastapi import APIRouter
from app.services.k8s_service import get_deployments
from app.schemas.deployment import ScaleDeploymentRequest
from app.services.k8s_service import scale_deployment
from app.schemas.restart import RestartDeploymentRequest
from app.services.k8s_service import restart_deployment


router = APIRouter()

@router.get("/deployments")
def list_deployments():
    return get_deployments()
@router.post("/deployments/scale")
def scale_deployment_api(request: ScaleDeploymentRequest):
    return scale_deployment(
        deployment_name=request.deployment_name,
        namespace=request.namespace,
        replicas=request.replicas
    )

@router.post("/deployments/restart")
def restart_deployment_api(request: RestartDeploymentRequest):
    return restart_deployment(
        deployment_name=request.deployment_name,
        namespace=request.namespace
    )