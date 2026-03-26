import pool from "../config/database.js";

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    // Get categories with recipe counts using a LEFT JOIN
    const result = await pool.query(`
      SELECT 
        c.*,
        COALESCE(COUNT(r.id), 0) as recipe_count
      FROM categories c
      LEFT JOIN recipes r ON c.name = r.category
      GROUP BY c.id, c.name, c.icon, c.color, c.image, c.created_at
      ORDER BY c.name ASC
    `);

    res.json({
      data: result.rows,
    });
  } catch (error) {
    console.error("Get all categories error:", error);
    res.status(500).json({
      error: {
        message: "Internal server error",
        status: 500,
      },
    });
  }
};

// Get category by ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("SELECT * FROM categories WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: {
          message: "Category not found",
          status: 404,
        },
      });
    }

    res.json({
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Get category by ID error:", error);
    res.status(500).json({
      error: {
        message: "Internal server error",
        status: 500,
      },
    });
  }
};

// Create new category
const createCategory = async (req, res) => {
  try {
    const { name, icon, color, image } = req.body;

    // Check if category already exists
    const existingCategory = await pool.query(
      "SELECT * FROM categories WHERE LOWER(name) = LOWER($1)",
      [name]
    );

    if (existingCategory.rows.length > 0) {
      return res.status(400).json({
        error: {
          message: "Category already exists",
          status: 400,
        },
      });
    }

    const result = await pool.query(
      "INSERT INTO categories (name, icon, color, image) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, icon, color, image]
    );

    res.status(201).json({
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Create category error:", error);
    res.status(500).json({
      error: {
        message: "Internal server error",
        status: 500,
      },
    });
  }
};

// Update category
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, icon, color, image } = req.body;

    const result = await pool.query(
      "UPDATE categories SET name = $1, icon = $2, color = $3, image = $4 WHERE id = $5 RETURNING *",
      [name, icon, color, image, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: {
          message: "Category not found",
          status: 404,
        },
      });
    }

    res.json({
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Update category error:", error);
    res.status(500).json({
      error: {
        message: "Internal server error",
        status: 500,
      },
    });
  }
};

// Delete category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if category is being used by any recipes
    const recipesUsingCategory = await pool.query(
      "SELECT COUNT(*) FROM recipes WHERE category = (SELECT name FROM categories WHERE id = $1)",
      [id]
    );

    if (parseInt(recipesUsingCategory.rows[0].count) > 0) {
      return res.status(400).json({
        error: {
          message: "Cannot delete category that is being used by recipes",
          status: 400,
        },
      });
    }

    const result = await pool.query(
      "DELETE FROM categories WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: {
          message: "Category not found",
          status: 404,
        },
      });
    }

    res.json({
      message: "Category deleted successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Delete category error:", error);
    res.status(500).json({
      error: {
        message: "Internal server error",
        status: 500,
      },
    });
  }
};

export default {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
