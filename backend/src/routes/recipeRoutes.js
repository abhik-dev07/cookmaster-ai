import express from "express";
import recipeController from "../controllers/recipeController.js";
import { clerkAuth, optionalClerkAuth } from "../middleware/clerkAuth.js";
import { validateRecipe } from "../middleware/validation.js";

const router = express.Router();

// Create new recipe
router.post("/", clerkAuth, validateRecipe, recipeController.createRecipe);

// Get all recipes
router.get("/", optionalClerkAuth, recipeController.getAllRecipes);

// Get recipes by category
router.get(
  "/category/:category",
  optionalClerkAuth,
  recipeController.getRecipesByCategory
);

// Get user created recipes
router.get(
  "/user/:userEmail",
  optionalClerkAuth,
  recipeController.getUserCreatedRecipes
);

// Get recipe by ID
router.get("/:id", optionalClerkAuth, recipeController.getRecipeById);

// Update recipe
router.put("/:id", clerkAuth, validateRecipe, recipeController.updateRecipe);

// Delete recipe
router.delete("/:id", clerkAuth, recipeController.deleteRecipe);

// Search recipes
router.get("/search", optionalClerkAuth, recipeController.searchRecipes);

export default router;
