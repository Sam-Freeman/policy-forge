import os
from typing import List, Tuple
from dotenv import load_dotenv
from openai import OpenAI
from policy_forge.schema import (
    PublicPolicy,
    ModeratorPolicy,
    MachinePolicy,
    SyntheticExample,
)

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def refine_policies(
    public_policy: PublicPolicy,
    moderator_policy: ModeratorPolicy,
    machine_policy: MachinePolicy,
    reviewed_examples: List[SyntheticExample],
) -> Tuple[PublicPolicy, ModeratorPolicy, MachinePolicy]:
    review_summary = "\n".join(
        f'- "{ex.text}" → {ex.label}' for ex in reviewed_examples
    )

    system_msg = {
        "role": "system",
        "content": (
            "You are a senior trust and safety policy expert with extensive experience in policy development and refinement. "
            "Your expertise includes analyzing policy effectiveness, identifying gaps, and improving clarity across different "
            "audiences. You excel at balancing user safety, platform integrity, and operational efficiency. "
            "Your refinements should maintain consistency across all policy versions while optimizing each for its specific "
            "audience and use case. Consider both immediate improvements and long-term policy sustainability."
        ),
    }

    user_msg_public = {
        "role": "user",
        "content": f"""
The following **public-facing policy** was previously created:

{public_policy.model_dump_json(indent=2)}

Users have now reviewed examples and given feedback:
{review_summary}

Please revise and improve this policy to ensure:

1. Clarity and Accessibility:
   - Language is clear and accessible to global users
   - Technical terms are explained
   - Cultural considerations are addressed
   - Examples are relatable and diverse

2. Comprehensive Coverage:
   - All common violation patterns are addressed
   - Edge cases are properly explained
   - Cultural and regional variations are considered
   - Platform-specific contexts are covered

3. User Guidance:
   - Clear expectations are set
   - Consequences are well-explained
   - Appeal processes are clear
   - Resources for help are provided

4. Examples and FAQ:
   - Examples reflect real-world patterns
   - FAQ addresses common misunderstandings
   - Edge cases are properly explained
   - Cultural variations are considered

5. Structure and Organization:
   - Information is logically organized
   - Important points are emphasized
   - Related concepts are grouped
   - Navigation is intuitive

Tone: Clear, empathetic, and accessible to a global audience.
Return only the updated policy using the same schema.
""",
    }

    user_msg_moderator = {
        "role": "user",
        "content": f"""
The following **moderator policy** was previously created:

{moderator_policy.model_dump_json(indent=2)}

Users have now reviewed examples and given feedback:
{review_summary}

Please revise this policy to ensure:

1. Operational Clarity:
   - Enforcement criteria are unambiguous
   - Decision-making process is clear
   - Severity levels are well-defined
   - Escalation paths are explicit

2. Example Quality:
   - Examples cover all violation types
   - Edge cases are properly addressed
   - Cultural context is considered
   - Platform-specific patterns are included

3. Enforcement Guidance:
   - Action thresholds are clear
   - Severity is appropriately calibrated
   - Contextual factors are considered
   - Escalation criteria are defined

4. Edge Case Handling:
   - Ambiguous cases are addressed
   - Cultural variations are considered
   - Context-dependent decisions are guided
   - Special circumstances are covered

5. Technical Precision:
   - Terms are precisely defined
   - Criteria are measurable
   - Processes are repeatable
   - Documentation is complete

Tone: Professional, precise, and operationally focused.
Return only the updated policy using the same schema.
""",
    }

    user_msg_machine = {
        "role": "user",
        "content": f"""
The following **machine-readable classification policy** was previously created:

{machine_policy.model_dump_json(indent=2)}

Users have now reviewed examples and given feedback:
{review_summary}

Please refine this policy to ensure:

1. Technical Precision:
   - Rules are atomic and testable
   - Patterns are clearly defined
   - Confidence thresholds are specified
   - Integration requirements are clear

2. Classification Accuracy:
   - False positive prevention
   - Edge case handling
   - Context consideration
   - Cultural variation handling

3. System Requirements:
   - Performance expectations
   - Resource constraints
   - Integration points
   - Error handling

4. Example Quality:
   - Training data coverage
   - Edge case representation
   - Cultural diversity
   - Platform patterns

5. Implementation Guidance:
   - Model requirements
   - Processing steps
   - Output format
   - Error handling

Audience: Machine learning systems and engineers.
Return only the updated policy using the same schema.
""",
    }

    # Call OpenAI for each policy
    public_response = client.beta.chat.completions.parse(
        model="gpt-4o",
        messages=[system_msg, user_msg_public],
        response_format=PublicPolicy,
    )

    moderator_response = client.beta.chat.completions.parse(
        model="gpt-4o",
        messages=[system_msg, user_msg_moderator],
        response_format=ModeratorPolicy,
    )

    machine_response = client.beta.chat.completions.parse(
        model="gpt-4o",
        messages=[system_msg, user_msg_machine],
        response_format=MachinePolicy,
    )

    return (
        public_response.choices[0].message.parsed,
        moderator_response.choices[0].message.parsed,
        machine_response.choices[0].message.parsed,
    )
