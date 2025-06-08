from pydantic import BaseModel
from typing import List
from policy_forge.schema import (
    ModeratorPolicy,
    MachinePolicy,
    SyntheticExample,
    PublicPolicy,
)


class RefinementRequest(BaseModel):
    moderator: ModeratorPolicy
    machine: MachinePolicy
    examples: List[SyntheticExample]

class ExampleRequest(BaseModel):
    policy: MachinePolicy

class ExampleResponse(BaseModel):
    examples: List[SyntheticExample]


class GenerateRequest(BaseModel):
    intent: str


class PolicyResponse(BaseModel):
    public: PublicPolicy
    moderator: ModeratorPolicy
    machine: MachinePolicy
