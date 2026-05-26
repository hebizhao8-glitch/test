# Multi AI API Bridge

Tiny local CLI for testing OpenAI and Claude from one place.

## Setup

1. Copy the example env file:

```sh
cp .env.example .env
```

2. Put your keys in `.env`:

```sh
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

Do not paste API keys into chat or commit `.env` to GitHub.

## Run

Use the local Node that was installed for this workspace:

```sh
/Users/hebi/Documents/Codex/tools/node-v24.16.0-darwin-arm64/bin/npm run check
```

Ask OpenAI:

```sh
/Users/hebi/Documents/Codex/tools/node-v24.16.0-darwin-arm64/bin/npm run ask -- --provider openai "Say hello in one sentence."
```

Ask Claude:

```sh
/Users/hebi/Documents/Codex/tools/node-v24.16.0-darwin-arm64/bin/npm run ask -- --provider claude "Say hello in one sentence."
```

Ask both:

```sh
/Users/hebi/Documents/Codex/tools/node-v24.16.0-darwin-arm64/bin/npm run ask -- --provider both "Give me one practical coding tip."
```

## Options

```sh
npm run ask -- --provider both --system "Be concise." "Your question here"
```

Providers:

- `openai`
- `claude`
- `both`

Model defaults live in `.env` and can be changed without editing code.
