import { query, internalMutation, action } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";
import { api } from "./_generated/api";

export const getMySubscription = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
  },
});

export const getCustomerPortalUrl = action({
  args: {},
  handler: async (ctx): Promise<string> => {
    const subscription = await ctx.runQuery(api.subscriptions.getMySubscription);
    if (!subscription?.polarCustomerId) {
      throw new Error("No active subscription found");
    }

    const accessToken = process.env.POLAR_ACCESS_TOKEN;
    if (!accessToken) {
      throw new Error("POLAR_ACCESS_TOKEN is not configured");
    }

    const baseUrl = process.env.POLAR_API_URL ?? "https://sandbox-api.polar.sh";
    const response = await fetch(`${baseUrl}/v1/customer-sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ customer_id: subscription.polarCustomerId }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Polar API error (${response.status}): ${text}`);
    }

    const data = await response.json();
    return data.customer_portal_url;
  },
});

export const upsertSubscription = internalMutation({
  args: {
    customerEmail: v.string(),
    polarCustomerId: v.string(),
    polarSubscriptionId: v.string(),
    status: v.string(),
    currentPeriodEnd: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("subscriptions")
      .withIndex("by_polar_subscription", (q) =>
        q.eq("polarSubscriptionId", args.polarSubscriptionId)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        status: args.status,
        polarCustomerId: args.polarCustomerId,
        currentPeriodEnd: args.currentPeriodEnd,
      });
      return existing._id;
    }

    // Look up user by email to associate subscription
    const allUsers = await ctx.db.query("users").collect();
    const user = allUsers.find(
      (u) => u.email?.toLowerCase() === args.customerEmail.toLowerCase()
    );
    if (!user) {
      throw new Error(
        `No user found with email: ${args.customerEmail}`
      );
    }

    return await ctx.db.insert("subscriptions", {
      userId: user._id,
      polarCustomerId: args.polarCustomerId,
      polarSubscriptionId: args.polarSubscriptionId,
      status: args.status,
      currentPeriodEnd: args.currentPeriodEnd,
    });
  },
});
