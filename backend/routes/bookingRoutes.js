
const express = require("express");
const router = express.Router();

const {
  createBooking,
  getMyBookings,
  getProviderBookings,
  updateBookingStatus
} = require("../controllers/bookingController");

const { protect, authorize } = require("../middleware/authMiddleware");

// Customer creates a booking
router.post("/", protect, authorize("customer"), createBooking);

// Customer views their bookings
router.get("/my-bookings", protect, authorize("customer"), getMyBookings);

// Provider views incoming bookings
router.get("/provider-bookings", protect, authorize("provider"), getProviderBookings);

// Customer or provider updates booking status
router.patch("/:id/status", protect, authorize("customer", "provider"), updateBookingStatus);

module.exports = router;
