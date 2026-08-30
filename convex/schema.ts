import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const userRole = v.union(
  v.literal("pm"),
  v.literal("designer"),
  v.literal("engineer"),
  v.literal("agent"),
);

const threadStatus = v.union(v.literal("open"), v.literal("resolved"));

const anchorData = v.union(
  v.object({
    type: v.literal("element"),
    selector: v.string(),
    breadcrumb: v.array(v.string()),
    rect: v.optional(
      v.object({
        x: v.number(),
        y: v.number(),
        width: v.number(),
        height: v.number(),
      }),
    ),
  }),
  v.object({
    type: v.literal("region"),
    x: v.number(),
    y: v.number(),
    width: v.number(),
    height: v.number(),
    viewportWidth: v.number(),
    viewportHeight: v.number(),
  }),
);

const authorType = v.union(v.literal("human"), v.literal("agent"), v.literal("system"));
const messageKind = v.union(
  v.literal("question"),
  v.literal("answer"),
  v.literal("reply"),
  v.literal("summary"),
  v.literal("status"),
);
const sourceType = v.union(
  v.literal("repo"),
  v.literal("internal_doc"),
  v.literal("analytics"),
  v.literal("context_dev"),
  v.literal("human"),
  v.literal("system"),
);

/* Source chips under an answer. Provenance matches the design
   system's marks: fetched / cited / inferred / human. */
const messageSource = v.object({
  label: v.string(),
  provenance: v.union(
    v.literal("fetched"),
    v.literal("cited"),
    v.literal("inferred"),
    v.literal("human"),
  ),
  url: v.optional(v.string()),
  detail: v.optional(v.string()),
});

export default defineSchema({
  users: defineTable({
    externalId: v.string(),
    name: v.string(),
    role: userRole,
    avatarUrl: v.optional(v.string()),
    isActive: v.boolean(),
    note: v.optional(v.string()),
  }).index("by_external_id", ["externalId"]),

  previews: defineTable({
    externalId: v.string(),
    name: v.string(),
    url: v.string(),
    projectKey: v.string(),
    createdAt: v.number(),
    introUrl: v.optional(v.string()),
    sourceOfTruth: v.optional(v.string()),
    note: v.optional(v.string()),
  })
    .index("by_external_id", ["externalId"])
    .index("by_project_key", ["projectKey"]),

  threads: defineTable({
    previewId: v.id("previews"),
    title: v.string(),
    status: threadStatus,
    anchorType: v.union(v.literal("element"), v.literal("region")),
    anchorData,
    createdByUserId: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
    participantIds: v.array(v.id("users")),
    actionCount: v.number(),
  })
    .index("by_preview", ["previewId"])
    .index("by_preview_status", ["previewId", "status"]),

  messages: defineTable({
    threadId: v.id("threads"),
    authorType,
    authorUserId: v.optional(v.id("users")),
    content: v.string(),
    messageKind,
    sourceType: v.optional(sourceType),
    sourceMeta: v.optional(
      v.object({
        title: v.optional(v.string()),
        url: v.optional(v.string()),
        excerpt: v.optional(v.string()),
      }),
    ),
    sources: v.optional(v.array(messageSource)),
    /* Collapsible supporting evidence: shown folded under the
       answer, so uncertain findings never masquerade as the verdict. */
    findings: v.optional(
      v.object({
        title: v.string(),
        items: v.array(v.string()),
      }),
    ),
    /* One-tap follow-through when the agent recommends a human:
       "Ask Arun" sends the tag + question without retyping. */
    suggestion: v.optional(
      v.object({
        name: v.string(),
        question: v.string(),
      }),
    ),
    createdAt: v.number(),
  }).index("by_thread", ["threadId"]),

  actions: defineTable({
    previewId: v.id("previews"),
    threadId: v.id("threads"),
    title: v.string(),
    summary: v.string(),
    targetDescription: v.string(),
    scopeNotes: v.string(),
    acceptanceNotes: v.string(),
    status: v.literal("created"),
    createdAt: v.number(),
  })
    .index("by_preview", ["previewId"])
    .index("by_thread", ["threadId"]),

  presence: defineTable({
    previewId: v.id("previews"),
    userId: v.id("users"),
    surface: v.union(v.literal("playground"), v.literal("workspace")),
    currentRoute: v.string(),
    lastSeenAt: v.number(),
  })
    .index("by_preview_user", ["previewId", "userId"])
    .index("by_preview_last_seen", ["previewId", "lastSeenAt"]),
});
