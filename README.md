# 🛡️ PolicyForge
<p align="center">
  <img src="assets/logo.png" alt="PolicyForge Logo" width="250"/>
</p>

**PolicyForge** is a CLI assistant that helps trust & safety teams quickly generate, refine, and document moderation policies — from public-facing guidelines to internal reviewer instructions to machine-readable rules for LLMs.

Built for clarity, consistency, and real-world enforcement.

---

## ✨ Features

- 🔍 Guided intent definition via lightweight Q&A
- 📝 Generates 3 policy types:
  - **Public-facing policy** — for your Help Center or ToS
  - **Moderator policy** — for human review teams
  - **Machine-readable policy** — structured and atomic for use with classifiers or LLMs
- 🧪 Synthetic data generation with labeled examples
- ✅ Interactive reviewer to approve or revise outputs
- 🔁 Automatic refinement based on reviewed content
- 📄 Outputs clean Markdown docs for all policy types

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
poetry install
```

### 2. Set your OpenAI API key
Create a .env file:
```bash
OPENAI_API_KEY=sk-...
```

---

## 🔧 Usage

<p align="center">
  <img src="assets/example.png" alt="PolicyForge Logo" width="250"/>
</p>

```bash
poetry run policyforge
```
This command will:
	1.	Prompt you to describe your platform and enforcement goals
	2.	Generate initial policies based on your intent
	3.	Walk you through reviewing synthetic examples
	4.	Refine the policy using your feedback
	5.	Save the final policies to Markdown

---

## 📁 Output
Each run will generate:
* output/<policy>_public.md — for end users
* output/<policy>_moderator.md — for reviewers
* output/<policy>_machine_policy.md — for automation pipelines

These outputs are ready for use in:
* Product docs
* Internal playbooks
* Fine-tuning datasets
* Classifier testbeds

---

## 🧠 Philosophy
PolicyForge helps you go from ambiguous intentions to clear, enforceable, and adaptable trust & safety policies. It’s built for modern content moderation — fast, transparent, and machine-compatible from the start.

---

## 👀 Coming Soon
* 🗂️ Prebuilt policy templates (harassment, nudity, misinformation, etc.)
* 🌐 Optional web interface
* 📊 Dataset validation support
* 🧪 Integration with your moderation pipeline

---

## 💬 Questions?
Open an issue 