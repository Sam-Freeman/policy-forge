import os
from openai import OpenAI
from policy_forge.schema import MachinePolicy, ModeratorPolicy, PublicPolicy
from typing import Tuple
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def generate_initial_policy(intent: str) -> MachinePolicy:
    system_msg = {
        "role": "system",
        "content": (
            "You are a senior trust and safety policy expert with extensive experience at major social platforms. "
            "Your expertise spans policy development, enforcement operations, and machine learning systems. "
            "You are responsible for drafting comprehensive moderation policies that balance user safety, platform integrity, "
            "and operational efficiency. Your policies should be detailed enough to serve as reference documentation "
            "for teams across the organization. "
            "Your tone should be authoritative yet accessible, similar to policy guidelines published by Meta, YouTube, "
            "or Reddit. Be thorough and precise, avoiding unnecessary legalese while maintaining professional rigor. "
            "Each policy section should be substantial (300-500 words) to provide adequate context and guidance."
        ),
    }

    user_msg_machine = {
        "role": "user",
        "content": f"""
You are a Trust & Safety policy architect writing a **machine-readable policy** for an LLM-based moderation system.

This policy will be used in both fine-tuning and prompt-based classification contexts. The goal is to capture the target 
behavior as precisely and programmatically as possible, while accounting for edge cases and contextual nuances.

Here is the structured intent provided by the platform administrator:

\"\"\"{intent}\"\"\"

Please return a JSON object using the following schema:

- **name**: Clear, technical identifier for the policy
- **description**: Detailed specification (200-300 words) covering:
  * Detection objectives
  * Technical requirements
  * Performance expectations
  * Integration considerations
- **scope**: Comprehensive coverage of:
  * Content types and formats
  * Platform contexts
  * Technical limitations
  * Integration points
- **violation_criteria**: A detailed list of:
  * Atomic, testable rules
  * Pattern recognition requirements
  * Context evaluation criteria
  * Confidence thresholds
- **non_violation_examples**: At least 5 examples covering:
  * Clear non-violations
  * Edge cases to avoid false positives
  * Cultural exceptions
  * Context-dependent cases
- **edge_case_guidance**: Detailed notes on:
  * Handling ambiguity
  * Cultural variation
  * Satire and parody detection
  * Context interpretation
  * Confidence scoring
- **output_format**: One of \"binary\", \"multiclass\", or \"score_range\" with:
  * Clear definition of output classes
  * Confidence thresholds
  * Escalation criteria
  * Integration requirements

Tone: Technical, precise, and system-oriented.
Audience: LLMs, engineers, and data scientists building detection systems.
""",
    }

    machine_policy = client.beta.chat.completions.parse(
        model="gpt-4o",
        messages=[system_msg, user_msg_machine],
        response_format=MachinePolicy,
    )

    return machine_policy.choices[0].message.parsed

def generate_derived_policies(machine_policy: MachinePolicy) -> Tuple[PublicPolicy, ModeratorPolicy]:
    system_msg = {
        "role": "system",
        "content": (
            "You are a senior trust and safety policy expert with extensive experience at major social platforms. "
            "Your expertise spans policy development, enforcement operations, and machine learning systems. "
            "You are responsible for drafting comprehensive moderation policies that balance user safety, platform integrity, "
            "and operational efficiency. Your policies should be detailed enough to serve as reference documentation "
            "for teams across the organization. "
            "Your tone should be authoritative yet accessible, similar to policy guidelines published by Meta, YouTube, "
            "or Reddit. Be thorough and precise, avoiding unnecessary legalese while maintaining professional rigor. "
            "Each policy section should be substantial (300-500 words) to provide adequate context and guidance."
        ),
    }

    user_msg_moderator = {
        "role": "user",
        "content": f"""
You are a Trust & Safety operations lead writing **moderator-facing policy guidance** for internal enforcement teams.

Here is the machine-readable policy that defines the core rules and logic:

\"\"\"{machine_policy}\"\"\"

Based on this machine policy, write a comprehensive moderator guidance that provides operational clarity and supports consistent enforcement. 
This guidance will be used by trained moderators and trust & safety analysts for enforcement decisions.

Return a JSON object using the following schema:

- **name**: Clear, descriptive title of the policy (2-5 words)
- **description**: A detailed description (100-200 words) covering:
  * Core purpose and objectives
  * Key enforcement principles
  * Operational context
  * Expected outcomes
- **scope**: Comprehensive coverage of:
  * Content types and formats
  * Platform contexts and features
  * Geographic and cultural considerations
  * Temporal aspects (if relevant)
- **violation_examples**: At least 5 realistic examples covering:
  * Clear-cut violations
  * Subtle or nuanced violations
  * Context-dependent violations
- **non_violation_examples**: At least 3 examples covering:
  * Edge cases that should be allowed
  * Content that might seem risky but is permissible
  * Cultural or contextual exceptions
- **edge_case_notes**: At least 3 detailed notes addressing:
  * Cultural and regional variations
  * Context-dependent interpretation
  * Special considerations for different user groups
  * Handling of satire, parody, and artistic expression
- **severity**: One of: \"low\", \"medium\", \"high\", \"critical\" with:
  * Clear justification for the severity level
  * Specific enforcement actions for each severity
  * Escalation paths and thresholds

Tone: Professional, precise, and operationally focused.
Audience: Moderators, trust analysts, and enforcement teams.
""",
    }

    user_msg_public = {
        "role": "user",
        "content": f"""
You're a Trust & Safety policy expert drafting a **public-facing policy** for a digital platform.

Here is the machine-readable policy that defines the core rules and logic:

\"\"\"{machine_policy}\"\"\"

Please write a comprehensive user-facing policy that helps end users understand what this rule is about, why it matters, 
where it applies, and what content is allowed or disallowed. This policy should be accessible while maintaining 
professional standards.

Return a JSON object using the following schema:

- **name**: Clear, user-friendly title (2-5 words)
- **summary**: A detailed, in-depth explanation of the policy that explains the rule in plain, clear language for end users (400-500 words) covering:
  * What the policy means in plain language
  * Why it matters to users
  * How it affects the community
  * What users can expect
- **rationale**: Comprehensive explanation of:
  * Safety and security considerations
  * Legal and regulatory requirements
  * Community standards and values
  * Platform integrity needs
- **scope**: Clear definition of:
  * Where and when the policy applies
  * Types of content covered
  * Platform features affected
  * Geographic considerations
- **violation_examples**: At least 5 examples covering:
  * Common violations
  * Subtle violations
  * Context-dependent cases
- **non_violation_examples**: At least 3 examples showing:
  * Permissible content
  * Edge cases that are allowed
  * Cultural exceptions
- **faq**: At least 5 Q&A entries addressing:
  * Common misunderstandings
  * Edge cases and exceptions
  * Appeal processes
  * Cultural considerations
  * Enforcement procedures

Tone: Empathetic, professional, and accessible to global users.
Audience: Diverse global user base with varying levels of technical expertise.
""",
    }

    moderator_policy = client.beta.chat.completions.parse(
        model="gpt-4o",
        messages=[system_msg, user_msg_moderator],
        response_format=ModeratorPolicy,
    )

    public_policy = client.beta.chat.completions.parse(
        model="gpt-4o",
        messages=[system_msg, user_msg_public],
        response_format=PublicPolicy,
    )

    return (
        public_policy.choices[0].message.parsed,
        moderator_policy.choices[0].message.parsed,
    )

# Keep the original function for backward compatibility
def generate_policy(intent: str) -> Tuple[PublicPolicy, ModeratorPolicy, MachinePolicy]:
    machine_policy = generate_initial_policy(intent)
    public_policy, moderator_policy = generate_derived_policies(machine_policy)
    return public_policy, moderator_policy, machine_policy
