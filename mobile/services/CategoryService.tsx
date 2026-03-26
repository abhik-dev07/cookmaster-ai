import GlobalApi from "@/services/GlobalApi";

export interface Category {
  id: number;
  name: string;
  icon?: string;
  color?: string;
  image?: string;
  created_at: string;
  recipe_count?: number;
}

export interface CategoryResponse {
  data?: Category;
  error?: string;
}

export interface CategoriesResponse {
  data: Category[];
  error?: string;
}

export interface CreateCategoryData {
  name: string;
  icon?: string;
  color?: string;
  image?: string;
}

export interface UpdateCategoryData {
  name?: string;
  icon?: string;
  color?: string;
  image?: string;
}

class CategoryService {
  /**
   * Get all categories
   */
  async getAllCategories(): Promise<CategoriesResponse> {
    try {
      const result = await GlobalApi.GetCategories();
      console.log("All categories fetched:", result.data.data);

      return {
        data: result.data?.data || [],
      };
    } catch (error: any) {
      console.error("Error fetching all categories:", error);
      return {
        data: [],
        error:
          error.response?.data?.error?.message || "Failed to fetch categories",
      };
    }
  }

  /**
   * Get category by ID
   */
  async getCategoryById(id: string): Promise<CategoryResponse> {
    try {
      if (!id) {
        throw new Error("Category ID is required");
      }

      const result = await GlobalApi.GetCategoryById(id);
      console.log("Category fetched by ID:", result.data.data);

      return {
        data: result.data?.data,
      };
    } catch (error: any) {
      console.error("Error fetching category by ID:", error);
      return {
        error:
          error.response?.data?.error?.message || "Failed to fetch category",
      };
    }
  }

  /**
   * Create a new category
   */
  async createCategory(
    categoryData: CreateCategoryData
  ): Promise<CategoryResponse> {
    try {
      if (!categoryData.name) {
        throw new Error("Category name is required");
      }

      const result = await GlobalApi.CreateCategory(categoryData);
      console.log("Category created:", result.data.data);

      return {
        data: result.data?.data,
      };
    } catch (error: any) {
      console.error("Error creating category:", error);
      return {
        error:
          error.response?.data?.error?.message || "Failed to create category",
      };
    }
  }

  /**
   * Update category
   */
  async updateCategory(
    id: string,
    categoryData: UpdateCategoryData
  ): Promise<CategoryResponse> {
    try {
      if (!id) {
        throw new Error("Category ID is required");
      }

      const result = await GlobalApi.UpdateCategory(id, categoryData);
      console.log("Category updated:", result.data.data);

      return {
        data: result.data?.data,
      };
    } catch (error: any) {
      console.error("Error updating category:", error);
      return {
        error:
          error.response?.data?.error?.message || "Failed to update category",
      };
    }
  }

  /**
   * Delete category
   */
  async deleteCategory(
    id: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!id) {
        throw new Error("Category ID is required");
      }

      await GlobalApi.DeleteCategory(id);
      console.log("Category deleted:", id);

      return { success: true };
    } catch (error: any) {
      console.error("Error deleting category:", error);
      return {
        success: false,
        error:
          error.response?.data?.error?.message || "Failed to delete category",
      };
    }
  }

  /**
   * Get category by name (case-insensitive search)
   */
  async getCategoryByName(name: string): Promise<CategoryResponse> {
    try {
      if (!name) {
        throw new Error("Category name is required");
      }

      const allCategories = await this.getAllCategories();

      if (allCategories.error) {
        return { error: allCategories.error };
      }

      const category = allCategories.data.find(
        (cat) => cat.name.toLowerCase() === name.toLowerCase()
      );

      return {
        data: category,
      };
    } catch (error: any) {
      console.error("Error fetching category by name:", error);
      return {
        error: "Failed to fetch category by name",
      };
    }
  }

  /**
   * Update category image
   */
  async updateCategoryImage(
    id: string,
    imageUrl: string
  ): Promise<CategoryResponse> {
    return this.updateCategory(id, { image: imageUrl });
  }

  /**
   * Update category color
   */
  async updateCategoryColor(
    id: string,
    color: string
  ): Promise<CategoryResponse> {
    return this.updateCategory(id, { color });
  }

  /**
   * Update category icon
   */
  async updateCategoryIcon(
    id: string,
    icon: string
  ): Promise<CategoryResponse> {
    return this.updateCategory(id, { icon });
  }
}

export default new CategoryService();
