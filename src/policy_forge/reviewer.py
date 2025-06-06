from policy_forge.schema import ExampleListResponse

def review_examples(example_data: ExampleListResponse) -> list[dict]:   
    reviewed = []

    for i, example in enumerate(example_data.examples, 1):
        print(f"\n[{i}] {example.text}")
        print(f"Suggested label: {example.label}")
        choice = input("Do you agree? (y/n): ").strip().lower()
        
        if choice == 'y':
            reviewed.append(example)
        elif choice == 'n':
            new_label = input("New label (violation/non-violation/borderline): ").strip()
            example.label = new_label
            reviewed.append(example)
    return reviewed