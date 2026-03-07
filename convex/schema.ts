import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  documents: defineTable({
    userId: v.id("users"),
    title: v.string(),
    content: v.string(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_updated", ["userId", "updatedAt"]),

  knowledge: defineTable({
    documentId: v.id("documents"),
    userId: v.id("users"),
    title: v.string(),
    content: v.string(),
  }).index("by_document", ["documentId"]),

  chatMessages: defineTable({
    documentId: v.id("documents"),
    userId: v.id("users"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
  }).index("by_document", ["documentId"]),

  systemInstructions: defineTable({
    userId: v.id("users"),
    documentId: v.optional(v.id("documents")),
    instructions: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_document", ["documentId"]),

  subscriptions: defineTable({
    userId: v.id("users"),
    polarCustomerId: v.string(),
    polarSubscriptionId: v.string(),
    status: v.string(),
    currentPeriodEnd: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_polar_customer", ["polarCustomerId"])
    .index("by_polar_subscription", ["polarSubscriptionId"]),
});
