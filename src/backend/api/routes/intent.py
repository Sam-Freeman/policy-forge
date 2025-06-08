from fastapi import APIRouter, HTTPException
from backend.api.schemas import InitialIntent, EnrichedIntent

router = APIRouter(prefix="/intent", tags=["intent"])

@router.post("/submit")
def submit_intent(request: InitialIntent):
    try:
        # TODO: Implement intent enrichment logic
        enriched = EnrichedIntent(
            intent=f"Create a policy for {request.platform} in {request.industry} to achieve {request.goal}",
            context={"platform": request.platform, "industry": request.industry},
            requirements=[request.goal]
        )
        return enriched
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 