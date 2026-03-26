import pool from "../config/database.js";

const clerkAuth = async (req, res, next) => {
  try {
    // For now, we'll make authentication optional
    // In production, you should verify Clerk's session token

    // Get user email from query params or headers
    const userEmail = req.query.userEmail || req.headers["x-user-email"];

    if (!userEmail) {
      return res.status(401).json({
        error: {
          message: "User email is required for authentication.",
          status: 401,
        },
      });
    }

    // Get user from database
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      userEmail,
    ]);

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: {
          message: "User not found in database.",
          status: 401,
        },
      });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    console.error("Clerk auth middleware error:", error);
    res.status(401).json({
      error: {
        message: "Authentication failed.",
        status: 401,
      },
    });
  }
};

const optionalClerkAuth = async (req, res, next) => {
  try {
    const userEmail = req.query.userEmail || req.headers["x-user-email"];

    if (userEmail) {
      const result = await pool.query("SELECT * FROM users WHERE email = $1", [
        userEmail,
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

export { clerkAuth, optionalClerkAuth };
