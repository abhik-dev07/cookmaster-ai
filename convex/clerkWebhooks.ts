"use node";

import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalAction } from "./_generated/server";

const FIVE_MINUTES_IN_SECONDS = 300;

type ClerkWebhookEvent = {
  type: string;
  data: {
    id?: string;
    first_name?: string | null;
    last_name?: string | null;
    username?: string | null;
    image_url?: string;
    primary_email_address_id?: string | null;
    email_addresses?: Array<{
      id: string;
      email_address: string;
    }>;
  };
};

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < a.length; i += 1) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

async function verifySvixSignature(args: {
  payload: string;
  svixId: string;
  svixTimestamp: string;
  svixSignature: string;
}) {
  const secret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
  if (!secret) {
    throw new Error("Missing CLERK_WEBHOOK_SIGNING_SECRET");
  }

  const timestamp = Number(args.svixTimestamp);
  if (!Number.isFinite(timestamp)) {
    throw new Error("Invalid svix timestamp");
  }

  const nowInSeconds = Math.floor(Date.now() / 1000);
  if (Math.abs(nowInSeconds - timestamp) > FIVE_MINUTES_IN_SECONDS) {
    throw new Error("Stale svix webhook timestamp");
  }

  const encodedSecret = secret.startsWith("whsec_") ? secret.slice(6) : secret;
  const secretBytes = Buffer.from(encodedSecret, "base64");

  const signedContent = `${args.svixId}.${args.svixTimestamp}.${args.payload}`;
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    secretBytes,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    cryptoKey,
    new TextEncoder().encode(signedContent),
  );
  const expectedSignature = Buffer.from(signatureBuffer).toString("base64");

  const providedSignatures = args.svixSignature
    .split(" ")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => entry.split(","))
    .filter(([version, signature]) => version === "v1" && !!signature)
    .map(([, signature]) => signature);

  const isValid = providedSignatures.some((signature) =>
    constantTimeEqual(signature, expectedSignature),
  );

  if (!isValid) {
    throw new Error("Invalid svix signature");
  }
}

function extractUserData(event: ClerkWebhookEvent) {
  const primaryEmail = event.data.email_addresses?.find(
    (email) => email.id === event.data.primary_email_address_id,
  );
  const fallbackEmail = event.data.email_addresses?.[0];

  const email = (
    primaryEmail?.email_address ??
    fallbackEmail?.email_address ??
    ""
  )
    .trim()
    .toLowerCase();

  const fullName =
    `${event.data.first_name ?? ""} ${event.data.last_name ?? ""}`.trim();
  const name = fullName || event.data.username || "CookMaster User";

  return {
    clerkUserId: event.data.id,
    email,
    name,
    picture: event.data.image_url,
  };
}

export const processClerkWebhook = internalAction({
  args: {
    payload: v.string(),
    svixId: v.string(),
    svixTimestamp: v.string(),
    svixSignature: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await verifySvixSignature(args);

    const event = JSON.parse(args.payload) as ClerkWebhookEvent;

    if (event.type === "user.created" || event.type === "user.updated") {
      const userData = extractUserData(event);

      if (!userData.clerkUserId || !userData.email) {
        throw new Error("Clerk webhook missing user id or email");
      }

      await ctx.runMutation(internal.users.upsertFromClerkWebhook, {
        clerkUserId: userData.clerkUserId,
        email: userData.email,
        name: userData.name,
        picture: userData.picture,
      });
    }

    if (event.type === "user.deleted") {
      if (event.data.id) {
        await ctx.runMutation(internal.users.deleteByClerkUserId, {
          clerkUserId: event.data.id,
        });
      }
    }

    return null;
  },
});
