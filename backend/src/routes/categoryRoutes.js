import express from "express";
import categoryController from "../controllers/categoryController.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Get all categories
router.get("/", categoryController.getAllCategories);

// Get category by ID
router.get("/:id", categoryController.getCategoryById);

// Create new category (admin only)
router.post("/", auth, categoryController.createCategory);

// Update category (admin only)
router.put("/:id", auth, categoryController.updateCategory);

// Delete category (admin only)
router.delete("/:id", auth, categoryController.deleteCategory);

export default router;
