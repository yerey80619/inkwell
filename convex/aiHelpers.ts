import { v } from "convex/values";
import { internalQuery, internalMutation } from "./_generated/server";

export const getDoc = internalQuery({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.documentId);
  },
});

export const getKnowledge = internalQuery({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("knowledge")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .collect();
  },
});

export const getChatHistory = internalQuery({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("chatMessages")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .collect();
  },
});

export const getSystemInstructions = internalQuery({
  args: {
    userId: v.id("users"),
    documentId: v.id("documents"),
  },
  handler: async (ctx, args) => {
    const userInstructions = await ctx.db
      .query("systemInstructions")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
    const global = userInstructions.find((r) => r.documentId === undefined);

    const docInstructions = await ctx.db
      .query("systemInstructions")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .collect();
    const docLevel = docInstructions.find((r) => r.userId === args.userId);

    return {
      global: global?.instructions ?? null,
      document: docLevel?.instructions ?? null,
    };
  },
});

export const saveAssistantMessage = internalMutation({
  args: {
    documentId: v.id("documents"),
    userId: v.id("users"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("chatMessages", {
      documentId: args.documentId,
      userId: args.userId,
      role: "assistant",
      content: args.content,
    });
  },
});
