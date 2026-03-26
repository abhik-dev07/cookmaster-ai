import pool from "../config/database.js";

// Save recipe to favorites
const saveFavorite = async (req, res) => {
  try {
    const { userEmail, recipeId } = req.body;

    // Check if recipe exists
    const recipeExists = await pool.query(
      "SELECT * FROM recipes WHERE id = $1",
      [recipeId]
    );

    if (recipeExists.rows.length === 0) {
      return res.status(404).json({
        error: {
          message: "Recipe not found",
          status: 404,
        },
      });
    }

    // Check if already favorited
    const existingFavorite = await pool.query(
      "SELECT * FROM user_favorites WHERE user_email = $1 AND recipe_id = $2",
      [userEmail, recipeId]
    );

    if (existingFavorite.rows.length > 0) {
      return res.status(400).json({
        error: {
          message: "Recipe already in favorites",
          status: 400,
        },
      });
    }

    const result = await pool.query(
      "INSERT INTO user_favorites (user_email, recipe_id) VALUES ($1, $2) RETURNING *",
      [userEmail, recipeId]
    );

    res.status(201).json({
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Save favorite error:", error);
    res.status(500).json({
      error: {
        message: "Internal server error",
        status: 500,
      },
    });
  }
};

// Get user favorites
const getUserFavorites = async (req, res) => {
  try {
    const { userEmail } = req.params;

    const result = await pool.query(
      `SELECT r.*, uf.created_at as favorited_at 
       FROM recipes r 
       INNER JOIN user_favorites uf ON r.id = uf.recipe_id 
       WHERE uf.user_email = $1 
       ORDER BY uf.created_at DESC`,
      [userEmail]
    );

    res.json({
      data: result.rows,
    });
  } catch (error) {
    console.error("Get user favorites error:", error);
    res.status(500).json({
      error: {
        message: "Internal server error",
        status: 500,
      },
    });
  }
};

// Remove recipe from favorites
const removeFavorite = async (req, res) => {
  try {
    const { userEmail, recipeId } = req.params;

    const result = await pool.query(
      "DELETE FROM user_favorites WHERE user_email = $1 AND recipe_id = $2 RETURNING *",
      [userEmail, recipeId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: {
          message: "Favorite not found",
          status: 404,
        },
      });
    }

    res.json({
      message: "Recipe removed from favorites",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Remove favorite error:", error);
    res.status(500).json({
      error: {
        message: "Internal server error",
        status: 500,
      },
    });
  }
};

// Check if recipe is favorited by user
const isRecipeFavorited = async (req, res) => {
  try {
    const { userEmail, recipeId } = req.params;

    const result = await pool.query(
      "SELECT * FROM user_favorites WHERE user_email = $1 AND recipe_id = $2",
      [userEmail, recipeId]
    );

    res.json({
      data: {
        isFavorited: result.rows.length > 0,
      },
    });
  } catch (error) {
    console.error("Check favorite error:", error);
    res.status(500).json({
      error: {
        message: "Internal server error",
        status: 500,
      },
    });
  }
};

// Get favorite count for a recipe
const getFavoriteCount = async (req, res) => {
  try {
    const { recipeId } = req.params;

    const result = await pool.query(
      "SELECT COUNT(*) as count FROM user_favorites WHERE recipe_id = $1",
      [recipeId]
    );

    res.json({
      data: {
        count: parseInt(result.rows[0].count),
      },
    });
  } catch (error) {
    console.error("Get favorite count error:", error);
    res.status(500).json({
      error: {
        message: "Internal server error",
        status: 500,
      },
    });
  }
};

export default {
  saveFavorite,
  getUserFavorites,
  removeFavorite,
  isRecipeFavorited,
  getFavoriteCount,
};
