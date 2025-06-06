import os
from slugify import slugify
from policy_forge.schema import PublicPolicy, ModeratorPolicy, MachinePolicy
from policy_forge.formatters import (
    format_public_policy_to_md,
    format_moderator_policy_to_md,
    format_machine_policy_to_md,
)


def save_policies_to_markdown(
    public: PublicPolicy,
    moderator: ModeratorPolicy,
    machine: MachinePolicy,
):
    name_slug = slugify(moderator.name)
    os.makedirs("output", exist_ok=True)

    with open(f"output/{name_slug}_public.md", "w") as f:
        f.write(format_public_policy_to_md(public))

    with open(f"output/{name_slug}_moderator.md", "w") as f:
        f.write(format_moderator_policy_to_md(moderator))

    with open(f"output/{name_slug}_machine_policy.md", "w") as f:
        f.write(format_machine_policy_to_md(machine))