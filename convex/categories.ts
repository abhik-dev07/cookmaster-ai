import { v } from "convex/values";
import { mutation, query, type MutationCtx } from "./_generated/server";

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

async function upsertCategory(
  ctx: MutationCtx,
  input: { name: string; image_link: string },
) {
  const now = new Date().toISOString();
  const normalizedName = normalizeText(input.name);

  const existing = await ctx.db
    .query("categories")
    .withIndex("by_normalized_name", (q) =>
      q.eq("normalized_name", normalizedName),
    )
    .unique();

  if (existing) {
    await ctx.db.patch(existing._id, {
      name: input.name,
      image_link: input.image_link,
      updated_at: now,
    });

    return { categoryId: existing._id, action: "updated" as const };
  }

  const categoryId = await ctx.db.insert("categories", {
    name: input.name,
    normalized_name: normalizedName,
    image_link: input.image_link,
    created_at: now,
    updated_at: now,
  });

  return { categoryId, action: "created" as const };
}

export const listCategories = query({
  args: {},
  returns: v.array(
    v.object({
      _id: v.id("categories"),
      _creationTime: v.number(),
      name: v.string(),
      normalized_name: v.string(),
      image_link: v.string(),
      created_at: v.string(),
      updated_at: v.string(),
    }),
  ),
  handler: async (ctx) => {
    return await ctx.db.query("categories").order("asc").collect();
  },
});

export const seedCategories = mutation({
  args: {
    categories: v.array(
      v.object({
        name: v.string(),
        image_link: v.string(),
      }),
    ),
  },
  returns: v.object({
    total: v.number(),
    created: v.number(),
    updated: v.number(),
  }),
  handler: async (ctx, args) => {
    let created = 0;
    let updated = 0;

    for (const category of args.categories) {
      const cleanName = category.name.trim();
      const cleanImageLink = category.image_link.trim();

      if (!cleanName || !cleanImageLink) {
        continue;
      }

      const result = await upsertCategory(ctx, {
        name: cleanName,
        image_link: cleanImageLink,
      });

      if (result.action === "created") {
        created += 1;
      } else {
        updated += 1;
      }
    }

    return {
      total: created + updated,
      created,
      updated,
    };
  },
});

export const saveGeneratedRecipeToCategory = mutation({
  args: {
    category_name: v.string(),
    category_image_link: v.string(),
    recipe_title: v.string(),
    recipe_image_link: v.optional(v.string()),
    full_recipe: v.any(),
  },
  returns: v.object({
    category_id: v.id("categories"),
    category_item_id: v.id("categoryItems"),
    action: v.union(v.literal("created"), v.literal("updated")),
  }),
  handler: async (ctx, args) => {
    const categoryName = args.category_name.trim();
    const categoryImageLink = args.category_image_link.trim();
    const recipeTitle = args.recipe_title.trim();

    if (!categoryName || !categoryImageLink || !recipeTitle) {
      throw new Error(
        "category_name, category_image_link, and recipe_title are required",
      );
    }

    const categoryResult = await upsertCategory(ctx, {
      name: categoryName,
      image_link: categoryImageLink,
    });

    const now = new Date().toISOString();
    const normalizedRecipeTitle = normalizeText(recipeTitle);

    const existingItem = await ctx.db
      .query("categoryItems")
      .withIndex("by_category_and_recipe_title", (q) =>
        q
          .eq("category_id", categoryResult.categoryId)
          .eq("recipe_title_normalized", normalizedRecipeTitle),
      )
      .unique();

    if (existingItem) {
      await ctx.db.patch(existingItem._id, {
        recipe_title: recipeTitle,
        recipe_image_link: args.recipe_image_link,
        full_recipe: args.full_recipe,
        updated_at: now,
      });

      return {
        category_id: categoryResult.categoryId,
        category_item_id: existingItem._id,
        action: "updated" as const,
      };
    }

    const categoryItemId = await ctx.db.insert("categoryItems", {
      category_id: categoryResult.categoryId,
      recipe_title: recipeTitle,
      recipe_title_normalized: normalizedRecipeTitle,
      recipe_image_link: args.recipe_image_link,
      full_recipe: args.full_recipe,
      created_at: now,
      updated_at: now,
    });

    return {
      category_id: categoryResult.categoryId,
      category_item_id: categoryItemId,
      action: "created" as const,
    };
  },
});
