
const express = require("express");

const router = express.Router();

const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require("../controllers/categoryController");

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");

// Anyone can view active categories
router.get("/", getCategories);

// Only admins can manage categories
router.post("/", protect, authorize("admin"), createCategory);

router.put("/:id", protect, authorize("admin"), updateCategory);

router.delete("/:id", protect, authorize("admin"), deleteCategory);

module.exports = router;
