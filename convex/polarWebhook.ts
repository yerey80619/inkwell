import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { Webhook } from "standardwebhooks";

export const handlePolarWebhook = httpAction(async (ctx, request) => {
  const body = await request.text();
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("POLAR_WEBHOOK_SECRET not configured");
    return new Response("Server configuration error", { status: 500 });
  }

  let event: any;
  try {
    // If the secret already has the whsec_ prefix, the standardwebhooks
    // library handles stripping it and base64-decoding the rest internally.
    // Only base64-encode when the secret is a raw string without the prefix.
    const secret = webhookSecret.startsWith("whsec_")
      ? webhookSecret
      : btoa(webhookSecret);
    const wh = new Webhook(secret);
    event = wh.verify(body, headers);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    console.error("Headers received:", JSON.stringify(headers));
    return new Response("Invalid signature", { status: 403 });
  }

  const eventType: string = event.type ?? headers["webhook-type"] ?? "";
  console.log("Polar webhook received:", eventType);

  const subscriptionEvents = [
    "subscription.created",
    "subscription.active",
    "subscription.updated",
    "subscription.canceled",
    "subscription.revoked",
    "subscription.uncanceled",
  ];

  if (subscriptionEvents.includes(eventType)) {
    const subscription = event.data;
    const customer = subscription.customer;

    if (!customer?.email) {
      console.error("Webhook missing customer email", JSON.stringify(event));
      return new Response("Missing customer email", { status: 400 });
    }

    console.log(
      "Processing subscription event:",
      eventType,
      "for",
      customer.email,
    );

    try {
      await ctx.runMutation(internal.subscriptions.upsertSubscription, {
        customerEmail: customer.email,
        polarCustomerId: customer.id,
        polarSubscriptionId: subscription.id,
        status: subscription.status,
        currentPeriodEnd: subscription.current_period_end
          ? new Date(subscription.current_period_end).getTime()
          : undefined,
      });
    } catch (err) {
      console.error("Failed to upsert subscription:", err);
      return new Response("Internal error", { status: 500 });
    }
  }

  return new Response("OK", { status: 200 });
});
