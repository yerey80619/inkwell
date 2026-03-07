import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getGlobal = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const results = await ctx.db
      .query("systemInstructions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    return results.find((r) => r.documentId === undefined) ?? null;
  },
});

export const getForDocument = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    const results = await ctx.db
      .query("systemInstructions")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .collect();
    return results.find((r) => r.userId === userId) ?? null;
  },
});

export const saveGlobal = mutation({
  args: { instructions: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("systemInstructions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    const global = existing.find((r) => r.documentId === undefined);

    if (global) {
      await ctx.db.patch(global._id, { instructions: args.instructions });
    } else {
      await ctx.db.insert("systemInstructions", {
        userId,
        instructions: args.instructions,
      });
    }
  },
});

export const saveForDocument = mutation({
  args: {
    documentId: v.id("documents"),
    instructions: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const doc = await ctx.db.get(args.documentId);
    if (!doc || doc.userId !== userId) throw new Error("Not found");

    const existing = await ctx.db
      .query("systemInstructions")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .collect();
    const docInstructions = existing.find((r) => r.userId === userId);

    if (docInstructions) {
      await ctx.db.patch(docInstructions._id, {
        instructions: args.instructions,
      });
    } else {
      await ctx.db.insert("systemInstructions", {
        userId,
        documentId: args.documentId,
        instructions: args.instructions,
      });
    }
  },
});
