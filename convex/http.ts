import { httpRouter } from "convex/server";
import { api, internal } from "./_generated/api";
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

http.route({
  path: "/seed/categories",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const expectedSecret = process.env.CONVEX_SEED_SECRET;
    if (!expectedSecret) {
      return new Response("Missing CONVEX_SEED_SECRET", { status: 500 });
    }

    const providedSecret = request.headers.get("x-seed-secret");
    if (providedSecret !== expectedSecret) {
      return new Response("Unauthorized", { status: 401 });
    }

    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return new Response("Invalid JSON body", { status: 400 });
    }

    const rawCategories = Array.isArray(payload)
      ? payload
      : (payload as { categories?: unknown })?.categories;

    if (!Array.isArray(rawCategories)) {
      return new Response("Request must include a categories array", {
        status: 400,
      });
    }

    const categories = rawCategories.filter(
      (item): item is { name: string; image_link: string } =>
        !!item &&
        typeof item === "object" &&
        typeof (item as { name?: unknown }).name === "string" &&
        typeof (item as { image_link?: unknown }).image_link === "string",
    );

    const result = await ctx.runMutation(
      (api as any).categories.seedCategories,
      {
        categories,
      },
    );

    return Response.json(result, { status: 200 });
  }),
});

export default http;
