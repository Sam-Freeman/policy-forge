from fastapi import APIRouter
from .health import router as health_router
from .intent import router as intent_router
from .policy import router as policy_router
from .examples import router as examples_router

# Create main router
router = APIRouter()

# Include all sub-routers
router.include_router(health_router)
router.include_router(intent_router)
router.include_router(policy_router)
router.include_router(examples_router) 