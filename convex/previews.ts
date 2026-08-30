import { query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: ({ db }) => db.query("previews").collect(),
});

export const getByProjectKey = query({
  args: { projectKey: v.string() },
  handler: ({ db }, { projectKey }) =>
    db.query("previews").withIndex("by_project_key", (q) => q.eq("projectKey", projectKey)).unique(),
});
