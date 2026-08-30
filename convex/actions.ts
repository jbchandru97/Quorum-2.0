import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listByPreview = query({
  args: { previewId: v.id("previews") },
  handler: ({ db }, { previewId }) =>
    db.query("actions").withIndex("by_preview", (q) => q.eq("previewId", previewId)).order("desc").collect(),
});

export const create = mutation({
  args: {
    previewId: v.id("previews"),
    threadId: v.id("threads"),
    title: v.string(),
    summary: v.string(),
    targetDescription: v.string(),
    scopeNotes: v.string(),
    acceptanceNotes: v.string(),
  },
  handler: async ({ db }, args) => {
    const thread = await db.get(args.threadId);
    if (!thread || thread.previewId !== args.previewId) throw new Error("Thread not found in preview");

    const actionId = await db.insert("actions", {
      ...args,
      status: "created",
      createdAt: Date.now(),
    });
    await db.patch(args.threadId, {
      actionCount: thread.actionCount + 1,
      updatedAt: Date.now(),
    });
    return actionId;
  },
});

export const setStatus = mutation({
  args: {
    actionId: v.id("actions"),
    status: v.union(v.literal("created"), v.literal("done")),
  },
  handler: async ({ db }, { actionId, status }) => {
    if (!(await db.get(actionId))) throw new Error("Action not found");
    await db.patch(actionId, { status });
  },
});
