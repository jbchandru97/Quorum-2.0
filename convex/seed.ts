import { mutation } from "./_generated/server";

const users = [
  { externalId: "u_maya", name: "Maya", role: "designer" as const, isActive: true, note: "Primary reviewer. Opens the first threads." },
  { externalId: "u_rohan", name: "Rohan", role: "pm" as const, isActive: true, note: "Built v1 of the flow. Holds the undocumented rationale and the timeline constraint." },
  { externalId: "u_arun", name: "Arun", role: "engineer" as const, isActive: true, note: "Joins when implementation scope comes up." },
  { externalId: "u_agent", name: "Quorum", role: "agent" as const, isActive: true, note: "Pseudo-user so agent messages have an author in the same shape as everyone else." },
];

const preview = {
  externalId: "pv_malbank",
  name: "Malbank / Aql AI",
  projectKey: "malbank",
  url: "/demo/playground",
  introUrl: "/demo/intro",
  sourceOfTruth: "https://mal-ai-three.vercel.app",
  note: "The cloned host app that ships inside Quorum. Reviewed at /demo/playground.",
};

export const demo = mutation({
  args: {},
  handler: async ({ db }) => {
    const userIds = [];
    for (const user of users) {
      const existing = await db
        .query("users")
        .withIndex("by_external_id", (q) => q.eq("externalId", user.externalId))
        .unique();
      if (existing) {
        await db.patch(existing._id, user);
        userIds.push(existing._id);
      } else {
        userIds.push(await db.insert("users", user));
      }
    }

    const existingPreview = await db
      .query("previews")
      .withIndex("by_external_id", (q) => q.eq("externalId", preview.externalId))
      .unique();
    const previewId = existingPreview
      ? (await db.patch(existingPreview._id, preview), existingPreview._id)
      : await db.insert("previews", { ...preview, createdAt: Date.now() });

    return { userIds, previewId };
  },
});

/* Rehearsal reset per /docs/09-DEMO_WIZARD.md — the demo must be
   re-runnable quickly. Clears the conversation state (threads,
   messages, actions, presence) and keeps users and previews. */
export const resetDemo = mutation({
  args: {},
  handler: async ({ db }) => {
    const tables = ["messages", "actions", "threads", "presence"] as const;
    let deleted = 0;
    for (const table of tables) {
      const rows = await db.query(table).collect();
      for (const row of rows) {
        await db.delete(row._id);
        deleted++;
      }
    }
    return { deleted };
  },
});
