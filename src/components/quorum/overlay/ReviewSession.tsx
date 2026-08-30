"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import type { Doc, Id } from "../../../../convex/_generated/dataModel";
import type { AgentStep, Person, Rect, StepStatus } from "@/components/quorum/primitives";
import {
  AGENT_FAIL_TEXT,
  AGENT_STEP_LABELS,
  classifyQuestion,
  type AgentAnswer,
  type AgentKind,
} from "@/lib/quorum/agent-kinds";
import { DEMO_USERS, simulatedReplyFor } from "@/lib/quorum/demo-script";
import {
  PRIMARY_TARGET_KEY,
  selectorFor,
  targetByKey,
} from "@/lib/quorum/targets";
import { BrandAmplitude, BrandAtlassian, BrandContextDev } from "./icons";

/* ───────────────────────────────────────────────────────────────
   ReviewSession — the state and the verbs of a live review.

   One provider owns everything the overlay does: the Convex
   subscriptions (threads, messages, actions, presence — all
   realtime), the UI-local state from /docs/03 (mode, hover,
   selection, panel, popover), and the imperative API that both the
   visible chrome and the demo wizard drive. The wizard triggering
   the same functions the UI binds to is what makes a wizard step
   real behaviour rather than a screen swap.

   The acting user in this browser is Maya (Designer). Other
   participants write through the same Convex mutations — from a
   second window, or from the wizard playing the remote side.
   ─────────────────────────────────────────────────────────────── */

export type ElementSelection = {
  kind: "element";
  key?: string;
  selector: string;
  label: string;
  breadcrumb: string[];
  rect: Rect;
};
export type RegionSelection = { kind: "region"; rect: Rect };
export type Selection = ElementSelection | RegionSelection;

export type AgentRun = { kind: AgentKind; steps: AgentStep[] };

export type SurfaceName = "threads" | "actions" | null;

const PRESENCE_WINDOW_MS = 45_000;
const HEARTBEAT_MS = 20_000;

const ROLE_LABEL: Record<string, string> = {
  pm: "PM",
  designer: "Designer",
  engineer: "Engineer",
  agent: "Agent",
};

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/* Threads whose resolution gets a full agent synthesis. */
const SYNTH_TARGETS: string[] = [PRIMARY_TARGET_KEY, "income-card"];

export type ReviewSessionValue = {
  /* data (all realtime via Convex) */
  preview: Doc<"previews"> | null;
  users: Doc<"users">[];
  threads: Doc<"threads">[];
  activeThread: Doc<"threads"> | null;
  messages: Doc<"messages">[];
  actions: Doc<"actions">[];
  participants: Person[];
  userByExternal: (externalId: string) => Doc<"users"> | undefined;
  userById: (id: Id<"users">) => Doc<"users"> | undefined;
  openCount: number;
  resolvedCount: number;

  /* UI state */
  expanded: boolean;
  mode: "move" | "draw" | "select";
  selection: Selection | null;
  panelOpen: boolean;
  threadView: "popup" | "panel";
  surface: SurfaceName;
  agentRun: AgentRun | null;
  composerText: string;

  /* verbs — the same API for the UI and the wizard */
  expand: () => void;
  collapse: () => void;
  /** Promote the popup to the side panel; `from` is the popup's
      rect so the panel can grow out of it rather than slide in. */
  expandThread: (from?: Rect) => void;
  expandFrom: Rect | null;
  setMode: (mode: "move" | "draw" | "select") => void;
  select: (selection: Selection) => void;
  selectPrimaryTarget: () => boolean;
  selectTargetByKey: (key: string) => boolean;
  openThread: (id: Id<"threads">) => void;
  openPanel: () => void;
  closePanel: () => void;
  closeSurfaces: () => void;
  openSurface: (which: Exclude<SurfaceName, null>) => void;
  toggleSurface: (which: Exclude<SurfaceName, null>) => void;
  setComposerText: (text: string) => void;
  submitComposer: () => Promise<void>;
  typeAndSendAsDesigner: (text: string) => Promise<void>;
  sendAs: (externalId: string, text: string) => Promise<void>;
  askHuman: (suggestion: { name: string; question: string }) => Promise<void>;
  runAgent: (kind: AgentKind, question?: string) => Promise<boolean>;
  resolveActiveThread: () => Promise<void>;
  reopenActiveThread: () => Promise<void>;
  addToActions: () => Promise<boolean>;
  addMessageAsAction: (msg: Doc<"messages">, authorName: string) => Promise<void>;
  addActionItem: (item: { title: string; summary: string }) => Promise<void>;
  captureFailingCheck: () => Promise<boolean>;
  removeAction: (actionId: Id<"actions">) => Promise<void>;
  heartbeatAs: (externalId: string) => Promise<void>;
  resetDemoData: () => Promise<void>;
};

const Ctx = createContext<ReviewSessionValue | null>(null);

export function useReviewSession(): ReviewSessionValue {
  const value = useContext(Ctx);
  if (!value) throw new Error("useReviewSession outside ReviewSessionProvider");
  return value;
}

export function ReviewSessionProvider({ children }: { children: React.ReactNode }) {
  /* ── data ──────────────────────────────────────────────────── */
  const usersQ = useQuery(api.users.list);
  const users = useMemo(() => usersQ ?? [], [usersQ]);
  const preview = useQuery(api.previews.getByProjectKey, { projectKey: "malbank" }) ?? null;
  const threads =
    useQuery(api.threads.listByPreview, preview ? { previewId: preview._id } : "skip") ?? [];
  const actions =
    useQuery(api.actions.listByPreview, preview ? { previewId: preview._id } : "skip") ?? [];

  const [activeThreadId, setActiveThreadId] = useState<Id<"threads"> | null>(null);
  const messages =
    useQuery(api.messages.listByThread, activeThreadId ? { threadId: activeThreadId } : "skip") ??
    [];

  /* Presence: the window slides forward on a timer so stale rows
     age out without any writes. */
  const [presenceSince, setPresenceSince] = useState(() => Date.now() - PRESENCE_WINDOW_MS);
  useEffect(() => {
    const iv = setInterval(() => setPresenceSince(Date.now() - PRESENCE_WINDOW_MS), 15_000);
    return () => clearInterval(iv);
  }, []);
  const presenceQ = useQuery(
    api.presence.listActive,
    preview ? { previewId: preview._id, activeSince: presenceSince } : "skip",
  );
  const presence = useMemo(() => presenceQ ?? [], [presenceQ]);

  /* ── mutations ─────────────────────────────────────────────── */
  const createThread = useMutation(api.threads.create);
  const setThreadStatus = useMutation(api.threads.setStatus);
  const createMessage = useMutation(api.messages.create);
  const createAction = useMutation(api.actions.create);
  const heartbeat = useMutation(api.presence.heartbeat);
  const resetDemo = useMutation(api.seed.resetDemo);

  /* ── UI state ──────────────────────────────────────────────────
     Quorum starts folded into a launcher bubble: a viewer opening a
     review link has not necessarily come to review. Move is the
     default mode once expanded. */
  const [expanded, setExpanded] = useState(false);
  const [mode, setMode] = useState<"move" | "draw" | "select">("move");
  const [selection, setSelection] = useState<Selection | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [threadView, setThreadView] = useState<"popup" | "panel">("popup");
  const [expandFrom, setExpandFrom] = useState<Rect | null>(null);
  const [surface, setSurface] = useState<SurfaceName>(null);
  const [agentRun, setAgentRun] = useState<AgentRun | null>(null);
  const [composerText, setComposerText] = useState("");

  /* Refs mirror what async flows need, so a long agent run never
     acts on a stale closure. Mirrored after render, never during. */
  const activeThreadIdRef = useRef(activeThreadId);
  const selectionRef = useRef(selection);
  const previewRef = useRef(preview);
  const usersRef = useRef(users);
  const threadsRef = useRef(threads);
  const messagesRef = useRef(messages);
  const agentBusyRef = useRef(false);
  const runAgentRef = useRef<((kind: AgentKind, question?: string) => Promise<boolean>) | null>(
    null,
  );
  useEffect(() => {
    activeThreadIdRef.current = activeThreadId;
    selectionRef.current = selection;
    previewRef.current = preview;
    usersRef.current = users;
    threadsRef.current = threads;
    messagesRef.current = messages;
  });

  const userByExternal = useCallback(
    (externalId: string) => usersRef.current.find((u) => u.externalId === externalId),
    [],
  );
  const userById = useCallback(
    (id: Id<"users">) => usersRef.current.find((u) => u._id === id),
    [],
  );

  /* ── presence heartbeat: this browser is Maya ──────────────── */
  const heartbeatAs = useCallback(
    async (externalId: string) => {
      const p = previewRef.current;
      const u = usersRef.current.find((x) => x.externalId === externalId);
      if (!p || !u) return;
      await heartbeat({
        previewId: p._id,
        userId: u._id,
        surface: "playground",
        currentRoute: "/demo/playground",
      });
    },
    [heartbeat],
  );

  const mayaReady = Boolean(
    expanded && preview && users.some((u) => u.externalId === DEMO_USERS.designer),
  );
  useEffect(() => {
    if (!mayaReady) return;
    void heartbeatAs(DEMO_USERS.designer);
    const iv = setInterval(() => void heartbeatAs(DEMO_USERS.designer), HEARTBEAT_MS);
    return () => clearInterval(iv);
  }, [mayaReady, heartbeatAs]);

  /* ── selection & navigation ────────────────────────────────── */
  const select = useCallback((sel: Selection) => {
    setSelection(sel);
    setActiveThreadId(null);
    setPanelOpen(true);
    setThreadView("popup");
    setSurface(null);
    /* A committed target hands the pointer back to the product. */
    setMode("move");
  }, []);

  const selectTargetByKey = useCallback(
    (key: string): boolean => {
      const target = targetByKey(key);
      const el = document.querySelector(selectorFor(key));
      if (!target || !el) return false;
      el.scrollIntoView({ block: "nearest" });
      const r = el.getBoundingClientRect();
      select({
        kind: "element",
        key: target.key,
        selector: selectorFor(target.key),
        label: target.label,
        breadcrumb: target.breadcrumb,
        rect: { x: r.x, y: r.y, width: r.width, height: r.height },
      });
      return true;
    },
    [select],
  );
  const selectPrimaryTarget = useCallback(
    () => selectTargetByKey(PRIMARY_TARGET_KEY),
    [selectTargetByKey],
  );

  const openThread = useCallback((id: Id<"threads">) => {
    setActiveThreadId(id);
    setSelection(null);
    setPanelOpen(true);
    setThreadView("popup");
    setSurface(null);
  }, []);

  const closeSurfaces = useCallback(() => {
    setPanelOpen(false);
    setSurface(null);
  }, []);

  /* ── thread + message writes ───────────────────────────────── */
  const ensureThread = useCallback(async (): Promise<Id<"threads"> | null> => {
    if (activeThreadIdRef.current) return activeThreadIdRef.current;
    const sel = selectionRef.current;
    const p = previewRef.current;
    const maya = userByExternal(DEMO_USERS.designer);
    const rohan = userByExternal(DEMO_USERS.pm);
    const arun = userByExternal(DEMO_USERS.engineer);
    if (!sel || !p || !maya) return null;

    const anchor =
      sel.kind === "element"
        ? {
            type: "element" as const,
            selector: sel.selector,
            breadcrumb: sel.breadcrumb,
            rect: sel.rect,
          }
        : {
            type: "region" as const,
            x: sel.rect.x,
            y: sel.rect.y,
            width: sel.rect.width,
            height: sel.rect.height,
            viewportWidth: window.innerWidth,
            viewportHeight: window.innerHeight,
          };

    const threadId = await createThread({
      previewId: p._id,
      title: sel.kind === "element" ? sel.label : "Region note",
      anchor,
      createdByUserId: maya._id,
      participantIds: [maya._id, rohan?._id, arun?._id].filter(
        (x): x is Id<"users"> => Boolean(x),
      ),
    });
    activeThreadIdRef.current = threadId;
    setActiveThreadId(threadId);
    setSelection(null);
    return threadId;
  }, [createThread, userByExternal]);

  /* ── who a message summons ─────────────────────────────────────
     Tagging a teammate hands the thread to them: the agent stays
     silent and everyone waits for the human. Tagging @Quorum — or
     the local reviewer sending with no tags — summons the agent.
     Remote participants' untagged replies never auto-summon it. */
  const shouldAgentRespond = useCallback(
    (authorExternalId: string, text: string): boolean => {
      const mentions = Array.from(text.matchAll(/@(\w+)/g), (m) => m[1].toLowerCase());
      if (mentions.includes("quorum")) return true;
      const humanNames = usersRef.current
        .filter((u) => u.role !== "agent" && u.externalId !== authorExternalId)
        .map((u) => u.name.toLowerCase());
      const tagsHuman = mentions.some((m) => humanNames.some((n) => n.startsWith(m)));
      if (tagsHuman) return false;
      return authorExternalId === DEMO_USERS.designer;
    },
    [],
  );

  /* What the question is actually about: the live selection or the
     open thread's anchor. The server answers about this target, and
     gates fixture sources on the mapped key. */
  const targetInfoFor = useCallback((): {
    key: string | null;
    label?: string;
    selector?: string;
    breadcrumb?: string[];
  } => {
    const sel = selectionRef.current;
    if (sel?.kind === "element") {
      return {
        key: sel.key ?? null,
        label: sel.label,
        selector: sel.selector,
        breadcrumb: sel.breadcrumb,
      };
    }
    if (sel?.kind === "region") return { key: null, label: "region" };
    const thread = threadsRef.current.find((t) => t._id === activeThreadIdRef.current);
    const a = thread?.anchorData;
    if (a?.type === "element") {
      const m = a.selector.match(/\[data-quorum-target="([^"]+)"\]/);
      return {
        key: m ? m[1] : null,
        label: thread?.title,
        selector: a.selector,
        breadcrumb: a.breadcrumb,
      };
    }
    if (a?.type === "region") return { key: null, label: "region" };
    return { key: null };
  }, []);

  /* ── simulated teammates ───────────────────────────────────────
     A tagged human replies after a beat, written through the same
     Convex path a second window would use. A simulated reply that
     itself tags someone chains once more, so the scripted handoff
     (designer → PM → engineer) plays out from a single tag. */
  const simulateRef = useRef<
    ((text: string, authorExternalId: string, depth?: number) => void) | null
  >(null);
  const simulateTaggedReplies = useCallback(
    (text: string, authorExternalId: string, depth = 0) => {
      if (depth > 2) return;
      const mentions = Array.from(text.matchAll(/@(\w+)/g), (m) => m[1].toLowerCase());
      const tagged = usersRef.current.find(
        (u) =>
          u.role !== "agent" &&
          u.externalId !== authorExternalId &&
          u.externalId !== DEMO_USERS.designer &&
          mentions.some((m) => u.name.toLowerCase().startsWith(m)),
      );
      if (!tagged) return;

      const target = targetInfoFor();
      const prior = messagesRef.current
        .filter((m) => m.authorUserId === tagged._id)
        .map((m) => m.content);
      const reply = simulatedReplyFor(tagged.externalId, text, target, prior);
      const threadId = activeThreadIdRef.current;
      window.setTimeout(() => {
        void (async () => {
          if (activeThreadIdRef.current !== threadId || !threadId) return;
          await heartbeatAs(tagged.externalId);
          await createMessage({
            threadId,
            authorType: "human",
            authorUserId: tagged._id,
            content: reply,
            messageKind: reply.trim().endsWith("?") ? "question" : "reply",
            sourceType: "human",
          });
          /* Chain through a ref: the callback cannot name itself. */
          simulateRef.current?.(reply, tagged.externalId, depth + 1);
        })();
      }, 1400 + depth * 400);
    },
    [createMessage, heartbeatAs, targetInfoFor],
  );
  useEffect(() => {
    simulateRef.current = simulateTaggedReplies;
  }, [simulateTaggedReplies]);

  const sendAs = useCallback(
    async (externalId: string, text: string) => {
      const author = userByExternal(externalId);
      if (!author) return;
      /* Only the local reviewer can open a thread from a selection;
         remote participants need one to exist. */
      const threadId =
        externalId === DEMO_USERS.designer
          ? await ensureThread()
          : activeThreadIdRef.current;
      if (!threadId) return;
      await createMessage({
        threadId,
        authorType: "human",
        authorUserId: author._id,
        content: text,
        messageKind: text.trim().endsWith("?") ? "question" : "reply",
        sourceType: "human",
      });
      if (shouldAgentRespond(externalId, text)) {
        await runAgentRef.current?.(classifyQuestion(text), text);
      } else {
        simulateTaggedReplies(text, externalId);
      }
    },
    [createMessage, ensureThread, userByExternal, shouldAgentRespond, simulateTaggedReplies],
  );

  /* One tap on the agent's suggestion: the reviewer tags the named
     teammate with the original question — same path as typing it. */
  const askHuman = useCallback(
    (suggestion: { name: string; question: string }) =>
      sendAs(DEMO_USERS.designer, `@${suggestion.name} ${suggestion.question}`),
    [sendAs],
  );

  const submitComposer = useCallback(async () => {
    const text = composerText.trim();
    if (!text) return;
    setComposerText("");
    await sendAs(DEMO_USERS.designer, text);
  }, [composerText, sendAs]);

  /* The wizard's typing: fills the real composer character by
     character, then sends through the same path a person would. */
  const typeAndSendAsDesigner = useCallback(
    async (text: string) => {
      setPanelOpen(true);
      for (let i = 1; i <= text.length; i += 3) {
        setComposerText(text.slice(0, i));
        await sleep(14);
      }
      setComposerText(text);
      await sleep(180);
      setComposerText("");
      await sendAs(DEMO_USERS.designer, text);
    },
    [sendAs],
  );

  /* ── the agent ─────────────────────────────────────────────── */
  const runAgent = useCallback(
    async (kind: AgentKind, question?: string): Promise<boolean> => {
      const threadId = activeThreadIdRef.current;
      if (!threadId || agentBusyRef.current) return false;
      agentBusyRef.current = true;

      const labels = AGENT_STEP_LABELS[kind];
      /* Connector marks on the steps that read through one. */
      const stepIcon = (label: string): React.ReactNode => {
        if (/design review guidance/i.test(label)) return <BrandAtlassian />;
        if (/precedent metrics/i.test(label)) return <BrandAmplitude />;
        if (/identifying comparable|scraping/i.test(label)) return <BrandContextDev />;
        return undefined;
      };
      const setSteps = (done: number, currentStatus: StepStatus) =>
        setAgentRun({
          kind,
          steps: labels.map((label, i) => {
            const status = (
              i < done ? "done" : i === done ? currentStatus : "pending"
            ) as StepStatus;
            return {
              id: `${kind}-${i}`,
              label,
              /* A finished row shows its tick, not the connector. */
              icon: status === "done" ? undefined : stepIcon(label),
              status,
            };
          }),
        });

      setSteps(0, "running");
      const request = fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, question, target: targetInfoFor() }),
      })
        .then(async (r) => (r.ok ? ((await r.json()) as AgentAnswer) : null))
        .catch(() => null);

      let answer: AgentAnswer | null = null;
      let ok = true;
      for (let i = 0; i < labels.length; i++) {
        setSteps(i, "running");
        const waitsOnFetch = i >= labels.length - 2 && answer === null;
        if (waitsOnFetch) {
          const t0 = Date.now();
          answer = await request;
          const min = /fetch|scrap|identif/.test(labels[i].toLowerCase()) ? 1700 : 1100;
          const left = min - (Date.now() - t0);
          if (left > 0) await sleep(left);
          if (answer === null) {
            setSteps(i, "failed");
            ok = false;
            break;
          }
        } else {
          await sleep(1150);
        }
      }
      if (ok) {
        setSteps(labels.length, "done");
        await sleep(500);
      } else {
        await sleep(900);
      }

      const agentUser = userByExternal(DEMO_USERS.agent);
      const p = previewRef.current;

      if (ok && answer) {
        if (kind === "actions" && answer.actions && p) {
          for (const a of answer.actions) {
            await createAction({ previewId: p._id, threadId, ...a });
          }
        }
        await createMessage({
          threadId,
          authorType: "agent",
          authorUserId: agentUser?._id,
          content: answer.content,
          messageKind: kind === "actions" ? "summary" : "answer",
          sources: answer.sources,
          findings: answer.findings,
          suggestion: answer.suggestion,
          assessment: answer.assessment,
        });
      } else {
        await createMessage({
          threadId,
          authorType: "agent",
          authorUserId: agentUser?._id,
          content: AGENT_FAIL_TEXT[kind],
          messageKind: "status",
        });
      }

      setAgentRun(null);
      agentBusyRef.current = false;
      return ok;
    },
    [createAction, createMessage, userByExternal, targetInfoFor],
  );

  /* sendAs is declared before runAgent, so the summon goes through
     a ref that always points at the latest closure. */
  useEffect(() => {
    runAgentRef.current = runAgent;
  }, [runAgent]);

  /* Resolving is when the conversation becomes outputs. The thread
     is marked resolved first — a system line records it and by whom
     — then the agent generates the summary and the action items,
     which remain removable. Individual messages can be captured as
     actions at any time before that. */
  const resolveActiveThread = useCallback(async () => {
    const threadId = activeThreadIdRef.current;
    if (!threadId) return;
    const thread = threadsRef.current.find((t) => t._id === threadId);
    if (thread?.status === "resolved") return;

    await setThreadStatus({ threadId, status: "resolved" });
    const maya = userByExternal(DEMO_USERS.designer);
    await createMessage({
      threadId,
      authorType: "system",
      content: `This conversation was marked resolved by ${maya?.name ?? "Maya"} (Designer).`,
      messageKind: "status",
    });

    const key = targetInfoFor().key;
    if (key && SYNTH_TARGETS.includes(key) && messagesRef.current.length >= 3) {
      await runAgentRef.current?.("actions");
    } else {
      const agentUser = userByExternal(DEMO_USERS.agent);
      const count = thread?.actionCount ?? 0;
      await createMessage({
        threadId,
        authorType: "agent",
        authorUserId: agentUser?._id,
        content: `Summary: ${messagesRef.current.length} messages, ${count} action${count === 1 ? "" : "s"} captured. Anything still open can be added from a message.`,
        messageKind: "summary",
      });
    }
  }, [setThreadStatus, targetInfoFor, userByExternal, createMessage]);

  const reopenActiveThread = useCallback(async () => {
    const threadId = activeThreadIdRef.current;
    if (!threadId) return;
    await setThreadStatus({ threadId, status: "open" });
  }, [setThreadStatus]);

  const addToActions = useCallback(() => runAgent("actions"), [runAgent]);

  /* Capture one message as an action — the pre-resolve path. The
     title is a distilled imperative, not the raw message, and the
     thread gets a quiet confirmation line. */
  const addMessageAsAction = useCallback(
    async (msg: Doc<"messages">, authorName: string) => {
      const p = previewRef.current;
      if (!p) return;
      const target = targetInfoFor();
      const clean = msg.content.replace(/\s+/g, " ").trim();
      let title = (clean.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? clean).replace(/[.!?]$/, "");
      title = title.replace(
        /^(i think|i'd say|maybe|so|well|also|then|let's|lets|we can|we should|we could|checked(?: the code)?(?: —|-)?|proposal:?)\s+/i,
        "",
      );
      title = title.charAt(0).toUpperCase() + title.slice(1);
      if (title.length > 64) title = `${title.slice(0, 61).replace(/\s+\S*$/, "")}…`;

      await createAction({
        previewId: p._id,
        threadId: msg.threadId,
        title,
        summary: `From ${authorName} in the thread: “${clean.slice(0, 220)}${clean.length > 220 ? "…" : ""}”`,
        targetDescription:
          target.breadcrumb && target.breadcrumb.length > 0
            ? target.breadcrumb.join(" / ")
            : (target.label ?? "Thread target"),
        scopeNotes: `Captured from ${authorName}'s message in the thread.`,
        acceptanceNotes: "Refine scope and acceptance before implementation.",
      });

      const agentUser = userByExternal(DEMO_USERS.agent);
      await createMessage({
        threadId: msg.threadId,
        authorType: "agent",
        authorUserId: agentUser?._id,
        content: `Added as an action: “${title}”`,
        messageKind: "status",
      });
    },
    [createAction, createMessage, targetInfoFor, userByExternal],
  );

  /* One structured item — used by the review-card inline capture. */
  const addActionItem = useCallback(
    async (item: { title: string; summary: string }) => {
      const p = previewRef.current;
      const threadId = activeThreadIdRef.current;
      if (!p || !threadId) return;
      const target = targetInfoFor();
      await createAction({
        previewId: p._id,
        threadId,
        title: item.title,
        summary: item.summary,
        targetDescription:
          target.breadcrumb && target.breadcrumb.length > 0
            ? target.breadcrumb.join(" / ")
            : (target.label ?? "Thread target"),
        scopeNotes: "Captured from the usability review assessment.",
        acceptanceNotes: "The failing check passes on re-review.",
      });
      const agentUser = userByExternal(DEMO_USERS.agent);
      await createMessage({
        threadId,
        authorType: "agent",
        authorUserId: agentUser?._id,
        content: `Added as an action: “${item.title}”`,
        messageKind: "status",
      });
    },
    [createAction, createMessage, targetInfoFor, userByExternal],
  );

  /* The wizard's version of clicking the failing card's button. */
  const captureFailingCheck = useCallback(async (): Promise<boolean> => {
    const withCards = [...messagesRef.current]
      .reverse()
      .find((m) => m.assessment && m.assessment.some((a) => a.status === "needs_review"));
    const item = withCards?.assessment?.find((a) => a.status === "needs_review");
    if (!item) return false;
    await addActionItem({ title: item.action ?? item.criterion, summary: item.note });
    return true;
  }, [addActionItem]);

  const removeActionMutation = useMutation(api.actions.remove);
  const removeAction = useCallback(
    async (actionId: Id<"actions">) => {
      await removeActionMutation({ actionId });
    },
    [removeActionMutation],
  );

  const resetDemoData = useCallback(async () => {
    await resetDemo({});
    setActiveThreadId(null);
    setSelection(null);
    setAgentRun(null);
    setPanelOpen(false);
    setSurface(null);
    setComposerText("");
  }, [resetDemo]);

  /* ── derived ───────────────────────────────────────────────── */
  const activeThread = threads.find((t) => t._id === activeThreadId) ?? null;
  const openCount = threads.filter((t) => t.status === "open").length;
  const resolvedCount = threads.length - openCount;

  const liveUserIds = useMemo(() => new Set(presence.map((p) => p.userId)), [presence]);
  const participants: Person[] = useMemo(
    () =>
      users
        .filter((u) => u.role !== "agent")
        .map((u) => ({
          id: u.externalId,
          name: u.name,
          role: ROLE_LABEL[u.role] ?? u.role,
          active: liveUserIds.has(u._id),
        })),
    [users, liveUserIds],
  );

  const expand = useCallback(() => setExpanded(true), []);
  const collapse = useCallback(() => {
    setExpanded(false);
    setMode("move");
    setPanelOpen(false);
    setSurface(null);
    setSelection(null);
  }, []);
  const expandThread = useCallback((from?: Rect) => {
    setExpandFrom(from ?? null);
    setThreadView("panel");
  }, []);

  const value: ReviewSessionValue = {
    preview,
    users,
    threads,
    activeThread,
    messages,
    actions,
    participants,
    userByExternal,
    userById,
    openCount,
    resolvedCount,

    expanded,
    mode,
    selection,
    panelOpen,
    threadView,
    surface,
    agentRun,
    composerText,

    expand,
    collapse,
    expandThread,
    expandFrom,
    setMode,
    select,
    selectPrimaryTarget,
    selectTargetByKey,
    openThread,
    openPanel: () => setPanelOpen(true),
    closePanel: () => setPanelOpen(false),
    closeSurfaces,
    openSurface: (which) => setSurface(which),
    toggleSurface: (which) => setSurface((cur) => (cur === which ? null : which)),
    setComposerText,
    submitComposer,
    typeAndSendAsDesigner,
    sendAs,
    askHuman,
    runAgent,
    resolveActiveThread,
    reopenActiveThread,
    addToActions,
    addMessageAsAction,
    addActionItem,
    captureFailingCheck,
    removeAction,
    heartbeatAs,
    resetDemoData,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
