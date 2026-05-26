import process from "node:process";
import { getConfig } from "./env.js";
import { askClaude } from "./providers/anthropic.js";
import { askOpenAI } from "./providers/openai.js";

const args = parseArgs(process.argv.slice(2));

if (!args.prompt) {
  printUsage();
  process.exit(1);
}

const provider = args.provider ?? "both";
const config = getConfig();

try {
  const results = await runProvider(provider, {
    prompt: args.prompt,
    system: args.system ?? "",
    config
  });

  for (const result of results) {
    console.log(`\n[${result.provider} / ${result.model}]`);
    console.log(result.text || "(No text returned.)");
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

async function runProvider(provider, { prompt, system, config }) {
  const calls = {
    openai: () =>
      askOpenAI({
        ...config.openai,
        prompt,
        system,
        maxOutputTokens: config.maxOutputTokens
      }),
    claude: () =>
      askClaude({
        ...config.anthropic,
        prompt,
        system,
        maxOutputTokens: config.maxOutputTokens
      })
  };

  if (provider === "openai") {
    return [await calls.openai()];
  }

  if (provider === "claude") {
    return [await calls.claude()];
  }

  if (provider === "both") {
    return await Promise.all([calls.openai(), calls.claude()]);
  }

  throw new Error(`Unknown provider "${provider}". Use openai, claude, or both.`);
}

function parseArgs(argv) {
  const result = {
    provider: undefined,
    system: undefined,
    promptParts: []
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--provider" || arg === "-p") {
      result.provider = argv[index + 1];
      index += 1;
      continue;
    }

    if (arg === "--system" || arg === "-s") {
      result.system = argv[index + 1];
      index += 1;
      continue;
    }

    result.promptParts.push(arg);
  }

  return {
    provider: result.provider,
    system: result.system,
    prompt: result.promptParts.join(" ").trim()
  };
}

function printUsage() {
  console.log(`
Usage:
  npm run ask -- --provider openai "Your question"
  npm run ask -- --provider claude "Your question"
  npm run ask -- --provider both "Your question"

Options:
  --provider, -p  openai | claude | both
  --system, -s    Optional system instruction
`);
}
