import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const surface = v.union(v.literal("playground"), v.literal("workspace"));

export const listActive = query({
  args: { previewId: v.id("previews"), activeSince: v.number() },
  handler: ({ db }, { previewId, activeSince }) =>
    db
      .query("presence")
      .withIndex("by_preview_last_seen", (q) =>
        q.eq("previewId", previewId).gte("lastSeenAt", activeSince),
      )
      .collect(),
});

export const heartbeat = mutation({
  args: {
    previewId: v.id("previews"),
    userId: v.id("users"),
    surface,
    currentRoute: v.string(),
  },
  handler: async ({ db }, args) => {
    const existing = await db
      .query("presence")
      .withIndex("by_preview_user", (q) =>
        q.eq("previewId", args.previewId).eq("userId", args.userId),
      )
      .unique();
    const lastSeenAt = Date.now();

    if (existing) {
      await db.patch(existing._id, { ...args, lastSeenAt });
      return existing._id;
    }
    return db.insert("presence", { ...args, lastSeenAt });
  },
});
