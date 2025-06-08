from pydantic import BaseModel
from typing import List, Optional
from policy_forge.schema import (
    ModeratorPolicy,
    MachinePolicy,
    SyntheticExample,
    PublicPolicy,
)


class InitialIntent(BaseModel):
    platform: str
    goal: str
    industry: str
    additional_context: Optional[str] = None

class EnrichedIntent(BaseModel):
    intent: str
    context: dict
    requirements: List[str]

class RefinementRequest(BaseModel):
    moderator: ModeratorPolicy
    machine: MachinePolicy
    examples: List[SyntheticExample]

class ExampleRequest(BaseModel):
    policy: MachinePolicy

class ExampleResponse(BaseModel):
    examples: List[SyntheticExample]

class ReviewedExample(SyntheticExample):
    is_approved: bool
    feedback: Optional[str] = None

class ExamplesReviewRequest(BaseModel):
    examples: List[ReviewedExample]

class GenerateRequest(BaseModel):
    intent: str

class PolicyResponse(BaseModel):
    public: PublicPolicy
    moderator: ModeratorPolicy
    machine: MachinePolicy

class PolicyPreviewResponse(BaseModel):
    markdown: str
    json: dict
