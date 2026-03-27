import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";

export const emailExists = query({
  args: {
    email: v.string(),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    return !!existingUser;
  },
});

export const upsertFromAuth = mutation({
  args: {
    clerkUserId: v.string(),
    email: v.string(),
    name: v.string(),
    picture: v.optional(v.string()),
  },
  returns: v.object({
    _id: v.id("users"),
    _creationTime: v.number(),
    clerkUserId: v.string(),
    email: v.string(),
    name: v.string(),
    picture: v.optional(v.string()),
    credits: v.number(),
    pref: v.optional(v.any()),
    created_at: v.string(),
    updated_at: v.string(),
  }),
  handler: async (ctx, args) => {
    const existingByEmail = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    const now = new Date().toISOString();
    const existingUser = existingByEmail;

    if (existingUser) {
      await ctx.db.patch(existingUser._id, {
        clerkUserId: args.clerkUserId,
        email: args.email,
        name: args.name,
        picture: args.picture,
        updated_at: now,
      });

      return {
        ...existingUser,
        clerkUserId: args.clerkUserId,
        email: args.email,
        name: args.name,
        picture: args.picture,
        updated_at: now,
      };
    }

    const userId = await ctx.db.insert("users", {
      clerkUserId: args.clerkUserId,
      email: args.email,
      name: args.name,
      picture: args.picture,
      credits: 0,
      pref: {},
      created_at: now,
      updated_at: now,
    });

    const createdUser = await ctx.db.get(userId);
    if (!createdUser) {
      throw new Error("Failed to create user");
    }

    return createdUser;
  },
});

export const upsertFromClerkWebhook = internalMutation({
  args: {
    clerkUserId: v.string(),
    email: v.string(),
    name: v.string(),
    picture: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const now = new Date().toISOString();

    const existingByClerkId = await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q) =>
        q.eq("clerkUserId", args.clerkUserId),
      )
      .unique();

    const existingByEmail = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique();

    const existingUser = existingByClerkId ?? existingByEmail;

    if (existingUser) {
      await ctx.db.patch(existingUser._id, {
        clerkUserId: args.clerkUserId,
        email: args.email,
        name: args.name,
        picture: args.picture,
        updated_at: now,
      });
      return null;
    }

    await ctx.db.insert("users", {
      clerkUserId: args.clerkUserId,
      email: args.email,
      name: args.name,
      picture: args.picture,
      credits: 0,
      pref: {},
      created_at: now,
      updated_at: now,
    });

    return null;
  },
});

export const deleteByClerkUserId = internalMutation({
  args: {
    clerkUserId: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_user_id", (q) =>
        q.eq("clerkUserId", args.clerkUserId),
      )
      .unique();

    if (existingUser) {
      await ctx.db.delete(existingUser._id);
    }

    return null;
  },
});
