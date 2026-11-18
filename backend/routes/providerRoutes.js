
const express = require("express");

const router = express.Router();

const {
  createProvider,
  getProviders,
  getProviderById,
  updateProvider,
  deleteProvider
} = require("../controllers/providerController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Anyone can view providers
router.get("/", getProviders);
router.get("/:id", getProviderById);

// Only logged-in providers can create profiles
router.post("/", protect, authorize("provider"), createProvider);

// Providers can update or delete their own profiles
router.put("/:id", protect, authorize("provider"), updateProvider);
router.delete("/:id", protect, authorize("provider"), deleteProvider);

module.exports = router;
