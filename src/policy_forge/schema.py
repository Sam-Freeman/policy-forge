from pydantic import BaseModel, Field
from typing import Literal, List, Optional


class SyntheticExample(BaseModel):
    text: str
    label: Literal["violation", "non-violation", "borderline"]


class ExampleListResponse(BaseModel):
    examples: List[SyntheticExample]


class OutputFormat(BaseModel):
    type: Literal["classification"]
    labels: List[Literal["violation", "non-violation"]]
    confidence_required: bool = True


class MachinePolicy(BaseModel):
    name: str = Field(..., description="Name of the policy")
    description: str = Field(..., description="What this policy is detecting")
    scope: str = Field(
        ..., description="Content or context to which this policy applies"
    )
    violation_criteria: List[str] = Field(
        ..., description="Atomic rules that define a violation"
    )
    non_violation_examples: List[str] = Field(
        ..., description="Examples that should NOT be flagged"
    )
    edge_case_guidance: List[str] = Field(
        ..., description="How to handle ambiguous or borderline cases"
    )
    output_format: OutputFormat


class ModeratorPolicy(BaseModel):
    name: str  # Policy title, e.g., "Nudity and Sexual Content"
    description: str  # High-level overview of what this policy governs
    scope: str  # Where it applies: e.g. comments, private chat, images, etc.
    rationale: Optional[str] = Field(
        default=None,
        description="Explanation of why this policy exists—e.g., protecting minors, legal compliance, user trust.",
    )
    violation_examples: List[str]  # Clear examples that break the policy
    non_violation_examples: List[str]  # Legitimate content that should not be flagged
    edge_case_notes: List[str]  # Notes on interpretation for ambiguous cases
    enforcement_guidance: Optional[List[str]] = Field(
        default=None,
        description="Additional advice to reviewers on how to apply this policy. For example: escalate to a second reviewer if...",
    )
    severity: Literal["low", "medium", "high", "critical"]

class PublicPolicy(BaseModel):
    name: str = Field(..., description="Name of the policy as seen by end users")
    summary: str = Field(..., description="Brief overview of the rule and its purpose")
    rationale: str = Field(..., description="Why this policy exists and its goals")
    scope: str = Field(..., description="Where and how the policy applies")
    violation_examples: List[str] = Field(..., description="User-facing examples of violations")
    non_violation_examples: List[str] = Field(..., description="User-facing examples of acceptable content")
    faq: List[str] = Field(default_factory=list, description="Optional Q&A to clarify edge cases or common questions")
