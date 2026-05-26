export class ProviderError extends Error {
  constructor(provider, status, message, details) {
    super(`${provider} API error ${status}: ${message}`);
    this.name = "ProviderError";
    this.provider = provider;
    this.status = status;
    this.details = details;
  }
}

export async function parseErrorResponse(provider, response) {
  const text = await response.text();
  let message = text || response.statusText;
  let details = text;

  try {
    const json = JSON.parse(text);
    details = json;
    message =
      json.error?.message ??
      json.error?.error?.message ??
      json.message ??
      response.statusText;
  } catch {
    // Plain text response; keep the raw body.
  }

  return new ProviderError(provider, response.status, message, details);
}
