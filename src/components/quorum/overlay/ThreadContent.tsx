"use client";

import { useEffect, useRef, useState } from "react";
import type { Doc } from "../../../../convex/_generated/dataModel";
import {
  AgentSteps,
  Avatar,
  SourceChip,
  SourceChips,
} from "@/components/quorum/primitives";
import { timeAgo } from "@/lib/quorum/relative-time";
import { QuorumMark } from "../QuorumMark";
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

function MessageRow({
  msg,
  author,
  onAsk,
  onCapture,
}: {
  msg: Doc<"messages">;
  author?: Doc<"users">;
  onAsk?: (suggestion: { name: string; question: string }) => void;
  onCapture?: (msg: Doc<"messages">, authorName: string) => void;
}) {
  const isAgent = msg.authorType === "agent";
  const name = isAgent ? "Quorum" : (author?.name ?? "Teammate");
  const role = isAgent ? "Agent" : author ? ROLE_LABEL[author.role] : "";

  return (
    <div className={`q-msg${isAgent ? " is-agent" : ""}`}>
      <span className="q-msg-ava" aria-hidden="true">
        {isAgent ? (
          <QuorumMark size={18} />
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
        {msg.findings && msg.findings.items.length > 0 && (
          <details className="q-findings">
            <summary>
              {msg.findings.title} · {msg.findings.items.length}
            </summary>
            <ul>
              {msg.findings.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </details>
        )}
        {msg.sources && msg.sources.length > 0 && (
          <div className="q-msg-sources">
            <SourceChips>
              {msg.sources.map((s) => (
                <SourceChip
                  key={s.label + (s.url ?? "")}
                  label={s.label}
                  provenance={s.provenance}
                  href={s.url}
                  detail={s.detail}
                />
              ))}
            </SourceChips>
          </div>
        )}
        {msg.suggestion && onAsk && (
          <button
            type="button"
            className="q-ask-bar"
            onClick={() => onAsk(msg.suggestion!)}
            title={`Tags @${msg.suggestion.name} with the question — they reply in-thread`}
          >
            Ask {msg.suggestion.name}
          </button>
        )}
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
      <svg viewBox="0 0 14 14" aria-hidden="true">
        <path d="M3 7.4l2.6 2.6L11 4.6" />
      </svg>
    </button>
  );
}

export function ThreadBody() {
  const s = useReviewSession();
  const { activeThread, messages, agentRun, composerText, userById } = s;
  const resolved = activeThread?.status === "resolved";

  const listRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, agentRun]);

  /* Tagged a teammate → the thread is theirs until they answer. */
  const last = messages[messages.length - 1];
  const waitingOn =
    last && last.authorType === "human"
      ? (last.content.match(/@(Rohan|Arun|Maya)\b/i)?.[1] ?? null)
      : null;

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
          />
        ))}
        {agentRun && (
          <div className="q-msg is-agent q-msg-live">
            <span className="q-msg-ava" aria-hidden="true">
              <QuorumMark size={18} />
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
        {!agentRun && waitingOn && (
          <p className="q-thread-waiting">
            waiting for <span className="q-mention">@{waitingOn}</span> to reply
          </p>
        )}
      </div>

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
                    <QuorumMark size={16} />
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
