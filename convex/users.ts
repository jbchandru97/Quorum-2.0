import { query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: ({ db }) => db.query("users").collect(),
});

export const getByExternalId = query({
  args: { externalId: v.string() },
  handler: ({ db }, { externalId }) =>
    db.query("users").withIndex("by_external_id", (q) => q.eq("externalId", externalId)).unique(),
});
