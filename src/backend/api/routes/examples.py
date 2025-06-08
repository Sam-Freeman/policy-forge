from fastapi import APIRouter, HTTPException
from policy_forge import example_gen
from backend.api.schemas import (
    ExampleRequest,
    ExampleResponse,
    ExamplesReviewRequest,
)

router = APIRouter(prefix="/examples", tags=["examples"])

@router.post("/generate")
def generate_synthetic_examples(request: ExampleRequest):
    try:
        examples = example_gen.generate_examples(request.policy)
        response = ExampleResponse(examples=examples)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/review")
def review_examples(request: ExamplesReviewRequest):
    try:
        # TODO: Implement example review processing logic
        return {"status": "success", "message": f"Processed {len(request.examples)} reviewed examples"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 