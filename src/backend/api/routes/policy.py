from fastapi import APIRouter, HTTPException
from policy_forge import policy_writer, refiner
from backend.api.schemas import (
    GenerateRequest,
    PolicyResponse,
    RefinementRequest,
    PolicyPreviewResponse,
    MachinePolicyResponse,
)

router = APIRouter(prefix="/policy", tags=["policy"])

@router.post("/generate/initial")
def generate_initial_policy(request: GenerateRequest):
    try:
        machine = policy_writer.generate_initial_policy(request.intent)
        response = MachinePolicyResponse(machine=machine)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate/derived")
def generate_derived_policies(request: MachinePolicyResponse):
    try:
        public, moderator = policy_writer.generate_derived_policies(request.machine)
        response = PolicyResponse(
            public=public,
            moderator=moderator,
            machine=request.machine,
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/refine")
def refine_policy(request: RefinementRequest):
    try:
        machine_refined = refiner.refine_machine_policy(request.machine, request.reviewed_examples)
        response = MachinePolicyResponse(machine=machine_refined)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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