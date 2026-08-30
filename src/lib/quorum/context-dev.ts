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

/** Scrape one page to Markdown — the second hop of the external
    pipeline. Serves cached results when Context.dev has them. */
export async function scrapePageMarkdown(url: string): Promise<string> {
  try {
    const res = await getClient().web.webScrapeMd({ url, timeoutMS: 25_000 });
    return res.markdown ?? "";
  } catch (error) {
    if (error instanceof APIError) {
      throw new ContextDevIntegrationError("Context.dev scrape failed", error.status);
    }
    throw new ContextDevIntegrationError("Context.dev scrape failed");
  }
}

export async function searchExternalEvidence(
  query: string,
  opts: { excludeDomains?: string[] } = {},
): Promise<ExternalEvidenceResult> {
  const normalizedQuery = query.trim();
  if (!normalizedQuery || normalizedQuery.length > 500) {
    throw new ContextDevIntegrationError("Query must contain between 1 and 500 characters", 400);
  }

  try {
    const response = await getClient().web.search({
      query: normalizedQuery,
      numResults: 10,
      excludeDomains: opts.excludeDomains,
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
