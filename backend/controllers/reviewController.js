
const Review = require("../models/Review");
const Booking = require("../models/Booking");

// CREATE REVIEW
const createReview = async (req, res) => {
  try {
    const { bookingId, rating, feedback } = req.body;

    if (!bookingId || !rating) {
      return res.status(400).json({
        success: false,
        message: "Booking ID and rating are required"
      });
    }

    if (!Number.isInteger(Number(rating)) || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5"
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    if (booking.customerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You can only review your own bookings"
      });
    }

    if (booking.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "You can only review completed bookings"
      });
    }

    const existingReview = await Review.findOne({ bookingId });

    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this booking"
      });
    }

    const review = await Review.create({
      customerId: req.user.id,
      providerId: booking.providerId,
      bookingId,
      rating: Number(rating),
      feedback
    });

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET REVIEWS FOR A PROVIDER
const getProviderReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      providerId: req.params.providerId
    }).populate("customerId", "name");

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createReview,
  getProviderReviews
};
