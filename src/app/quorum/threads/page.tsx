"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Doc, Id } from "../../../../convex/_generated/dataModel";
import { AvatarStack, SourceChip, SourceChips, type Person } from "@/components/quorum/primitives";
import { DEMO_USERS } from "@/lib/quorum/demo-script";
import { timeAgo } from "@/lib/quorum/relative-time";

/* ───────────────────────────────────────────────────────────────
   Threads — the workspace, on real data.

   Everything here is a live Convex subscription: the review row's
   counts, the thread list, each conversation, the synthesized
   actions. Resolve a thread in the overlay and this page moves in
   the same moment.
   ─────────────────────────────────────────────────────────────── */

const FILTERS = ["Open", "Resolved", "Actions"] as const;
type Filter = (typeof FILTERS)[number];

const PRESENCE_WINDOW_MS = 45_000;
const HEARTBEAT_MS = 20_000;

const ROLE_LABEL: Record<string, string> = {
  pm: "PM",
  designer: "Designer",
  engineer: "Engineer",
  agent: "Agent",
};

/* A readable anchor line: breadcrumb when we have one, otherwise
   the selector with its :nth-of-type noise stripped. */
function prettyAnchor(t: Doc<"threads">): string {
  if (t.anchorData.type !== "element") return "region anchor";
  const crumb = t.anchorData.breadcrumb.join(" › ");
  if (crumb) return crumb;
  return t.anchorData.selector
    .replace(/:nth-of-type\(\d+\)/g, "")
    .split(">")
    .map((s) => s.trim())
    .filter(Boolean)
    .join(" › ");
}

function ExternalIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" fill="none"
      stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 2H2v6h6V6M6 1.5h2.5V4M8.5 1.5L4.5 5.5" />
    </svg>
  );
}

function LastMessage({
  threadId,
  users,
}: {
  threadId: Id<"threads">;
  users: Doc<"users">[];
}) {
  /* listByThread is already deployed; lastByThread lands with the
     next backend deploy. Until then, take the tail client-side. */
  const messages = useQuery(api.messages.listByThread, { threadId });
  const last = messages?.[messages.length - 1];
  if (!last) return null;
  const author =
    last.authorType === "agent"
      ? "Quorum"
      : (users.find((u) => u._id === last.authorUserId)?.name ?? "Teammate");
  return (
    <span className="q-ws-row-prev">
      <b>{author}:</b> {last.content.split("\n")[0]}
    </span>
  );
}

function Conversation({
  threadId,
  users,
}: {
  threadId: Id<"threads">;
  users: Doc<"users">[];
}) {
  const messages = useQuery(api.messages.listByThread, { threadId });
  if (!messages) return <p className="q-ws-empty-s">Loading conversation…</p>;
  if (messages.length === 0) return <p className="q-ws-empty-s">No messages in this thread.</p>;

  return (
    <div className="q-ws-conv">
      {messages.map((m) => {
        const author = m.authorUserId ? users.find((u) => u._id === m.authorUserId) : undefined;
        const isAgent = m.authorType === "agent";
        return (
          <div key={m._id} className={`q-ws-msg${isAgent ? " is-agent" : ""}`}>
            <div className="q-ws-msg-head">
              <b>{isAgent ? "Quorum" : (author?.name ?? "Teammate")}</b>
              <span>{isAgent ? "Agent" : author ? ROLE_LABEL[author.role] : ""}</span>
              <time>{timeAgo(m.createdAt)}</time>
            </div>
            {m.content.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
            {m.findings && m.findings.items.length > 0 && (
              <details className="q-findings">
                <summary>
                  {m.findings.title} · {m.findings.items.length}
                </summary>
                <ul>
                  {m.findings.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </details>
            )}
            {m.sources && m.sources.length > 0 && (
              <div className="q-ws-msg-chips">
                <SourceChips>
                  {m.sources.map((src) => (
                    <SourceChip
                      key={src.label + (src.url ?? "")}
                      label={src.label}
                      provenance={src.provenance}
                      href={src.url}
                      detail={src.detail}
                    />
                  ))}
                </SourceChips>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ThreadsPage() {
  const [filter, setFilter] = useState<Filter>("Open");
  const [expanded, setExpanded] = useState<Id<"threads"> | null>(null);
  const [search, setSearch] = useState("");

  const users = useQuery(api.users.list) ?? [];
  const previews = useQuery(api.previews.list);
  const preview = previews?.[0] ?? null;

  const threads =
    useQuery(api.threads.listByPreview, preview ? { previewId: preview._id } : "skip") ?? [];
  const actions =
    useQuery(api.actions.listByPreview, preview ? { previewId: preview._id } : "skip") ?? [];
  const removeAction = useMutation(api.actions.remove);

  const setThreadStatus = useMutation(api.threads.setStatus);
  const setActionStatus = useMutation(api.actions.setStatus);
  const heartbeat = useMutation(api.presence.heartbeat);

  /* ── live presence: sliding window + workspace heartbeat ────── */
  const [presenceSince, setPresenceSince] = useState(() => Date.now() - PRESENCE_WINDOW_MS);
  useEffect(() => {
    const iv = setInterval(() => setPresenceSince(Date.now() - PRESENCE_WINDOW_MS), 15_000);
    return () => clearInterval(iv);
  }, []);
  const presence =
    useQuery(
      api.presence.listActive,
      preview ? { previewId: preview._id, activeSince: presenceSince } : "skip",
    ) ?? [];

  const previewId = preview?._id;
  const viewerId = users.find((u) => u.externalId === DEMO_USERS.designer)?._id;
  useEffect(() => {
    if (!previewId || !viewerId) return;
    const beat = () =>
      void heartbeat({
        previewId,
        userId: viewerId,
        surface: "workspace",
        currentRoute: "/quorum/threads",
      });
    beat();
    const iv = setInterval(beat, HEARTBEAT_MS);
    return () => clearInterval(iv);
  }, [previewId, viewerId, heartbeat]);

  const liveUserIds = new Set(presence.map((p) => p.userId));

  const open = threads.filter((t) => t.status === "open");
  const resolved = threads.filter((t) => t.status === "resolved");

  const participants: Person[] = users
    .filter((u) => u.role !== "agent")
    .map((u) => ({
      id: u.externalId,
      name: u.name,
      role: ROLE_LABEL[u.role],
      active: liveUserIds.has(u._id),
    }));

  const q = search.trim().toLowerCase();
  const matches = (t: Doc<"threads">) =>
    !q || t.title.toLowerCase().includes(q) || prettyAnchor(t).toLowerCase().includes(q);

  const listedThreads = (filter === "Open" ? open : filter === "Resolved" ? resolved : []).filter(
    matches,
  );

  /* Arriving from the walkthrough (?thread=) — or cold — the AI
     insight nudge thread starts selected, so the conversation and
     its action items are already on screen. One-shot. */
  const preselected = useRef(false);
  useEffect(() => {
    if (preselected.current || threads.length === 0) return;
    preselected.current = true;
    const param = new URLSearchParams(window.location.search).get("thread");
    const byParam = param ? threads.find((t) => t._id === param) : undefined;
    const nudge = threads.find(
      (t) =>
        t.anchorData.type === "element" &&
        t.anchorData.selector.includes("ai-insight-prompt"),
    );
    const pick = byParam ?? nudge;
    if (pick) {
      const timer = setTimeout(() => setExpanded(pick._id), 0);
      return () => clearTimeout(timer);
    }
  }, [threads]);

  const selectedThread = threads.find((t) => t._id === expanded) ?? null;
  const selectedActions = selectedThread
    ? actions.filter((a) => a.threadId === selectedThread._id)
    : [];

  return (
    <>
      <header className="q-ws-head">
        <div>
          <h1 className="q-ws-h1">Threads</h1>
          <p className="q-ws-head-sub">Every decision, with its reasoning, in one place.</p>
        </div>
        <span className="q-ws-head-stats">
          <span className="q-ws-stats is-compact">
            <span className="q-ws-stat">
              <b>{open.length}</b>
              <span>open</span>
            </span>
            <span className="q-ws-stat">
              <b>{resolved.length}</b>
              <span>resolved</span>
            </span>
            <span className="q-ws-stat">
              <b>{actions.length}</b>
              <span>actions</span>
            </span>
          </span>
        </span>
        <span className="q-ws-head-presence">
          <AvatarStack people={participants} size={22} />
        </span>
      </header>

      <div className="q-ws-cols">
        {/* ── left: the review and its threads ─────────────────── */}
        <section className="q-ws-col" aria-label="Threads">
          <div className="q-ws-col-head">
            <span className="q-ws-col-t">Threads</span>
            <div className="q-ws-filters" role="group" aria-label="Filter threads">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  className={filter === f ? "is-on" : ""}
                  aria-pressed={filter === f}
                  onClick={() => setFilter(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="q-ws-search-row">
            <input
              type="search"
              className="q-ws-search"
              placeholder="Search threads…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search threads"
            />
          </div>

          <div className="q-ws-col-body">
            {!preview ? (
              <div className="q-ws-empty">
                <p className="q-ws-empty-s">Connecting to the review store…</p>
              </div>
            ) : (
              <>
                {filter !== "Actions" &&
                  listedThreads.map((t) => (
                    <button
                      key={t._id}
                      type="button"
                      className={`q-ws-row${expanded === t._id ? " is-on" : ""}${t.status === "resolved" ? " is-resolved" : ""}`}
                      onClick={() => setExpanded((cur) => (cur === t._id ? null : t._id))}
                    >
                      <span className="q-ws-row-t">{t.title}</span>
                      <span className="q-ws-row-url">{prettyAnchor(t)}</span>
                      <LastMessage threadId={t._id} users={users} />
                      <div className="q-ws-row-meta">
                        <span className={`q-ws-status${t.status === "open" ? " is-open" : ""}`}>
                          {t.status}
                        </span>
                        <span className="q-ws-sep">·</span>
                        <span>{t.actionCount} actions</span>
                        <span style={{ marginLeft: "auto" }}>{timeAgo(t.updatedAt)}</span>
                      </div>
                    </button>
                  ))}

                {filter !== "Actions" && listedThreads.length === 0 && (
                  <div className="q-ws-empty">
                    <p className="q-ws-empty-s">
                      {q ? (
                        <>No threads match “{search.trim()}”.</>
                      ) : (
                        <>
                          No {filter.toLowerCase()} threads yet. Open the review at{" "}
                          <code>/demo/playground?review=1</code> and select an element.
                        </>
                      )}
                    </p>
                  </div>
                )}

                {filter === "Actions" &&
                  (actions.length === 0 ? (
                    <div className="q-ws-empty">
                      <p className="q-ws-empty-s">
                        No actions yet. They are synthesised from a thread with{" "}
                        <code>Add to actions</code>.
                      </p>
                    </div>
                  ) : (
                    actions.map((a) => (
                      <button
                        key={a._id}
                        type="button"
                        className={`q-ws-row${expanded === a.threadId ? " is-on" : ""}`}
                        onClick={() =>
                          setExpanded((cur) => (cur === a.threadId ? null : a.threadId))
                        }
                      >
                        <span className="q-ws-row-t">{a.title}</span>
                        <span className="q-ws-row-url">{a.targetDescription}</span>
                        <div className="q-ws-row-meta">
                          <span className={a.status === "done" ? undefined : "q-ws-open"}>
                            {a.status}
                          </span>
                          <span style={{ marginLeft: "auto" }}>{timeAgo(a.createdAt)}</span>
                        </div>
                      </button>
                    ))
                  ))}
              </>
            )}
          </div>
        </section>

        {/* ── right: the selected thread, alone ─────────────────── */}
        <section className="q-ws-col" aria-label="Thread detail">
          <div className="q-ws-col-body">
            {preview && selectedThread && (
              <div className="q-ws-detail">
                <div
                  className={`q-ws-thread is-on${selectedThread.status === "resolved" ? " is-resolved" : ""}`}
                >
                  <div className="q-ws-thread-row">
                    <button
                      type="button"
                      className="q-ws-thread-head"
                      aria-expanded={true}
                      onClick={() => setExpanded(null)}
                    >
                      <span
                        className={`q-ws-dot${selectedThread.status === "open" ? " is-open" : ""}`}
                      />
                      <span className="q-ws-thread-t">{selectedThread.title}</span>
                    </button>
                    <span className="q-ws-thread-actions">
                      <button
                        type="button"
                        className="q-ws-btn"
                        onClick={() =>
                          void setThreadStatus({
                            threadId: selectedThread._id,
                            status: selectedThread.status === "open" ? "resolved" : "open",
                          })
                        }
                      >
                        {selectedThread.status === "open" ? "Resolve" : "Reopen"}
                      </button>
                      <Link
                        className="q-ws-btn is-primary"
                        href={`${preview.url}?review=1&thread=${selectedThread._id}`}
                      >
                        Open in review <ExternalIcon />
                      </Link>
                    </span>
                    <span className="q-ws-thread-meta">
                      <span
                        className={`q-ws-status${selectedThread.status === "open" ? " is-open" : ""}`}
                      >
                        {selectedThread.status}
                      </span>
                      {selectedThread.actionCount} actions · {timeAgo(selectedThread.updatedAt)}
                    </span>
                  </div>
                  <Conversation threadId={selectedThread._id} users={users} />
                </div>

                {selectedActions.length > 0 && (
                  <div className="q-ws-section">
                    <div className="q-ws-section-h is-plain">Actions from this thread</div>
                    {selectedActions.map((a) => (
                      <div
                        key={a._id}
                        className={`q-ws-action${a.status === "done" ? " is-done" : ""}`}
                      >
                        <div className="q-ws-action-head">
                          <b>{a.title}</b>
                          <span>{a.status}</span>
                          <button
                            type="button"
                            className="q-ws-action-x"
                            onClick={() => void removeAction({ actionId: a._id })}
                            aria-label={`Remove action: ${a.title}`}
                            title="Remove this action"
                          >
                            ×
                          </button>
                        </div>
                        <p>{a.summary}</p>
                        <dl>
                          <div>
                            <dt>Target</dt>
                            <dd>{a.targetDescription}</dd>
                          </div>
                          <div>
                            <dt>Scope</dt>
                            <dd>{a.scopeNotes}</dd>
                          </div>
                          <div>
                            <dt>Acceptance</dt>
                            <dd>{a.acceptanceNotes}</dd>
                          </div>
                        </dl>
                        <div className="q-ws-thread-tools">
                          <button
                            type="button"
                            className="q-ws-btn"
                            onClick={() =>
                              void setActionStatus({
                                actionId: a._id,
                                status: a.status === "done" ? "created" : "done",
                              }).catch(() => {
                                /* needs the pending backend deploy */
                              })
                            }
                          >
                            {a.status === "done" ? "Reopen" : "Mark done"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
