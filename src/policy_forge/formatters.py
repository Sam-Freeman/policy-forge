from policy_forge.schema import PublicPolicy, ModeratorPolicy, MachinePolicy


def format_public_policy_to_md(policy: PublicPolicy) -> str:
    lines = [
        f"# {policy.name}\n",
        f"**Summary:** {policy.summary}",
        f"**Rationale:** {policy.rationale}",
        f"**Scope:** {policy.scope}",
        "\n## Violation Examples",
    ]
    for ex in policy.violation_examples:
        lines.append(f"- {ex}")

    lines.append("\n## Non-Violation Examples")
    for ex in policy.non_violation_examples:
        lines.append(f"- {ex}")

    if policy.faq:
        lines.append("\n## Frequently Asked Questions")
        for qa in policy.faq:
            lines.append(f"- {qa}")

    return "\n".join(lines)


def format_moderator_policy_to_md(policy: ModeratorPolicy) -> str:
    lines = [
        f"# {policy.name}\n",
        f"**Description:** {policy.description}",
        f"**Scope:** {policy.scope}",
    ]
    if policy.rationale:
        lines.append(f"**Rationale:** {policy.rationale}")
    lines.append(f"**Severity:** {policy.severity.capitalize()}")

    lines.append("\n## Violation Examples")
    for ex in policy.violation_examples:
        lines.append(f"- {ex}")

    lines.append("\n## Non-Violation Examples")
    for ex in policy.non_violation_examples:
        lines.append(f"- {ex}")

    lines.append("\n## Edge Case Notes")
    for note in policy.edge_case_notes:
        lines.append(f"- {note}")

    if policy.enforcement_guidance:
        lines.append("\n## Enforcement Guidance")
        for tip in policy.enforcement_guidance:
            lines.append(f"- {tip}")

    return "\n".join(lines)


def format_machine_policy_to_md(policy: MachinePolicy) -> str:
    lines = [
        f"# {policy.name}\n",
        f"**Description:** {policy.description}",
        f"**Scope:** {policy.scope}",
        "\n## Violation Criteria",
    ]
    for rule in policy.violation_criteria:
        lines.append(f"- {rule}")

    lines.append("\n## Non-Violation Examples")
    for ex in policy.non_violation_examples:
        lines.append(f"- {ex}")

    lines.append("\n## Edge Case Guidance")
    for guidance in policy.edge_case_guidance:
        lines.append(f"- {guidance}")

    lines.append("\n## Output Format")
    lines.append(f"- Type: `{policy.output_format.type}`")
    lines.append(f"- Labels: `{', '.join(policy.output_format.labels)}`")
    lines.append(f"- Confidence Required: `{policy.output_format.confidence_required}`")

    return "\n".join(lines)
