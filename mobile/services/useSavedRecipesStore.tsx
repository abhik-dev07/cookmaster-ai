import { create } from "zustand";
import GlobalApi from "@/services/GlobalApi";
import RecipeService from "@/services/RecipeService";

interface SavedRecipesStore {
  savedRecipes: string[];
  fetchSavedRecipes: (userEmail: string) => Promise<void>;
  isRecipeSaved: (id: string) => boolean;
  saveRecipe: (userEmail: string, recipeId: string) => Promise<void>;
  removeRecipe: (userEmail: string, recipeId: string) => Promise<void>;
}

export const useSavedRecipesStore = create<SavedRecipesStore>((set, get) => ({
  savedRecipes: [],

  fetchSavedRecipes: async (userEmail) => {
    const res = await GlobalApi.SavedRecipeList(userEmail);
    const ids = res.data?.data?.map(
      (item: any) => item.id?.toString() || item.recipe_id?.toString()
    );
    set({ savedRecipes: ids || [] });
  },

  isRecipeSaved: (id) => {
    return get().savedRecipes.includes(id);
  },

  saveRecipe: async (userEmail, recipeId) => {
    const result = await RecipeService.saveRecipe(userEmail, recipeId);
    if (result.success) {
      set((state) => ({
        savedRecipes: [...state.savedRecipes, recipeId],
      }));
    } else {
      console.error("Failed to save recipe:", result.error);
    }
  },

  removeRecipe: async (userEmail, recipeId) => {
    const result = await RecipeService.removeRecipe(userEmail, recipeId);
    if (result.success) {
      set((state) => ({
        savedRecipes: state.savedRecipes.filter((id) => id !== recipeId),
      }));
    } else {
      console.error("Failed to remove recipe:", result.error);
    }
  },
}));
