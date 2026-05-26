import fs from "node:fs";
import path from "node:path";
import process from "node:process";

export function loadEnv(filePath = ".env") {
  const fullPath = path.resolve(filePath);

  if (!fs.existsSync(fullPath)) {
    return;
  }

  const content = fs.readFileSync(fullPath, "utf8");
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const equalsIndex = line.indexOf("=");
    if (equalsIndex === -1) {
      continue;
    }

    const key = line.slice(0, equalsIndex).trim();
    const value = stripQuotes(line.slice(equalsIndex + 1).trim());

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function stripQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

export function getConfig() {
  loadEnv();

  return {
    openai: {
      apiKey: process.env.OPENAI_API_KEY ?? "",
      baseUrl: process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1",
      model: process.env.OPENAI_MODEL ?? "gpt-5.2"
    },
    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY ?? "",
      baseUrl: process.env.ANTHROPIC_BASE_URL ?? "https://api.anthropic.com",
      model: process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-6"
    },
    maxOutputTokens: Number.parseInt(process.env.MAX_OUTPUT_TOKENS ?? "1024", 10)
  };
}
