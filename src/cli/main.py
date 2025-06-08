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

    typer.echo("✍️ Generating initial machine policy...")
    machine = policy_writer.generate_initial_policy(intent)
    typer.echo("🤖 Machine policy:")
    typer.echo(machine)

    if not typer.confirm("Review and refine this machine policy?", default=True):
        return

    typer.echo("🔬 Generating examples...")
    examples = example_gen.generate_examples(machine)
    typer.echo(examples)

    typer.echo("🧑‍⚖️ Review the examples")
    reviewed = reviewer.review_examples(examples)

    typer.echo("🔁 Refining the machine policy...")
    machine_refined = refiner.refine_machine_policy(machine, reviewed)
    typer.echo("🤖 Refined machine policy:")
    typer.echo(machine_refined)

    if not typer.confirm("Generate public and moderator policies from this refined machine policy?", default=True):
        return

    typer.echo("📝 Generating public and moderator policies...")
    public, moderator = policy_writer.generate_derived_policies(machine_refined)
    
    typer.echo("🧍‍♂️ Moderator policy:")
    typer.echo(moderator)
    typer.echo("📢 Public policy:")
    typer.echo(public)

    if not typer.confirm("Save all policies?", default=True):
        return

    typer.echo("💾 Saving policies to markdown...")
    writer.save_policies_to_markdown(public, moderator, machine_refined)

    typer.echo("🎉 Done! Your policies have been saved to output/")
