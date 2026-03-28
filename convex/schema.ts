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

  categories: defineTable({
    name: v.string(),
    normalized_name: v.string(),
    image_link: v.string(),
    created_at: v.string(),
    updated_at: v.string(),
  })
    .index("by_normalized_name", ["normalized_name"])
    .index("by_name", ["name"]),

  categoryItems: defineTable({
    category_id: v.id("categories"),
    recipe_title: v.string(),
    recipe_title_normalized: v.string(),
    recipe_image_link: v.optional(v.string()),
    full_recipe: v.any(),
    created_at: v.string(),
    updated_at: v.string(),
  })
    .index("by_category_id", ["category_id"])
    .index("by_category_and_recipe_title", [
      "category_id",
      "recipe_title_normalized",
    ]),
});
