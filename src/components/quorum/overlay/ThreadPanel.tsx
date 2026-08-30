"use client";

import { useEffect, useRef } from "react";
import type { Doc } from "../../../../convex/_generated/dataModel";
import {
  AgentSteps,
  Avatar,
  SidePanel,
  SourceChip,
  SourceChips,
} from "@/components/quorum/primitives";
import { timeAgo } from "@/lib/quorum/relative-time";
import { QuorumMark } from "../QuorumMark";
import { useReviewSession } from "./ReviewSession";

/* ───────────────────────────────────────────────────────────────
   ThreadPanel — the conversation surface.

   Target summary, the mixed human/agent conversation, the live
   agent thinking steps, a composer with mentions, and the two
   outcomes a thread can have: Resolve, and Add to actions.
   ─────────────────────────────────────────────────────────────── */

const ROLE_LABEL: Record<string, string> = {
  pm: "PM",
  designer: "Designer",
  engineer: "Engineer",
  agent: "Agent",
};

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
}: {
  msg: Doc<"messages">;
  author?: Doc<"users">;
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
      </div>
    </div>
  );
}

export function ThreadPanel() {
  const s = useReviewSession();
  const {
    activeThread,
    selection,
    messages,
    agentRun,
    panelOpen,
    composerText,
    userById,
  } = s;

  const hasSubject = Boolean(activeThread || selection);
  const open = panelOpen && hasSubject;

  const listRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, agentRun]);

  const breadcrumb =
    activeThread?.anchorData.type === "element"
      ? activeThread.anchorData.breadcrumb
      : selection?.kind === "element"
        ? selection.breadcrumb
        : [];

  const title = activeThread
    ? activeThread.title
    : selection?.kind === "element"
      ? `New thread · ${selection.label}`
      : selection
        ? "New thread · region"
        : "No thread selected";

  const subtitle =
    breadcrumb.length > 0
      ? breadcrumb.join(" / ")
      : activeThread?.anchorData.type === "region" || selection?.kind === "region"
        ? "region anchor"
        : undefined;

  const resolved = activeThread?.status === "resolved";

  /* Tagged a teammate → the thread is theirs until they answer.
     Shown only while the tag is the latest word in the thread. */
  const last = messages[messages.length - 1];
  const waitingOn =
    last && last.authorType === "human"
      ? (last.content.match(/@(Rohan|Arun|Maya)\b/i)?.[1] ?? null)
      : null;

  const onComposerKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void s.submitComposer();
    }
  };

  return (
    <SidePanel
      open={open}
      onClose={s.closePanel}
      onRailClick={() => (open ? s.closePanel() : s.openPanel())}
      railLabel="thread"
      title={title}
      subtitle={subtitle}
      width={404}
      footer={
        activeThread ? (
          <div className="q-thread-foot">
            <button
              type="button"
              className={`q-btn${resolved ? " is-ok" : ""}`}
              onClick={() => void (resolved ? s.reopenActiveThread() : s.resolveActiveThread())}
            >
              {resolved ? "Resolved ✓" : "Resolve"}
            </button>
            <button
              type="button"
              className="q-btn"
              disabled={Boolean(agentRun)}
              onClick={() => void s.addToActions()}
              title="The agent synthesizes action items from this discussion"
            >
              Add to actions
            </button>
          </div>
        ) : undefined
      }
    >
      <div className="q-thread">
        <div ref={listRef} className="q-msgs">
          {!activeThread && selection && (
            <p className="q-thread-hint">
              Start the thread: ask a question about this{" "}
              {selection.kind === "element" ? "element" : "region"}. The team and the
              agent answer here.
            </p>
          )}
          {messages.map((m) => (
            <MessageRow
              key={m._id}
              msg={m}
              author={m.authorUserId ? userById(m.authorUserId) : undefined}
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
          <div className="q-composer-mentions">
            {["Quorum", "Rohan", "Arun"].map((name) => (
              <button
                key={name}
                type="button"
                className="q-mention-btn"
                onClick={() =>
                  s.setComposerText(
                    composerText.endsWith(" ") || composerText === ""
                      ? `${composerText}@${name} `
                      : `${composerText} @${name} `,
                  )
                }
              >
                @{name}
              </button>
            ))}
          </div>
          <textarea
            className="q-composer-input"
            rows={2}
            placeholder={activeThread ? "Reply — @ to tag a teammate" : "Ask about this target…"}
            value={composerText}
            onChange={(e) => s.setComposerText(e.target.value)}
            onKeyDown={onComposerKey}
          />
          <div className="q-composer-row">
            <span className="q-composer-as">as Maya · Designer</span>
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
    </SidePanel>
  );
}
