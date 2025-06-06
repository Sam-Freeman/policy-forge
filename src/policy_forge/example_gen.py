import os
from openai import OpenAI
from policy_forge.schema import ExampleListResponse

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def generate_examples(policy_text: str) -> ExampleListResponse:
    response = client.beta.chat.completions.parse(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a senior trust and safety expert with extensive experience in content moderation and policy enforcement. "
                    "Your expertise includes analyzing user-generated content across various platforms and understanding how policies "
                    "are applied in real-world scenarios. You excel at identifying subtle policy violations, edge cases, and "
                    "culturally contextual content. Your examples should reflect the diversity of real user behavior, including "
                    "different communication styles, cultural contexts, and platform-specific patterns."
                ),
            },
            {
                "role": "user",
                "content": f"""
Based on the following policy:

{policy_text}

Generate exactly 8 high-quality examples of user content that would be encountered on a modern social platform. These examples 
should test the policy's boundaries and effectiveness across different scenarios.

Distribution of examples:
- 4 clear **violations** (including both obvious and subtle cases)
- 3 clear **non-violations** (including edge cases that should be allowed)
- 1 **borderline case** that tests policy boundaries

For each example, provide:
- `text`: Realistic user-generated content (1-3 sentences)
- `label`: One of `"violation"`, `"non-violation"`, or `"borderline"`
- `context`: Brief explanation of why this example was classified as such
- `variation_type`: One of:
  * "explicit" - Direct, obvious policy violation/non-violation
  * "implicit" - Indirect or subtle policy violation/non-violation
  * "contextual" - Depends heavily on surrounding context
  * "cultural" - Involves cultural or regional considerations
  * "satirical" - Uses humor, parody, or satire
  * "technical" - Involves technical or platform-specific elements

Ensure diversity across:
- Communication styles (formal, casual, slang, emoji usage)
- Cultural contexts and regional variations
- Platform-specific patterns (hashtags, mentions, etc.)
- Content types (text, links, references to media)
- User intentions (malicious, accidental, satirical)
- Language complexity and sophistication

Return only a JSON object with a field `"examples"` containing a list of 8 example objects.

Note: Examples should be realistic but avoid extreme or harmful content. Focus on testing policy boundaries while maintaining 
platform-appropriate content standards.
""",
            },
        ],
        response_format=ExampleListResponse,
    )
    return response.choices[0].message.parsed
