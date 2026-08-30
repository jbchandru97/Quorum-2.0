import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

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

export const listByThread = query({
  args: { threadId: v.id("threads") },
  handler: ({ db }, { threadId }) =>
    db.query("messages").withIndex("by_thread", (q) => q.eq("threadId", threadId)).collect(),
});

export const create = mutation({
  args: {
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
  },
  handler: async ({ db }, args) => {
    const thread = await db.get(args.threadId);
    if (!thread) throw new Error("Thread not found");
    if (args.authorUserId && !(await db.get(args.authorUserId))) throw new Error("Author not found");

    const createdAt = Date.now();
    const messageId = await db.insert("messages", { ...args, content: args.content.trim(), createdAt });
    await db.patch(args.threadId, { updatedAt: createdAt });
    return messageId;
  },
});
