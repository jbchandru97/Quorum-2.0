"use client";

import { useEffect, useRef, useState } from "react";
import type { Doc } from "../../../../convex/_generated/dataModel";
import { AgentSteps, Avatar } from "@/components/quorum/primitives";
import { timeAgo } from "@/lib/quorum/relative-time";
import { DEMO_USERS } from "@/lib/quorum/demo-script";
import { BrandContextDev, brandFor, IconFile, IconMessage, IconResolve, QuorumLogo } from "./icons";
import { useReviewSession } from "./ReviewSession";

/* ───────────────────────────────────────────────────────────────
   ThreadContent — one conversation, two frames.

   The chrome stays out of the way: the element name in the header,
   the conversation, an input, Send. Tagging works the way design
   tools do — typing @ opens a name list, arrows move, Tab or Enter
   commits. A message becomes an action from its own hover control;
   the whole thread becomes outputs only when it is resolved.
   ─────────────────────────────────────────────────────────────── */

const ROLE_LABEL: Record<string, string> = {
  pm: "PM",
  designer: "Designer",
  engineer: "Engineer",
  agent: "Agent",
};

const MENTIONABLE = ["Quorum", "Rohan", "Arun"];

/** @Mentions read in accent so tagging a human is visible. */
function withMentions(text: string): React.ReactNode[] {
  return text.split(/(@\w+)/g).map((part, i) =>
    part.startsWith("@") ? (
      <span key={i} className="q-mention">
        {part}
      </span>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

/* ── the support dropdown ────────────────────────────────────────
   Everything behind an answer — the lookup trail, codebase matches,
   and every referenced source — folds into one collapsible bar. The
   bar summarizes what happened and previews the source marks; the
   body structures it with headings at the response's own type size. */

type MsgSource = NonNullable<Doc<"messages">["sources"]>[number];

const REPO_ITEM = /^([\w./-]+\.(?:tsx?|css|md|json)):(\d+) — (.*)$/;
const SCRAPE_ITEM = /^Scraped (\S+)(.*)$/;

function sourceIcon(s: MsgSource): React.ReactNode {
  return (
    brandFor(s) ??
    (s.detail?.startsWith("repo") ? (
      <IconFile />
    ) : (
      <span className="q-prov" data-kind={s.provenance} aria-hidden="true" />
    ))
  );
}

function SupportDropdown({ msg }: { msg: Doc<"messages"> }) {
  const sources = msg.sources ?? [];
  const findings = msg.findings;
  if (sources.length === 0 && (!findings || findings.items.length === 0)) return null;

  const repoFiles = sources.filter((s) => s.detail?.startsWith("repo"));
  const external = sources.some((s) => /context\.dev/i.test(s.detail ?? ""));

  const label = external
    ? `Looked up ${sources.length || "multiple"} source${sources.length === 1 ? "" : "s"} on the web`
    : repoFiles.length > 0
      ? `Searched the codebase · ${repoFiles.length} file${repoFiles.length === 1 ? "" : "s"}`
      : sources.length > 0
        ? `Referenced ${sources.length} source${sources.length === 1 ? "" : "s"}`
        : (findings?.title ?? "Steps");

  /* One mark per distinct source kind, previewed on the bar. */
  const iconKeys = new Set<string>();
  const icons: React.ReactNode[] = [];
  for (const s of sources) {
    const key = /context\.dev/i.test(s.detail ?? "")
      ? "ctx"
      : /playbook/i.test(s.label)
        ? "atl"
        : /precedent|analytics/i.test(s.label)
          ? "amp"
          : s.detail?.startsWith("repo")
            ? "file"
            : `prov-${s.provenance}`;
    if (iconKeys.has(key) || icons.length >= 4) continue;
    iconKeys.add(key);
    icons.push(<span key={key}>{sourceIcon(s)}</span>);
  }

  return (
    <details className="q-support">
      <summary>
        <span className="q-support-chev" aria-hidden="true" />
        <span className="q-support-label">{label}</span>
        <span className="q-support-icons">{icons}</span>
      </summary>
      <div className="q-support-body">
        {findings && findings.items.length > 0 && (
          <section>
            <h4>{findings.title}</h4>
            {findings.items.map((item, i) => {
              const repo = item.match(REPO_ITEM);
              if (repo) {
                return (
                  <div key={i} className="q-support-row">
                    <span className="q-support-ico"><IconFile /></span>
                    <div>
                      <b>{repo[1].split("/").pop()}</b>
                      <span className="q-support-dim"> · line {repo[2]}</span>
                      <p>{repo[3]}</p>
                    </div>
                  </div>
                );
              }
              const scrape = item.match(SCRAPE_ITEM);
              if (scrape) {
                return (
                  <div key={i} className="q-support-row">
                    <span className="q-support-ico"><BrandContextDev /></span>
                    <div>
                      <b>{scrape[1].replace(/^https?:\/\//, "").split("/")[0]}</b>
                      <p>Scraped {scrape[1]}{scrape[2]}</p>
                    </div>
                  </div>
                );
              }
              return (
                <p key={i} className="q-support-line">{item}</p>
              );
            })}
          </section>
        )}
        {sources.length > 0 && (
          <section>
            <h4>Sources</h4>
            {sources.map((s) => {
              const inner = (
                <>
                  <span className="q-support-ico">{sourceIcon(s)}</span>
                  <div>
                    <b>{s.label}</b>
                    {s.detail && <span className="q-support-dim"> · {s.detail}</span>}
                    {s.url && <p>{s.url}</p>}
                  </div>
                </>
              );
              return s.url ? (
                <a
                  key={s.label + (s.url ?? "")}
                  className="q-support-row is-link"
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  {inner}
                </a>
              ) : (
                <div key={s.label + (s.detail ?? "")} className="q-support-row">
                  {inner}
                </div>
              );
            })}
          </section>
        )}
      </div>
    </details>
  );
}

const STATUS_TAG: Record<string, { label: string; cls: string }> = {
  pass: { label: "Pass", cls: "is-pass" },
  needs_review: { label: "Needs review", cls: "is-review" },
  unassessed: { label: "Unassessed", cls: "is-unassessed" },
};

function MessageRow({
  msg,
  author,
  onAsk,
  onCapture,
  onCaptureCard,
  onViewActions,
}: {
  msg: Doc<"messages">;
  author?: Doc<"users">;
  onAsk?: (suggestion: { name: string; question: string }) => void;
  onCapture?: (msg: Doc<"messages">, authorName: string) => void;
  onCaptureCard?: (item: { title: string; summary: string }) => void;
  onViewActions?: () => void;
}) {
  const isAgent = msg.authorType === "agent";
  const name = isAgent ? "Quorum" : (author?.name ?? "Teammate");
  const role = isAgent ? "Agent" : author ? ROLE_LABEL[author.role] : "";

  /* A system line: no avatar, no chrome — the record itself. */
  if (msg.authorType === "system") {
    return <p className="q-sysline">{msg.content}</p>;
  }

  return (
    <div className={`q-msg${isAgent ? " is-agent" : ""}`}>
      <span className="q-msg-ava" aria-hidden="true">
        {isAgent ? (
          <QuorumLogo size={18} />
        ) : (
          <Avatar
            person={{ id: author?.externalId ?? "x", name }}
            size={20}
            showPresence={false}
          />
        )}
      </span>
      <div className="q-msg-main">
        <div className="q-msg-head">
          <b>{name}</b>
          <span>{role}</span>
          <time>{timeAgo(msg.createdAt)}</time>
        </div>
        {msg.content.split("\n").map((line, i) => (
          <p key={i} className="q-msg-text">
            {withMentions(line)}
          </p>
        ))}
        {msg.suggestion && onAsk && (
          <button
            type="button"
            className="q-ask-bar"
            onClick={() => onAsk(msg.suggestion!)}
            title={`Tags @${msg.suggestion.name} with the question — they reply in-thread`}
          >
            <IconMessage />
            Ask {msg.suggestion.name}
          </button>
        )}
        {msg.assessment && msg.assessment.length > 0 && (
          <div className="q-cards">
            {msg.assessment.map((item) => {
              const tag = STATUS_TAG[item.status] ?? STATUS_TAG.unassessed;
              return (
                <div key={item.criterion} className={`q-card ${tag.cls}`}>
                  <div className="q-card-head">
                    <b>{item.criterion}</b>
                    <span className={`q-tag ${tag.cls}`}>{tag.label}</span>
                  </div>
                  <p>{item.note}</p>
                  {item.status === "needs_review" && onCaptureCard && (
                    <button
                      type="button"
                      className="q-card-act"
                      onClick={() =>
                        onCaptureCard({
                          title: item.action ?? item.criterion,
                          summary: item.note,
                        })
                      }
                    >
                      + Add as action
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
        {isAgent && msg.messageKind === "summary" && onViewActions && (
          <button type="button" className="q-ask-bar" onClick={onViewActions}>
            <IconResolve />
            View action items
          </button>
        )}
        <SupportDropdown msg={msg} />
      </div>
      {onCapture && (
        <button
          type="button"
          className="q-msg-add"
          onClick={() => onCapture(msg, name)}
          title="Capture this message as an action"
        >
          + Action
        </button>
      )}
    </div>
  );
}

/** Title and status derived from the current subject. Just the
    element's name — the frame carries no other prose. */
export function useThreadMeta() {
  const { activeThread, selection } = useReviewSession();

  const title = activeThread
    ? activeThread.title
    : selection?.kind === "element"
      ? selection.label
      : selection
        ? "Region"
        : "Thread";

  return {
    title,
    hasSubject: Boolean(activeThread || selection),
    resolved: activeThread?.status === "resolved",
  };
}

/** The resolve control — an icon in the frame header. Resolving
    turns the discussion into outputs: the agent summarizes and
    suggests actions, which remain removable. */
export function ResolveButton() {
  const s = useReviewSession();
  if (!s.activeThread) return null;
  const resolved = s.activeThread.status === "resolved";
  return (
    <button
      type="button"
      className={`q-pop-icon q-resolve${resolved ? " is-ok" : ""}`}
      disabled={Boolean(s.agentRun)}
      onClick={() => void (resolved ? s.reopenActiveThread() : s.resolveActiveThread())}
      title={resolved ? "Resolved — click to reopen" : "Resolve — summarize and suggest actions"}
      aria-label={resolved ? "Reopen thread" : "Resolve thread"}
    >
      <IconResolve />
    </button>
  );
}

export function ThreadBody() {
  const s = useReviewSession();
  const { activeThread, messages, agentRun, composerText, userById } = s;
  const resolved = activeThread?.status === "resolved";
  const me = s.userByExternal(DEMO_USERS.designer);
  /* No messages yet: the frame is just its header and the input —
     an empty scroll box would read as broken UI. */
  const empty = messages.length === 0 && !agentRun;

  const listRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, agentRun]);

  /* ── the @mention dropdown ───────────────────────────────────── */
  const mentionMatch = composerText.match(/(?:^|\s)@(\w*)$/);
  const query = mentionMatch?.[1] ?? null;
  const [ddDismissed, setDdDismissed] = useState(false);
  const [ddIdx, setDdIdx] = useState(0);
  const options =
    query !== null && !ddDismissed
      ? MENTIONABLE.filter((n) => n.toLowerCase().startsWith(query.toLowerCase()))
      : [];

  const pick = (name: string) => {
    s.setComposerText(composerText.slice(0, composerText.length - (query?.length ?? 0)) + name + " ");
    setDdIdx(0);
  };

  const onComposerChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    s.setComposerText(e.target.value);
    setDdDismissed(false);
    setDdIdx(0);
  };

  const onComposerKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (options.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setDdIdx((i) => (i + 1) % options.length);
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setDdIdx((i) => (i - 1 + options.length) % options.length);
        return;
      }
      if (e.key === "Tab" || e.key === "Enter") {
        e.preventDefault();
        pick(options[Math.min(ddIdx, options.length - 1)]);
        return;
      }
      if (e.key === "Escape") {
        setDdDismissed(true);
        return;
      }
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void s.submitComposer();
    }
  };

  return (
    <div className="q-thread">
      {!empty && (
      <div ref={listRef} className="q-msgs">
        {messages.map((m) => (
          <MessageRow
            key={m._id}
            msg={m}
            author={m.authorUserId ? userById(m.authorUserId) : undefined}
            onAsk={resolved || agentRun ? undefined : (sug) => void s.askHuman(sug)}
            onCapture={
              resolved ? undefined : (msg, name) => void s.addMessageAsAction(msg, name)
            }
            onCaptureCard={resolved ? undefined : (item) => void s.addActionItem(item)}
            onViewActions={() => s.openSurface("actions")}
          />
        ))}
        {agentRun && (
          <div className="q-msg is-agent q-msg-live">
            <span className="q-msg-ava" aria-hidden="true">
              <QuorumLogo size={18} />
            </span>
            <div className="q-msg-main">
              <AgentSteps
                steps={agentRun.steps}
                title="Consulting sources"
                doneTitle="Sources consulted"
              />
            </div>
          </div>
        )}
      </div>
      )}

      <div className="q-composer">
        <div className="q-composer-inputwrap">
          {options.length > 0 && (
            <div className="q-mention-dd" role="listbox" aria-label="Tag a teammate">
              {options.map((name, i) => (
                <button
                  key={name}
                  type="button"
                  role="option"
                  aria-selected={i === ddIdx}
                  className={`q-mention-dd-row${i === ddIdx ? " is-on" : ""}`}
                  onMouseEnter={() => setDdIdx(i)}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    pick(name);
                  }}
                >
                  {name === "Quorum" ? (
                    <QuorumLogo size={16} />
                  ) : (
                    <Avatar person={{ id: name, name }} size={16} showPresence={false} />
                  )}
                  <span>{name}</span>
                  <span className="q-mention-dd-k">{i === ddIdx ? "⇥" : ""}</span>
                </button>
              ))}
            </div>
          )}
          <textarea
            className="q-composer-input"
            rows={2}
            placeholder={activeThread ? "Reply — @ to tag" : "Ask about this…"}
            value={composerText}
            onChange={onComposerChange}
            onKeyDown={onComposerKey}
          />
        </div>
        <div className="q-composer-row">
          {me ? (
            <Avatar
              person={{ id: me.externalId, name: me.name, role: "Designer" }}
              size={22}
              showPresence={false}
            />
          ) : (
            <span />
          )}
          <button
            type="button"
            className="q-btn is-primary"
            disabled={!composerText.trim()}
            onClick={() => void s.submitComposer()}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
