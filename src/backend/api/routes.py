from fastapi import APIRouter, HTTPException
from policy_forge import (
    policy_writer,
    example_gen,
    refiner,
)
from backend.api.schemas import (
    RefinementRequest,
    GenerateRequest,
    PolicyResponse,
    ExampleRequest,
    ExampleResponse,
)

router = APIRouter()


@router.get("/health")
def health_check():
    return {"status": "ok"}


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


@router.post("/examples")
def generate_synthetic_examples(request: ExampleRequest):
    try:
        examples = example_gen.generate_examples(request.policy)
        response = ExampleResponse(examples=examples)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/refine")
def refine(ref: RefinementRequest):
    try:
        refined_public, refined_moderator, refined_machine = refiner.refine_policies(
            ref.moderator, ref.machine, ref.examples
        )
        response = PolicyResponse(
            public=refined_public,
            moderator=refined_moderator,
            machine=refined_machine,
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
