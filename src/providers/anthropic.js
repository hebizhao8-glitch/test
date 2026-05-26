import { parseErrorResponse } from "../errors.js";

export async function askClaude({ apiKey, baseUrl, model, prompt, system, maxOutputTokens }) {
  if (!apiKey) {
    throw new Error("Missing ANTHROPIC_API_KEY. Add it to .env first.");
  }

  const body = {
    model,
    max_tokens: maxOutputTokens,
    messages: [
      {
        role: "user",
        content: prompt
      }
    ]
  };

  if (system) {
    body.system = system;
  }

  const response = await fetch(`${baseUrl}/v1/messages`, {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw await parseErrorResponse("Claude", response);
  }

  const data = await response.json();
  return {
    provider: "claude",
    model,
    text: extractClaudeText(data),
    raw: data
  };
}

function extractClaudeText(data) {
  return (data.content ?? [])
    .filter((block) => block.type === "text" && typeof block.text === "string")
    .map((block) => block.text)
    .join("\n")
    .trim();
}
