from pydantic import BaseModel

class RestartDeploymentRequest(BaseModel):
    deployment_name: str
    namespace: str