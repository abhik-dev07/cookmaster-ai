import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkUserId: v.string(),
    email: v.string(),
    name: v.string(),
    picture: v.optional(v.string()),
    credits: v.number(),
    pref: v.optional(v.any()),
    created_at: v.string(),
    updated_at: v.string(),
  })
    .index("by_clerk_user_id", ["clerkUserId"])
    .index("by_email", ["email"]),
});
