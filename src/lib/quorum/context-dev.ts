import "server-only";

import ContextDev, { APIError } from "context.dev";

export type ExternalEvidence = {
  title: string;
  url: string;
  snippet: string;
  relevance: "high" | "medium" | "low";
};

export type ExternalEvidenceResult = {
  query: string;
  sources: ExternalEvidence[];
};

export class ContextDevIntegrationError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "ContextDevIntegrationError";
  }
}

let client: ContextDev | undefined;

function getClient(): ContextDev {
  if (!process.env.CONTEXT_DEV_API_KEY) {
    throw new ContextDevIntegrationError("Context.dev is not configured");
  }

  client ??= new ContextDev({ maxRetries: 2, timeout: 30_000 });
  return client;
}

export async function searchExternalEvidence(query: string): Promise<ExternalEvidenceResult> {
  const normalizedQuery = query.trim();
  if (!normalizedQuery || normalizedQuery.length > 500) {
    throw new ContextDevIntegrationError("Query must contain between 1 and 500 characters", 400);
  }

  try {
    const response = await getClient().web.search({
      query: normalizedQuery,
      numResults: 10,
      tags: ["quorum", "external-evidence"],
      timeoutMS: 30_000,
    });

    return {
      query: response.query,
      sources: response.results.map(({ title, url, description, relevance }) => ({
        title,
        url,
        snippet: description,
        relevance,
      })),
    };
  } catch (error) {
    if (error instanceof ContextDevIntegrationError) throw error;
    if (error instanceof APIError) {
      throw new ContextDevIntegrationError("Context.dev search failed", error.status);
    }
    throw new ContextDevIntegrationError("Context.dev search failed");
  }
}
