import { httpRouter } from "convex/server";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/webhooks/clerk",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const svixId = request.headers.get("svix-id");
    const svixTimestamp = request.headers.get("svix-timestamp");
    const svixSignature = request.headers.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      return new Response("Missing svix headers", { status: 400 });
    }

    const payload = await request.text();

    try {
      await ctx.runAction(internal.clerkWebhooks.processClerkWebhook, {
        payload,
        svixId,
        svixTimestamp,
        svixSignature,
      });
      return new Response("ok", { status: 200 });
    } catch (error) {
      console.error("Clerk webhook processing error", error);
      return new Response("invalid webhook", { status: 400 });
    }
  }),
});

export default http;
