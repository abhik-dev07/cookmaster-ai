import GlobalApi from "@/services/GlobalApi";

export interface Recipe {
  id: number;
  recipe_name: string;
  description: string;
  ingredients: any[];
  steps: any[];
  calories: number;
  cook_time: number;
  serve_to: number;
  image_prompt: string;
  category: string;
  recipe_image: string;
  user_email: string;
  likes: number;
  created_at: string;
  updated_at: string;
}

export interface RecipeStats {
  createdCount: number;
  savedCount: number;
}

export interface RecipeResponse {
  data: Recipe[];
  error?: string;
}

export interface SingleRecipeResponse {
  data?: Recipe;
  error?: string;
}

export interface SearchParams {
  q?: string;
  category?: string;
  sort?: string;
}

class RecipeService {
  /**
   * Fetch user created recipes
   */
  async getUserCreatedRecipes(userEmail: string): Promise<RecipeResponse> {
    try {
      if (!userEmail) {
        throw new Error("User email is required");
      }

      const result = await GlobalApi.GetUserCreatedRecipe(userEmail);
      console.log("User created recipes fetched:", result.data.data);

      return {
        data: result.data?.data || [],
      };
    } catch (error: any) {
      console.error("Error fetching user created recipes:", error);
      return {
        data: [],
        error:
          error.response?.data?.error?.message ||
          "Failed to fetch your recipes",
      };
    }
  }

  /**
   * Fetch user saved recipes
   */
  async getUserSavedRecipes(userEmail: string): Promise<RecipeResponse> {
    try {
      if (!userEmail) {
        throw new Error("User email is required");
      }

      const result = await GlobalApi.SavedRecipeList(userEmail);
      console.log("User saved recipes fetched:", result.data.data);

      return {
        data: result.data?.data || [],
      };
    } catch (error: any) {
      console.error("Error fetching user saved recipes:", error);
      return {
        data: [],
        error:
          error.response?.data?.error?.message ||
          "Failed to fetch your saved recipes",
      };
    }
  }

  /**
   * Fetch all recipes with optional limit
   */
  async getAllRecipes(limit?: number): Promise<RecipeResponse> {
    try {
      const result = limit
        ? await GlobalApi.GetAllRecipesByLimit(limit)
        : await GlobalApi.GetAllRecipeList();

      console.log("All recipes fetched:", result.data.data);

      return {
        data: result.data?.data || [],
      };
    } catch (error: any) {
      console.error("Error fetching all recipes:", error);
      return {
        data: [],
        error:
          error.response?.data?.error?.message || "Failed to fetch recipes",
      };
    }
  }

  /**
   * Fetch random recipes for daily carousel
   */
  async getRandomRecipes(count: number = 3): Promise<RecipeResponse> {
    try {
      // Get all recipes first
      const result = await GlobalApi.GetAllRecipeList();
      const allRecipes = result.data?.data || [];

      if (allRecipes.length === 0) {
        return {
          data: [],
        };
      }

      // Shuffle and take the first 'count' recipes
      const shuffled = [...allRecipes].sort(() => 0.5 - Math.random());
      const randomRecipes = shuffled.slice(0, count);

      console.log("Random recipes fetched:", randomRecipes);

      return {
        data: randomRecipes,
      };
    } catch (error: any) {
      console.error("Error fetching random recipes:", error);
      return {
        data: [],
        error:
          error.response?.data?.error?.message ||
          "Failed to fetch random recipes",
      };
    }
  }

  /**
   * Fetch recipes by category
   */
  async getRecipesByCategory(category: string): Promise<RecipeResponse> {
    try {
      if (!category) {
        throw new Error("Category is required");
      }

      const result = await GlobalApi.GetRecipeByCategory(category);
      console.log("Recipes by category fetched:", result.data.data);

      return {
        data: result.data?.data || [],
      };
    } catch (error: any) {
      console.error("Error fetching recipes by category:", error);
      return {
        data: [],
        error:
          error.response?.data?.error?.message ||
          "Failed to fetch recipes for this category",
      };
    }
  }

  /**
   * Fetch recipe by ID
   */
  async getRecipeById(id: string): Promise<SingleRecipeResponse> {
    try {
      if (!id) {
        throw new Error("Recipe ID is required");
      }

      const result = await GlobalApi.GetRecipeById(id);
      console.log("Recipe by ID fetched:", result.data.data);

      return {
        data: result.data?.data,
      };
    } catch (error: any) {
      console.error("Error fetching recipe by ID:", error);
      return {
        error:
          error.response?.data?.error?.message ||
          "Failed to fetch recipe details",
      };
    }
  }

  /**
   * Search recipes
   */
  async searchRecipes(params: SearchParams): Promise<RecipeResponse> {
    try {
      const queryParams = new URLSearchParams();

      if (params.q) queryParams.append("q", params.q);
      if (params.category) queryParams.append("category", params.category);
      if (params.sort) queryParams.append("sort", params.sort);

      const queryString = queryParams.toString();
      const result = await GlobalApi.SearchRecipes(queryString);
      console.log("Search results:", result.data.data);

      return {
        data: result.data?.data || [],
      };
    } catch (error: any) {
      console.error("Error searching recipes:", error);
      return {
        data: [],
        error:
          error.response?.data?.error?.message || "Failed to search recipes",
      };
    }
  }

  /**
   * Get recipe statistics for a user
   */
  async getUserRecipeStats(userEmail: string): Promise<RecipeStats> {
    try {
      if (!userEmail) {
        return { createdCount: 0, savedCount: 0 };
      }

      const [createdRecipes, savedRecipes] = await Promise.all([
        this.getUserCreatedRecipes(userEmail),
        this.getUserSavedRecipes(userEmail),
      ]);

      return {
        createdCount: createdRecipes.data.length,
        savedCount: savedRecipes.data.length,
      };
    } catch (error) {
      console.error("Error fetching recipe stats:", error);
      return { createdCount: 0, savedCount: 0 };
    }
  }

  /**
   * Create a new recipe
   */
  async createRecipe(
    recipeData: any
  ): Promise<{ success: boolean; data?: Recipe; error?: string }> {
    try {
      // Validate required fields
      const requiredFields = [
        "recipeName",
        "description",
        "ingredients",
        "steps",
        "calories",
        "cookTime",
        "serveTo",
        "imagePrompt",
        "category",
        "recipeImage",
        "userEmail",
      ];

      const missingFields = requiredFields.filter(
        (field) => !recipeData[field]
      );
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
      }

      // Ensure ingredients and steps are properly formatted
      const formattedData = {
        ...recipeData,
        ingredients: Array.isArray(recipeData.ingredients)
          ? recipeData.ingredients
          : JSON.parse(recipeData.ingredients || "[]"),
        steps: Array.isArray(recipeData.steps)
          ? recipeData.steps
          : JSON.parse(recipeData.steps || "[]"),
        calories: parseInt(recipeData.calories) || 0,
        cookTime: parseInt(recipeData.cookTime) || 0,
        serveTo: parseInt(recipeData.serveTo) || 1,
      };

      console.log(
        "Creating recipe with data:",
        JSON.stringify(formattedData, null, 2)
      );

      const result = await GlobalApi.CreateNewRecipe(formattedData);
      console.log("Recipe created successfully:", result.data.data);

      return {
        success: true,
        data: result.data.data,
      };
    } catch (error: any) {
      console.error("Error creating recipe:", error);

      // Handle specific error types
      if (error.response?.status === 400) {
        return {
          success: false,
          error: error.response?.data?.error?.message || "Invalid recipe data",
        };
      } else if (error.response?.status === 500) {
        return {
          success: false,
          error: "Server error. Please try again later.",
        };
      } else if (error.message?.includes("Missing required fields")) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: false,
        error:
          "Failed to create recipe. Please check your connection and try again.",
      };
    }
  }

  /**
   * Update an existing recipe
   */
  async updateRecipe(
    id: string,
    recipeData: any
  ): Promise<{ success: boolean; data?: Recipe; error?: string }> {
    try {
      if (!id) {
        throw new Error("Recipe ID is required");
      }

      const result = await GlobalApi.UpdateRecipe(id, recipeData);
      console.log("Recipe updated:", result.data.data);

      return {
        success: true,
        data: result.data.data,
      };
    } catch (error: any) {
      console.error("Error updating recipe:", error);
      return {
        success: false,
        error:
          error.response?.data?.error?.message || "Failed to update recipe",
      };
    }
  }

  /**
   * Delete a recipe
   */
  async deleteRecipe(
    id: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!id) {
        throw new Error("Recipe ID is required");
      }

      await GlobalApi.DeleteRecipe(id);
      console.log("Recipe deleted:", id);

      return { success: true };
    } catch (error: any) {
      console.error("Error deleting recipe:", error);
      return {
        success: false,
        error:
          error.response?.data?.error?.message || "Failed to delete recipe",
      };
    }
  }

  /**
   * Save a recipe to user favorites
   */
  async saveRecipe(
    userEmail: string,
    recipeId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!userEmail || !recipeId) {
        throw new Error("User email and recipe ID are required");
      }

      await GlobalApi.SaveUserFavRecipe({ userEmail, recipeId });
      console.log("Recipe saved to favorites:", recipeId);

      return { success: true };
    } catch (error: any) {
      console.error("Error saving recipe:", error);
      return {
        success: false,
        error: error.response?.data?.error?.message || "Failed to save recipe",
      };
    }
  }

  /**
   * Remove a recipe from user favorites
   */
  async removeRecipe(
    userEmail: string,
    recipeId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!userEmail || !recipeId) {
        throw new Error("User email and recipe ID are required");
      }

      await GlobalApi.RemoveUserFavRecipe(userEmail, recipeId);
      console.log("Recipe removed from favorites:", recipeId);

      return { success: true };
    } catch (error: any) {
      console.error("Error removing recipe:", error);
      return {
        success: false,
        error:
          error.response?.data?.error?.message || "Failed to remove recipe",
      };
    }
  }

  /**
   * Check if a recipe is favorited by user
   */
  async isRecipeFavorited(
    userEmail: string,
    recipeId: string
  ): Promise<{ isFavorited: boolean; error?: string }> {
    try {
      if (!userEmail || !recipeId) {
        throw new Error("User email and recipe ID are required");
      }

      const result = await GlobalApi.CheckRecipeFavorited(userEmail, recipeId);
      console.log("Recipe favorited check:", result.data.data);

      return {
        isFavorited: result.data?.data?.isFavorited || false,
      };
    } catch (error: any) {
      console.error("Error checking recipe favorited status:", error);
      return {
        isFavorited: false,
        error:
          error.response?.data?.error?.message ||
          "Failed to check favorite status",
      };
    }
  }

  /**
   * Get favorite count for a recipe
   */
  async getFavoriteCount(
    recipeId: string
  ): Promise<{ count: number; error?: string }> {
    try {
      if (!recipeId) {
        throw new Error("Recipe ID is required");
      }

      const result = await GlobalApi.GetFavoriteCount(recipeId);
      console.log("Favorite count:", result.data.data);

      return {
        count: result.data?.data?.count || 0,
      };
    } catch (error: any) {
      console.error("Error getting favorite count:", error);
      return {
        count: 0,
        error:
          error.response?.data?.error?.message ||
          "Failed to get favorite count",
      };
    }
  }
}

export default new RecipeService();
