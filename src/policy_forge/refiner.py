import os
from dotenv import load_dotenv
from openai import OpenAI
from policy_forge.schema import (
    MachinePolicy,
)

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def refine_machine_policy(
    machine_policy: MachinePolicy, reviewed_examples: dict
) -> MachinePolicy:
    system_msg = {
        "role": "system",
        "content": (
            "You are a senior trust and safety policy expert with extensive experience in content moderation and policy enforcement. "
            "Your expertise includes analyzing user-generated content across various platforms and understanding how policies "
            "are applied in real-world scenarios. You excel at identifying subtle policy violations, edge cases, and "
            "culturally contextual content. Your task is to refine the machine policy based on reviewed examples to ensure "
            "it captures all edge cases and nuances correctly."
        ),
    }

    user_msg = {
        "role": "user",
        "content": f"""
Here is the current machine policy:

\"\"\"{machine_policy}\"\"\"

And here are the reviewed examples with their labels:

\"\"\"{reviewed_examples}\"\"\"

Please refine the machine policy to better handle the edge cases and nuances revealed by the reviewed examples. 
Focus on making the policy more precise and comprehensive while maintaining its machine-readable nature.

Return a JSON object using the same schema as the input machine policy.
""",
    }

    refined_policy = client.beta.chat.completions.parse(
        model="gpt-4o",
        messages=[system_msg, user_msg],
        response_format=MachinePolicy,
    )

    return refined_policy.choices[0].message.parsed
