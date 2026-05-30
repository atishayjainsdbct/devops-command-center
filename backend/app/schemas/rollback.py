from pydantic import BaseModel

class RollbackRequest(BaseModel):
    deployment_name: str
    namespace: str