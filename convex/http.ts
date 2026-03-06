import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { handlePolarWebhook } from "./polarWebhook";

const http = httpRouter();

auth.addHttpRoutes(http);

http.route({
  path: "/webhooks/polar",
  method: "POST",
  handler: handlePolarWebhook,
});

export default http;
