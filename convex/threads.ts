import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const status = v.union(v.literal("open"), v.literal("resolved"));
const anchor = v.union(
  v.object({
    type: v.literal("element"),
    selector: v.string(),
    breadcrumb: v.array(v.string()),
    rect: v.optional(
      v.object({ x: v.number(), y: v.number(), width: v.number(), height: v.number() }),
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

export const get = query({
  args: { threadId: v.id("threads") },
  handler: ({ db }, { threadId }) => db.get(threadId),
});

export const listByPreview = query({
  args: { previewId: v.id("previews"), status: v.optional(status) },
  handler: ({ db }, args) => {
    if (args.status) {
      return db
        .query("threads")
        .withIndex("by_preview_status", (q) =>
          q.eq("previewId", args.previewId).eq("status", args.status!),
        )
        .order("desc")
        .collect();
    }
    return db
      .query("threads")
      .withIndex("by_preview", (q) => q.eq("previewId", args.previewId))
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    previewId: v.id("previews"),
    title: v.string(),
    anchor,
    createdByUserId: v.id("users"),
    participantIds: v.array(v.id("users")),
  },
  handler: async ({ db }, args) => {
    if (!(await db.get(args.previewId))) throw new Error("Preview not found");
    if (!(await db.get(args.createdByUserId))) throw new Error("Creating user not found");

    const now = Date.now();
    const participantIds = Array.from(
      new Set([args.createdByUserId, ...args.participantIds]),
    );

    return db.insert("threads", {
      previewId: args.previewId,
      title: args.title.trim(),
      status: "open",
      anchorType: args.anchor.type,
      anchorData: args.anchor,
      createdByUserId: args.createdByUserId,
      createdAt: now,
      updatedAt: now,
      participantIds,
      actionCount: 0,
    });
  },
});

export const setStatus = mutation({
  args: { threadId: v.id("threads"), status },
  handler: async ({ db }, { threadId, status: nextStatus }) => {
    if (!(await db.get(threadId))) throw new Error("Thread not found");
    await db.patch(threadId, { status: nextStatus, updatedAt: Date.now() });
  },
});
