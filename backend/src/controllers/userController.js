import pool from "../config/database.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Get user by email
const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const result = await pool.query(
      "SELECT id, email, name, picture, credits, pref, created_at, updated_at FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: {
          message: "User not found",
          status: 404,
        },
      });
    }

    res.json({
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Get user by email error:", error);
    res.status(500).json({
      error: {
        message: "Internal server error",
        status: 500,
      },
    });
  }
};

// Create new user
const createUser = async (req, res) => {
  try {
    const { email, name, picture } = req.body;

    // Check if user already exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        error: {
          message: "User already exists",
          status: 400,
        },
      });
    }

    // Create new user
    const result = await pool.query(
      "INSERT INTO users (email, name, picture, credits) VALUES ($1, $2, $3, $4) RETURNING id, email, name, picture, credits, pref, created_at, updated_at",
      [email, name, picture, 10] // Default 10 credits
    );

    res.status(201).json({
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Create user error:", error);
    res.status(500).json({
      error: {
        message: "Internal server error",
        status: 500,
      },
    });
  }
};

// Update user
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, picture, credits, pref } = req.body;

    const updateFields = [];
    const values = [];
    let paramCount = 1;

    if (name !== undefined) {
      updateFields.push(`name = $${paramCount}`);
      values.push(name);
      paramCount++;
    }

    if (email !== undefined) {
      updateFields.push(`email = $${paramCount}`);
      values.push(email);
      paramCount++;
    }

    if (picture !== undefined) {
      updateFields.push(`picture = $${paramCount}`);
      values.push(picture);
      paramCount++;
    }

    if (credits !== undefined) {
      updateFields.push(`credits = $${paramCount}`);
      values.push(credits);
      paramCount++;
    }

    if (pref !== undefined) {
      updateFields.push(`pref = $${paramCount}`);
      values.push(JSON.stringify(pref));
      paramCount++;
    }

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
      UPDATE users 
      SET ${updateFields.join(", ")}, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $${paramCount} 
      RETURNING id, email, name, picture, credits, pref, created_at, updated_at
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: {
          message: "User not found",
          status: 404,
        },
      });
    }

    res.json({
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({
      error: {
        message: "Internal server error",
        status: 500,
      },
    });
  }
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, email, name, picture, credits, pref, created_at, updated_at FROM users ORDER BY created_at DESC"
    );

    res.json({
      data: result.rows,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      error: {
        message: "Internal server error",
        status: 500,
      },
    });
  }
};

export default { getUserByEmail, createUser, updateUser, getAllUsers };
