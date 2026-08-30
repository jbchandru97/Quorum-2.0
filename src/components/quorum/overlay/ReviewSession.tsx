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
import { DEMO_USERS } from "@/lib/quorum/demo-script";
import {
  PRIMARY_TARGET_KEY,
  selectorFor,
  targetByKey,
} from "@/lib/quorum/targets";

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
  mode: "flow" | "inspect";
  selection: Selection | null;
  panelOpen: boolean;
  surface: SurfaceName;
  agentRun: AgentRun | null;
  composerText: string;

  /* verbs — the same API for the UI and the wizard */
  setMode: (mode: "flow" | "inspect") => void;
  select: (selection: Selection) => void;
  selectPrimaryTarget: () => boolean;
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
  runAgent: (kind: AgentKind, question?: string) => Promise<boolean>;
  resolveActiveThread: () => Promise<void>;
  reopenActiveThread: () => Promise<void>;
  addToActions: () => Promise<boolean>;
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
  const threadsQ = useQuery(
    api.threads.listByPreview,
    preview ? { previewId: preview._id } : "skip",
  );
  const threads = useMemo(() => threadsQ ?? [], [threadsQ]);
  const actions =
    useQuery(api.actions.listByPreview, preview ? { previewId: preview._id } : "skip") ?? [];

  const [activeThreadId, setActiveThreadId] = useState<Id<"threads"> | null>(null);
  const messagesQ = useQuery(
    api.messages.listByThread,
    activeThreadId ? { threadId: activeThreadId } : "skip",
  );
  const messages = useMemo(() => messagesQ ?? [], [messagesQ]);

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
     Free flow is the default: the host product stays fully usable
     until the reviewer explicitly picks up the Inspect tool. */
  const [mode, setMode] = useState<"flow" | "inspect">("flow");
  const [selection, setSelection] = useState<Selection | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
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

  const mayaReady = Boolean(preview && users.some((u) => u.externalId === DEMO_USERS.designer));
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
    setSurface(null);
    /* A committed target hands the pointer back to the product. */
    setMode("flow");
  }, []);

  const selectPrimaryTarget = useCallback((): boolean => {
    const target = targetByKey(PRIMARY_TARGET_KEY);
    const el = document.querySelector(selectorFor(PRIMARY_TARGET_KEY));
    if (!target || !el) return false;
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
  }, [select]);

  const openThread = useCallback((id: Id<"threads">) => {
    setActiveThreadId(id);
    setSelection(null);
    setPanelOpen(true);
    setSurface(null);
  }, []);

  const closeSurfaces = useCallback(() => {
    setPanelOpen(false);
    setSurface(null);
  }, []);

  /* Deep link: /demo/playground?review=1&thread=<id> opens that
     thread's panel as soon as the thread list arrives. One-shot. */
  const deepLinkDone = useRef(false);
  useEffect(() => {
    if (deepLinkDone.current || threads.length === 0) return;
    deepLinkDone.current = true;
    const wanted = new URLSearchParams(window.location.search).get("thread");
    const t = wanted ? threads.find((x) => x._id === wanted) : undefined;
    if (!t) return;
    const timer = setTimeout(() => openThread(t._id), 0);
    return () => clearTimeout(timer);
  }, [threads, openThread]);

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

  /* The scripted target is the only one the fixture docs cover; the
     server gates its internal sources on this key. */
  const targetKeyFor = useCallback((): string | null => {
    const sel = selectionRef.current;
    if (sel?.kind === "element" && sel.key) return sel.key;
    const thread = threadsRef.current.find((t) => t._id === activeThreadIdRef.current);
    const a = thread?.anchorData;
    if (a?.type === "element") {
      const m = a.selector.match(/\[data-quorum-target="([^"]+)"\]/);
      if (m) return m[1];
    }
    return null;
  }, []);

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
      }
    },
    [createMessage, ensureThread, userByExternal, shouldAgentRespond],
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
      const setSteps = (done: number, currentStatus: StepStatus) =>
        setAgentRun({
          kind,
          steps: labels.map((label, i) => ({
            id: `${kind}-${i}`,
            label,
            status: (i < done ? "done" : i === done ? currentStatus : "pending") as StepStatus,
          })),
        });

      setSteps(0, "running");
      const request = fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, question, targetKey: targetKeyFor() }),
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
          const min = labels[i].toLowerCase().includes("fetch") ? 900 : 650;
          const left = min - (Date.now() - t0);
          if (left > 0) await sleep(left);
          if (answer === null) {
            setSteps(i, "failed");
            ok = false;
            break;
          }
        } else {
          await sleep(700);
        }
      }
      if (ok) {
        setSteps(labels.length, "done");
        await sleep(280);
      } else {
        await sleep(650);
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
    [createAction, createMessage, userByExternal, targetKeyFor],
  );

  /* sendAs is declared before runAgent, so the summon goes through
     a ref that always points at the latest closure. */
  useEffect(() => {
    runAgentRef.current = runAgent;
  }, [runAgent]);

  const resolveActiveThread = useCallback(async () => {
    const threadId = activeThreadIdRef.current;
    if (!threadId) return;
    await setThreadStatus({ threadId, status: "resolved" });
  }, [setThreadStatus]);

  const reopenActiveThread = useCallback(async () => {
    const threadId = activeThreadIdRef.current;
    if (!threadId) return;
    await setThreadStatus({ threadId, status: "open" });
  }, [setThreadStatus]);

  /* The synthesis reads the thread: the last human question (or
     message) rides along so the action copy reflects it. */
  const addToActions = useCallback(() => {
    const humans = messages.filter((m) => m.authorType === "human");
    const lastQuestion =
      [...humans].reverse().find((m) => m.messageKind === "question")?.content ??
      humans[humans.length - 1]?.content;
    return runAgent("actions", lastQuestion);
  }, [runAgent, messages]);

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

    mode,
    selection,
    panelOpen,
    surface,
    agentRun,
    composerText,

    setMode,
    select,
    selectPrimaryTarget,
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
    runAgent,
    resolveActiveThread,
    reopenActiveThread,
    addToActions,
    heartbeatAs,
    resetDemoData,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
