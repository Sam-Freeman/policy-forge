import typer
from dotenv import load_dotenv
from policy_forge import (
    policy_writer,
    example_gen,
    reviewer,
    refiner,
    writer,
)
from policy_forge.intent_builder import IntentBuilder

app = typer.Typer()
load_dotenv()


@app.command()
def new():
    builder = IntentBuilder()
    builder.ask_questions()
    intent = builder.build_intent()

    typer.echo("✍️ Generating policy...")
    public, moderator, machine = policy_writer.generate_policy(intent)
    typer.echo("🧍‍♂️ Moderator policy:")
    typer.echo(moderator)
    typer.echo("🤖 Machine policy:")
    typer.echo(machine)
    typer.echo("📢 Public policy:")
    typer.echo(public)

    typer.confirm("Use these policies?", default=True)

    typer.echo("🔬 Generating examples...")
    examples = example_gen.generate_examples(machine)
    typer.echo(examples)

    typer.echo("🧑‍⚖️ Review the examples")
    reviewed = reviewer.review_examples(examples)

    typer.echo("🔁 Refining the policy...")
    public_refined, moderator_refined, machine_refined = refiner.refine_policies(
        public,
        moderator,
        machine,
        reviewed,
    )

    typer.echo("\n✅ Final Policy:")
    typer.echo(moderator_refined)
    typer.echo(machine_refined)
    typer.echo("📢 Public policy:")
    typer.echo(public_refined)

    typer.echo("💾 Saving policies to markdown...")
    writer.save_policies_to_markdown(public_refined, moderator_refined, machine_refined)

    typer.echo("🎉 Done! Your policy has been saved to output/")
