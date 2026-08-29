import path from "node:path";
import { readFile } from "node:fs/promises";

import usersJson from "../../../fixtures/seed/users.json";
import previewsJson from "../../../fixtures/seed/previews.json";
import componentMapJson from "../../../fixtures/context/component-map.json";
import precedentJson from "../../../fixtures/analytics/precedent.json";

/* ───────────────────────────────────────────────────────────────
   Typed access to the local fixtures in /fixtures.

   Data only. Deciding *which* source answers a given question is
   agent routing, and that belongs in the agent layer — not here.

   The JSON loads at build time. The markdown is read at request time
   from the filesystem, so a fixture can be edited during a rehearsal
   without a rebuild. That makes this module server-only.
   ─────────────────────────────────────────────────────────────── */

export type UserRole = "pm" | "designer" | "engineer" | "agent";

export type SeedUser = {
  id: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  note?: string;
};

export type SeedPreview = {
  id: string;
  name: string;
  projectKey: string;
  /** Where the review runs inside Quorum. */
  url: string;
  introUrl?: string;
  /** The original deployment this was cloned from, for attribution. */
  sourceOfTruth?: string;
  note?: string;
};

export type TargetMapping = {
  key: string;
  label: string;
  /** Dashboard / SpendingSummary / AIInsightPrompt */
  breadcrumb: string[];
  surface: string;
  sharedWith: string[];
  sharedComponentNote: string;
};

export const seedUsers = usersJson.users as SeedUser[];
export const seedPreviews = previewsJson.previews as SeedPreview[];
export const targetMap = componentMapJson.targets as TargetMapping[];
export const analyticsPrecedents = precedentJson.precedents;

export function findTarget(key: string): TargetMapping | undefined {
  return targetMap.find((t) => t.key === key);
}

export function findUser(id: string): SeedUser | undefined {
  return seedUsers.find((u) => u.id === id);
}

/* ── markdown fixtures ──────────────────────────────────────────
   Kept as paths rather than imports so they stay readable as plain
   documents — they are meant to look like the docs a team actually
   keeps, not like source files. */

/* Repo-relative, and resolved only when a file is actually read.
   Holding absolute paths in a module constant would resolve
   `process.cwd()` at import time — which is both less useful to a
   caller and enough to make the bundler give up on tracing. */
export const MARKDOWN_FIXTURES = {
  productRationale: "fixtures/context/product-rationale.md",
  designReviewPlaybook: "fixtures/internal/design-review-playbook.md",
} as const;

export type MarkdownFixture = keyof typeof MARKDOWN_FIXTURES;

/** Server-side only. Returns null when the file is missing, so a
    caller can say it could not find the source rather than throw. */
export async function readMarkdownFixture(name: MarkdownFixture): Promise<string | null> {
  try {
    /* The tracer cannot bound a `process.cwd()` read and falls back to
       packing the entire project. `fixtures/` is declared instead via
       `outputFileTracingIncludes` in next.config.ts, so the files still
       ship — see the note there before removing either half. */
    const root = /* turbopackIgnore: true */ process.cwd();
    return await readFile(path.join(root, MARKDOWN_FIXTURES[name]), "utf8");
  } catch {
    return null;
  }
}
