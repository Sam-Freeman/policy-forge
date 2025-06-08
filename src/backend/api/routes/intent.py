from fastapi import APIRouter, HTTPException
from backend.api.schemas import InitialIntent, EnrichedIntent

router = APIRouter(prefix="/intent", tags=["intent"])


@router.post("/submit")
def submit_intent(request: InitialIntent):
    try:
        # Build the enriched intent using the same format as IntentBuilder
        intent_text = f"""
Platform Type: {request.platform_type}
Industry: {request.industry}
Target Behavior: {request.user_behavior}
Real-World Concerns: {request.real_world_concerns}
Moderation Approach: {request.moderation_style}
Additional Context: {request.additional_context}

The goal is to write policies that effectively detect and moderate the above behavior, taking into account platform norms, user expectations, and the need for clear guidance and automation.
""".strip()

        # Create context dictionary with all relevant information
        context = {
            "platform_type": request.platform_type,
            "industry": request.industry,
            "user_behavior": request.user_behavior,
            "real_world_concerns": request.real_world_concerns,
            "moderation_style": request.moderation_style,
            "additional_context": request.additional_context,
        }

        # Extract key requirements from the input
        requirements = [
            f"Detect and moderate {request.user_behavior}",
            f"Consider {request.real_world_concerns}",
            f"Apply {request.moderation_style} moderation approach",
            f"Account for {request.platform_type} platform norms",
        ]

        enriched = EnrichedIntent(
            intent=intent_text, context=context, requirements=requirements
        )
        return enriched
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
