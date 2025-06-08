from pydantic import BaseModel
from typing import List, Optional
from policy_forge.schema import (
    ModeratorPolicy,
    MachinePolicy,
    SyntheticExample,
    PublicPolicy,
)


class InitialIntent(BaseModel):
    platform_type: str
    industry: str
    user_behavior: str
    real_world_concerns: str
    moderation_style: str
    additional_context: Optional[str] = None

class EnrichedIntent(BaseModel):
    intent: str
    context: dict
    requirements: List[str]

class MachinePolicyRequest(BaseModel):
    intent: str

class MachinePolicyResponse(BaseModel):
    machine: MachinePolicy

class RefinementRequest(BaseModel):
    machine: MachinePolicy
    reviewed_examples: List[SyntheticExample]

class DerivedPoliciesRequest(BaseModel):
    machine: MachinePolicy

class DerivedPoliciesResponse(BaseModel):
    public: PublicPolicy
    moderator: ModeratorPolicy

class ExampleRequest(BaseModel):
    policy: MachinePolicy

class ExampleResponse(BaseModel):
    examples: List[SyntheticExample]

class ReviewedExample(SyntheticExample):
    is_approved: bool
    feedback: Optional[str] = None

class ExamplesReviewRequest(BaseModel):
    examples: List[ReviewedExample]

# Keep these for backward compatibility
class GenerateRequest(BaseModel):
    intent: str

class PolicyResponse(BaseModel):
    public: PublicPolicy
    moderator: ModeratorPolicy
    machine: MachinePolicy

class PolicyPreviewResponse(BaseModel):
    markdown: str
    json: dict
