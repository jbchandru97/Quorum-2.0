import "server-only";

import path from "node:path";
import { readdir, readFile, stat } from "node:fs/promises";

/* ───────────────────────────────────────────────────────────────
   Repo search — the agent's real code-understanding source.

   Walks the product under review (the vendored Malbank tree), the
   docs, and the fixtures, and scores lines against the question's
   keywords. What comes back is what is actually in the files —
   paths, line numbers, and the matched lines themselves — so an
   answer built on it cites code that exists, never code imagined.

   Kept dependency-free and bounded: the corpus is small, loaded
   once per server process, and re-read only when it ages out.
   ─────────────────────────────────────────────────────────────── */

const ROOTS = ["src/app/demo", "src/components/demo", "fixtures", "docs"];
const EXTS = new Set([".ts", ".tsx", ".css", ".md", ".json"]);
const MAX_FILE_BYTES = 300_000;
const CORPUS_TTL_MS = 60_000;

export type RepoHit = {
  /** Repo-relative path. */
  file: string;
  line: number;
  text: string;
  score: number;
};

type CorpusFile = { file: string; lines: string[] };

let corpus: CorpusFile[] | null = null;
let corpusLoadedAt = 0;

async function walk(dir: string, out: string[]): Promise<void> {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, out);
    else if (EXTS.has(path.extname(entry.name))) out.push(full);
  }
}

async function loadCorpus(): Promise<CorpusFile[]> {
  if (corpus && Date.now() - corpusLoadedAt < CORPUS_TTL_MS) return corpus;
  const root = /* turbopackIgnore: true */ process.cwd();
  const files: string[] = [];
  for (const r of ROOTS) await walk(path.join(root, r), files);

  const loaded: CorpusFile[] = [];
  for (const file of files) {
    try {
      const info = await stat(file);
      if (info.size > MAX_FILE_BYTES) continue;
      const text = await readFile(file, "utf8");
      loaded.push({ file: path.relative(root, file), lines: text.split("\n") });
    } catch {
      /* unreadable file: skip, never fail the search */
    }
  }
  corpus = loaded;
  corpusLoadedAt = Date.now();
  return loaded;
}

const STOP = new Set([
  "the", "a", "an", "is", "are", "was", "were", "be", "been", "do", "does",
  "did", "how", "what", "why", "when", "where", "which", "who", "this",
  "that", "these", "those", "it", "its", "in", "on", "of", "to", "for",
  "and", "or", "not", "no", "we", "you", "your", "our", "i", "my", "me",
  "with", "can", "could", "should", "would", "will", "have", "has", "had",
  "there", "here", "does", "please", "about", "into", "from", "at", "by",
]);

export function keywordsOf(question: string): string[] {
  return [
    ...new Set(
      question
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 2 && !STOP.has(w)),
    ),
  ];
}

/** The product under review, without docs/fixtures — for questions
    about what the code itself contains. */
export const SOURCE_ROOTS = ["src/app/demo", "src/components/demo"];

/** Top hits for a question: at most one (best) line per file. */
export async function searchRepo(
  question: string,
  max = 3,
  roots?: string[],
): Promise<RepoHit[]> {
  const words = keywordsOf(question);
  if (words.length === 0) return [];
  let files = await loadCorpus();
  if (roots) files = files.filter((f) => roots.some((r) => f.file.startsWith(r)));

  const hits: RepoHit[] = [];
  for (const { file, lines } of files) {
    let best: RepoHit | null = null;
    let fileScore = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].toLowerCase();
      if (!line.trim()) continue;
      let score = 0;
      for (const w of words) {
        if (line.includes(w)) score += new RegExp(`\\b${w}\\b`).test(line) ? 2 : 1;
      }
      if (score === 0) continue;
      fileScore += score;
      if (!best || score > best.score) {
        best = { file, line: i + 1, text: lines[i].trim().slice(0, 160), score };
      }
    }
    if (best) hits.push({ ...best, score: fileScore });
  }

  /* Require more than a single stray keyword before citing a file. */
  const threshold = words.length > 1 ? 3 : 2;
  return hits
    .filter((h) => h.score >= threshold)
    .sort((a, b) => b.score - a.score)
    .slice(0, max);
}
