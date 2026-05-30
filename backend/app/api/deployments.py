from fastapi import APIRouter
from app.services.k8s_service import get_deployments
from app.schemas.deployment import ScaleDeploymentRequest
from app.services.k8s_service import scale_deployment
from app.schemas.restart import RestartDeploymentRequest
from app.services.k8s_service import restart_deployment
from app.services.k8s_service import get_deployment_details
from app.services.k8s_service import get_rollout_status
from app.services.k8s_service import get_deployment_history
from app.schemas.rollback import RollbackRequest
from app.services.k8s_service import rollback_deployment

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

@router.get("/deployments/{deployment_name}")
def deployment_details(deployment_name: str):
    return get_deployment_details(deployment_name)

@router.get("/deployments/{deployment_name}/rollout-status")
def rollout_status(deployment_name: str):
    return get_rollout_status(deployment_name)

@router.get("/deployments/{deployment_name}/history")
def deployment_history(deployment_name: str):
    return get_deployment_history(deployment_name)

@router.post("/deployments/rollback")
def rollback_api(request: RollbackRequest):

    return rollback_deployment(
        deployment_name=request.deployment_name,
        namespace=request.namespace
    )