
const express = require("express");
const router = express.Router();

const {
  createReview,
  getProviderReviews
} = require("../controllers/reviewController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Customer submits a review
router.post("/", protect, authorize("customer"), createReview);

// Anyone can view provider reviews
router.get("/:providerId", getProviderReviews);

module.exports = router;
