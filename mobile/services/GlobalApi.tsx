import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Create axios instance for Express backend
const axiosClient = axios.create({
  baseURL: "https://cookmaster-ai-server-ek4t.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include user email for authentication
axiosClient.interceptors.request.use(
  async (config) => {
    try {
      // Get user email from AsyncStorage (stored during login)
      const userEmail = await AsyncStorage.getItem("user_email");
      if (userEmail) {
        config.headers["x-user-email"] = userEmail;
      }

      console.log(
        "Making API request to:",
        config.url,
        "with user:",
        userEmail
      );
    } catch (error) {
      console.error("Error in request interceptor:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.error("Authentication error:", error.response.data);
      console.log(
        "User email not found or user not in database. Please ensure you're signed in."
      );

      // Return a more user-friendly error
      error.response.data = {
        error: {
          message: "Authentication required. Please sign in again.",
          status: 401,
        },
      };
    }
    return Promise.reject(error);
  }
);

const BASE_URL = "https://cookmasterimage-server-6e6h.onrender.com/api";
const RecipeImageApi = axios.create({
  baseURL: BASE_URL,
});

// ==================== USER APIs ====================
const GetUserByEmail = async (email: string) =>
  await axiosClient.get(`/user-lists/email/${email}`);

const CreateNewUser = async (data: {
  email: string;
  name: string;
  picture?: string;
}) => await axiosClient.post("/user-lists", data);

const UpdateUser = async (uid: any, data: any) => {
  console.log("API call to update user:", JSON.stringify(data, null, 2));
  try {
    return await axiosClient.put(`/user-lists/${uid}`, data);
  } catch (error) {
    if (error instanceof Error) {
      const axiosError = error as any;
      console.error(
        "UpdateUser API error:",
        axiosError.response?.data || error.message
      );
    } else {
      console.error("UpdateUser API error:", error);
    }
    throw error;
  }
};

const GetAllUsers = async () => await axiosClient.get("/user-lists");

// ==================== CATEGORY APIs ====================
const GetCategories = async () => await axiosClient.get("/categories");

const GetCategoryById = async (id: string) =>
  await axiosClient.get(`/categories/${id}`);

const CreateCategory = async (data: {
  name: string;
  icon?: string;
  color?: string;
  image?: string;
}) => await axiosClient.post("/categories", data);

const UpdateCategory = async (id: string, data: any) =>
  await axiosClient.put(`/categories/${id}`, data);

const DeleteCategory = async (id: string) =>
  await axiosClient.delete(`/categories/${id}`);

// ==================== RECIPE APIs ====================
const CreateNewRecipe = async (data: any) => {
  console.log("API call to create recipe:", JSON.stringify(data, null, 2));

  try {
    // Validate data before sending
    if (!data.recipeName || !data.userEmail) {
      throw new Error("Recipe name and user email are required");
    }

    const response = await axiosClient.post("/recipes", data);
    console.log("Recipe creation successful:", response.data);
    return response;
  } catch (error: any) {
    console.error(
      "CreateNewRecipe API error:",
      error.response?.data || error.message
    );
    console.error("Error status:", error.response?.status);

    // Provide more specific error messages
    if (error.response?.status === 400) {
      const errorMessage =
        error.response?.data?.error?.message || "Invalid recipe data";
      console.error("Validation error:", errorMessage);
      throw new Error(errorMessage);
    } else if (error.response?.status === 500) {
      console.error("Server error - this might be due to deployment issues");
      throw new Error(
        "Server error. Please try again later or contact support."
      );
    } else if (
      error.code === "NETWORK_ERROR" ||
      error.code === "ECONNABORTED"
    ) {
      console.error("Network error");
      throw new Error(
        "Network error. Please check your connection and try again."
      );
    }

    console.error("Request URL:", error.config?.url);
    console.error("Request method:", error.config?.method);
    console.error(
      "Full error response:",
      JSON.stringify(error.response, null, 2)
    );
    throw error;
  }
};

const GetAllRecipeList = async () => await axiosClient.get("/recipes");

const GetAllRecipesByLimit = async (limit: number) =>
  await axiosClient.get(`/recipes?limit=${limit}`);

const GetRecipeByCategory = async (category: string) =>
  await axiosClient.get(`/recipes/category/${category}`);

const GetUserCreatedRecipe = async (userEmail: string) =>
  await axiosClient.get(`/recipes/user/${userEmail}`);

const GetRecipeById = async (id: string) =>
  await axiosClient.get(`/recipes/${id}`);

const UpdateRecipe = async (id: string, data: any) => {
  console.log("API call to update recipe:", JSON.stringify(data, null, 2));
  try {
    return await axiosClient.put(`/recipes/${id}`, data);
  } catch (error: any) {
    console.error(
      "UpdateRecipe API error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

const DeleteRecipe = async (id: string) => {
  try {
    return await axiosClient.delete(`/recipes/${id}`);
  } catch (error: any) {
    console.error(
      "DeleteRecipe API error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

const SearchRecipes = async (query: string) =>
  await axiosClient.get(`/recipes/search?${query}`);

// ==================== FAVORITE APIs ====================
const SaveUserFavRecipe = async (data: any) =>
  await axiosClient.post("/user-favorites", data);

const SavedRecipeList = async (userEmail: string) =>
  await axiosClient.get(`/user-favorites/user/${userEmail}`);

const RemoveUserFavRecipe = async (userEmail: string, recipeId: string) => {
  try {
    return await axiosClient.delete(`/user-favorites/${userEmail}/${recipeId}`);
  } catch (err) {
    console.error("Delete failed:", err);
    throw err;
  }
};

const CheckRecipeFavorited = async (userEmail: string, recipeId: string) =>
  await axiosClient.get(`/user-favorites/check/${userEmail}/${recipeId}`);

const GetFavoriteCount = async (recipeId: string) =>
  await axiosClient.get(`/user-favorites/count/${recipeId}`);

// Legacy method for backward compatibility
const GetSavedRecipes = async (query: string) =>
  await axiosClient.get(`/recipes/search?${query}`);

// ==================== HEALTH CHECK ====================
const HealthCheck = async () => await axiosClient.get("/health");

// Gemini AI Model API
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

export const AiModel = async (PROMPT: string) =>
  await axios.post(
    `${GEMINI_API_URL}?key=${API_KEY}`,
    {
      contents: [
        {
          parts: [{ text: PROMPT }],
        },
      ],
    },
    {
      headers: { "Content-Type": "application/json" },
    }
  );

export default {
  // User APIs
  GetUserByEmail,
  CreateNewUser,
  UpdateUser,
  GetAllUsers,

  // Category APIs
  GetCategories,
  GetCategoryById,
  CreateCategory,
  UpdateCategory,
  DeleteCategory,

  // Recipe APIs
  CreateNewRecipe,
  GetAllRecipeList,
  GetAllRecipesByLimit,
  GetRecipeByCategory,
  GetUserCreatedRecipe,
  GetRecipeById,
  UpdateRecipe,
  DeleteRecipe,
  SearchRecipes,

  // Favorite APIs
  SaveUserFavRecipe,
  SavedRecipeList,
  RemoveUserFavRecipe,
  CheckRecipeFavorited,
  GetFavoriteCount,

  // Legacy methods
  GetSavedRecipes,

  // Health Check
  HealthCheck,

  // AI Model
  AiModel,
  RecipeImageApi,
};
