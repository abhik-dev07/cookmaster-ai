import express from "express";
import favoriteController from "../controllers/favoriteController.js";
import { clerkAuth } from "../middleware/clerkAuth.js";
import { validateUserFavorite } from "../middleware/validation.js";

const router = express.Router();

// Save recipe to favorites
router.post(
  "/",
  clerkAuth,
  validateUserFavorite,
  favoriteController.saveFavorite
);

// Get user favorites
router.get("/user/:userEmail", clerkAuth, favoriteController.getUserFavorites);

// Remove recipe from favorites
router.delete(
  "/:userEmail/:recipeId",
  clerkAuth,
  favoriteController.removeFavorite
);

// Check if recipe is favorited by user
router.get(
  "/check/:userEmail/:recipeId",
  clerkAuth,
  favoriteController.isRecipeFavorited
);

// Get favorite count for a recipe
router.get("/count/:recipeId", favoriteController.getFavoriteCount);

export default router;
