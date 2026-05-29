from fastapi import APIRouter

print("HEALTH ROUTER LOADED")

router = APIRouter()

@router.get("/health")
def health_check():
    return {"status": "healthy"}