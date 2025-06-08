from fastapi import FastAPI
from backend.api.routes import router as api_router

app = FastAPI(
    title="Policy Forge API",
    description="API for generating and refining content moderation policies",
    version="1.0.0"
)

app.include_router(api_router, prefix="/api")
