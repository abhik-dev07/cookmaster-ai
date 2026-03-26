import pool from "../config/database.js";

// Create new recipe
const createRecipe = async (req, res) => {
  try {
    const {
      recipeName,
      description,
      ingredients,
      steps,
      calories,
      cookTime,
      serveTo,
      imagePrompt,
      category,
      recipeImage,
      userEmail,
    } = req.body;

    // Create the recipe
    const result = await pool.query(
      `INSERT INTO recipes (
        recipe_name, description, ingredients, steps, calories, 
        cook_time, serve_to, image_prompt, category, recipe_image, user_email
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
      RETURNING *`,
      [
        recipeName,
        description,
        JSON.stringify(ingredients),
        JSON.stringify(steps),
        calories,
        cookTime,
        serveTo,
        imagePrompt,
        category,
        recipeImage,
        userEmail,
      ]
    );

    res.status(201).json({
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Create recipe error:", error);
    res.status(500).json({
      error: {
        message: "Internal server error",
        status: 500,
      },
    });
  }
};

// Get all recipes
const getAllRecipes = async (req, res) => {
  try {
    const { limit, sort = "created_at DESC" } = req.query;

    let query = "SELECT * FROM recipes ORDER BY created_at DESC";
    const values = [];

    if (limit) {
      query += " LIMIT $1";
      values.push(parseInt(limit));
    }

    const result = await pool.query(query, values);

    res.json({
      data: result.rows,
    });
  } catch (error) {
    console.error("Get all recipes error:", error);
    res.status(500).json({
      error: {
        message: "Internal server error",
        status: 500,
      },
    });
  }
};

// Get recipes by category
const getRecipesByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const result = await pool.query(
      "SELECT * FROM recipes WHERE LOWER(category) LIKE LOWER($1) ORDER BY created_at DESC",
      [`%${category}%`]
    );

    res.json({
      data: result.rows,
    });
  } catch (error) {
    console.error("Get recipes by category error:", error);
    res.status(500).json({
      error: {
        message: "Internal server error",
        status: 500,
      },
    });
  }
};

// Get user created recipes
const getUserCreatedRecipes = async (req, res) => {
  try {
    const { userEmail } = req.params;

    const result = await pool.query(
      "SELECT * FROM recipes WHERE user_email = $1 ORDER BY created_at DESC",
      [userEmail]
    );

    res.json({
      data: result.rows,
    });
  } catch (error) {
    console.error("Get user created recipes error:", error);
    res.status(500).json({
      error: {
        message: "Internal server error",
        status: 500,
      },
    });
  }
};

// Get recipe by ID
const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("SELECT * FROM recipes WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: {
          message: "Recipe not found",
          status: 404,
        },
      });
    }

    res.json({
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Get recipe by ID error:", error);
    res.status(500).json({
      error: {
        message: "Internal server error",
        status: 500,
      },
    });
  }
};

// Update recipe
const updateRecipe = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updateFields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(updateData).forEach((key) => {
      if (updateData[key] !== undefined) {
        updateFields.push(
          `${key.replace(/([A-Z])/g, "_$1").toLowerCase()} = $${paramCount}`
        );
        values.push(updateData[key]);
        paramCount++;
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({
        error: {
          message: "No fields to update",
          status: 400,
        },
      });
    }

    values.push(id);
    const query = `
      UPDATE recipes 
      SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $${paramCount} 
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: {
          message: "Recipe not found",
          status: 404,
        },
      });
    }

    res.json({
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Update recipe error:", error);
    res.status(500).json({
      error: {
        message: "Internal server error",
        status: 500,
      },
    });
  }
};

// Delete recipe
const deleteRecipe = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM recipes WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: {
          message: "Recipe not found",
          status: 404,
        },
      });
    }

    res.json({
      message: "Recipe deleted successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Delete recipe error:", error);
    res.status(500).json({
      error: {
        message: "Internal server error",
        status: 500,
      },
    });
  }
};

// Search recipes
const searchRecipes = async (req, res) => {
  try {
    const { q, category, sort = "created_at DESC" } = req.query;

    let query = "SELECT * FROM recipes WHERE 1=1";
    const values = [];
    let paramCount = 1;

    if (q) {
      query += ` AND (LOWER(recipe_name) LIKE LOWER($${paramCount}) OR LOWER(description) LIKE LOWER($${paramCount}))`;
      values.push(`%${q}%`);
      paramCount++;
    }

    if (category && category !== "all") {
      query += ` AND LOWER(category) LIKE LOWER($${paramCount})`;
      values.push(`%${category}%`);
      paramCount++;
    }

    query += ` ORDER BY ${sort}`;

    const result = await pool.query(query, values);

    res.json({
      data: result.rows,
    });
  } catch (error) {
    console.error("Search recipes error:", error);
    res.status(500).json({
      error: {
        message: "Internal server error",
        status: 500,
      },
    });
  }
};

export default {
  createRecipe,
  getAllRecipes,
  getRecipesByCategory,
  getUserCreatedRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  searchRecipes,
};
