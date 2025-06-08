from fastapi import APIRouter, HTTPException
from policy_forge import policy_writer, refiner
from backend.api.schemas import (
    GenerateRequest,
    PolicyResponse,
    RefinementRequest,
    PolicyPreviewResponse,
)

router = APIRouter(prefix="/policy", tags=["policy"])

@router.post("/generate")
def generate_policies(request: GenerateRequest):
    try:
        public, moderator, machine = policy_writer.generate_policy(request.intent)
        response = PolicyResponse(
            public=public,
            moderator=moderator,
            machine=machine,
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/refine")
def refine(ref: RefinementRequest):
    try:
        refined_public, refined_moderator, refined_machine = refiner.refine_policies(
            ref.public, ref.moderator, ref.machine, ref.examples
        )
        response = PolicyResponse(
            public=refined_public,
            moderator=refined_moderator,
            machine=refined_machine,
        )
        return response
    except Exception as e:
        print("Error refining policies: ", e)
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/preview")
def preview_policies():
    try:
        # TODO: Implement policy preview generation logic
        preview = PolicyPreviewResponse(
            markdown="# Policy Preview\n\nThis is a sample markdown preview",
            json={"sample": "json preview"}
        )
        return preview
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 