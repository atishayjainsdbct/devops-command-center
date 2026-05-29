from pydantic import BaseModel

class ScaleDeploymentRequest(BaseModel):
    deployment_name: str
    namespace: str
    replicas: int