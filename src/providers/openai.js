import { parseErrorResponse } from "../errors.js";

export async function askOpenAI({ apiKey, baseUrl, model, prompt, system, maxOutputTokens }) {
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY. Add it to .env first.");
  }

  const response = await fetch(`${baseUrl}/responses`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      instructions: system || undefined,
      input: prompt,
      max_output_tokens: maxOutputTokens
    })
  });

  if (!response.ok) {
    throw await parseErrorResponse("OpenAI", response);
  }

  const data = await response.json();
  return {
    provider: "openai",
    model,
    text: extractOpenAIText(data),
    raw: data
  };
}

function extractOpenAIText(data) {
  if (typeof data.output_text === "string" && data.output_text.length > 0) {
    return data.output_text;
  }

  const parts = [];
  for (const item of data.output ?? []) {
    for (const content of item.content ?? []) {
      if (content.type === "output_text" && typeof content.text === "string") {
        parts.push(content.text);
      }
    }
  }

  return parts.join("\n").trim();
}
