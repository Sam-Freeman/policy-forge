from typing import Dict


class IntentBuilder:
    def __init__(self):
        self.answers: Dict[str, str] = {}

    def ask_questions(self):
        import typer

        self.answers["platform_type"] = typer.prompt(
            "🧩 What type of platform do you operate? (e.g., social media, marketplace, messaging app)"
        )

        self.answers["industry"] = typer.prompt(
            "🏢 What industry or domain is your platform in? (e.g., gaming, e-commerce, education)"
        )

        self.answers["user_behavior"] = typer.prompt(
            "🎯 What specific behavior or type of content are you trying to detect or prevent?"
        )

        self.answers["real_world_concerns"] = typer.prompt(
            "🧠 Are there any real-world risks, brand concerns, or legal requirements this relates to?"
        )

        self.answers["moderation_style"] = typer.prompt(
            "🧑‍⚖️ How strict should enforcement be? (e.g., aggressive takedown, warn first, only clear violations)"
        )
        self.answers["additional_context"] = typer.prompt(
            "🔍 Are there any additional context or requirements you'd like to include?"
        )

    def build_intent(self) -> str:
        return f"""
Platform Type: {self.answers["platform_type"]}
Industry: {self.answers["industry"]}
Target Behavior: {self.answers["user_behavior"]}
Real-World Concerns: {self.answers["real_world_concerns"]}
Moderation Approach: {self.answers["moderation_style"]}
Additional Context: {self.answers["additional_context"]}

The goal is to write policies that effectively detect and moderate the above behavior, taking into account platform norms, user expectations, and the need for clear guidance and automation.
""".strip()
