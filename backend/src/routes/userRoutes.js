import express from "express";
import userController from "../controllers/userController.js";
import { clerkAuth } from "../middleware/clerkAuth.js";
import { validateUser } from "../middleware/validation.js";

const router = express.Router();

// Get user by email
router.get("/email/:email", userController.getUserByEmail);

// Create new user
router.post("/", validateUser, userController.createUser);

// Update user
router.put("/:id", clerkAuth, validateUser, userController.updateUser);

// Get all users (admin only)
router.get("/", clerkAuth, userController.getAllUsers);

export default router;
