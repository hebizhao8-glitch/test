import { getConfig } from "./env.js";

const config = getConfig();

console.log("Config check:");
console.log(`- OpenAI key: ${config.openai.apiKey ? "set" : "missing"}`);
console.log(`- OpenAI model: ${config.openai.model}`);
console.log(`- Claude key: ${config.anthropic.apiKey ? "set" : "missing"}`);
console.log(`- Claude model: ${config.anthropic.model}`);
console.log(`- Max output tokens: ${config.maxOutputTokens}`);

if (!config.openai.apiKey || !config.anthropic.apiKey) {
  console.log("\nAdd missing keys to .env. Keep .env private.");
}
