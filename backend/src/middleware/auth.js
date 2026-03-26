import jwt from "jsonwebtoken";
import pool from "../config/database.js";

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        error: {
          message: "Access denied. No token provided.",
          status: 401,
        },
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      decoded.email,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: {
          message: "Invalid token. User not found.",
          status: 401,
        },
      });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({
      error: {
        message: "Invalid token.",
        status: 401,
      },
    });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [
        decoded.email,
      ]);

      if (result.rows.length > 0) {
        req.user = result.rows[0];
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

export { auth, optionalAuth };
