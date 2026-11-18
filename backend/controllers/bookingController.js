
const Booking = require("../models/Booking");
const Provider = require("../models/Provider");

// CREATE BOOKING
const createBooking = async (req, res) => {
  try {
    const { providerId, bookingDate, bookingTime, address } = req.body;

    if (!providerId || !bookingDate || !bookingTime || !address) {
      return res.status(400).json({
        success: false,
        message: "Please provide all booking details"
      });
    }

    const provider = await Provider.findById(providerId);

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Provider not found"
      });
    }

    const booking = await Booking.create({
      customerId: req.user.id,
      providerId,
      bookingDate,
      bookingTime,
      address
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET CUSTOMER BOOKINGS
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      customerId: req.user.id
    }).populate({
      path: "providerId",
      select: "serviceName price location userId category",
      populate: [
        {
          path: "userId",
          select: "name email"
        },
        {
          path: "category",
          select: "name"
        }
      ]
    });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
// GET PROVIDER BOOKINGS
const getProviderBookings = async (req, res) => {
  try {
    const provider = await Provider.findOne({
      userId: req.user.id
    });

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Provider profile not found"
      });
    }

    const bookings = await Booking.find({
      providerId: provider._id
    }).populate("customerId", "name email");

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE BOOKING STATUS
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
  "accepted",
  "rejected",
  "completed",
  "cancelled"
];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status"
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found"
      });
    }

    // Providers can manage their own bookings
    if (req.user.role === "provider") {
      const provider = await Provider.findOne({
        userId: req.user.id
      });

      if (!provider || booking.providerId.toString() !== provider._id.toString()) {
        return res.status(403).json({
          success: false,
          message: "You cannot update this booking"
        });
      }

      if (!["accepted", "rejected", "completed"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status for provider"
        });
      }
    }

    // Customers can cancel their own bookings
    else if (req.user.role === "customer") {
      if (booking.customerId.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "You cannot update this booking"
        });
      }

      if (status !== "cancelled") {
        return res.status(400).json({
          success: false,
          message: "Customers can only cancel bookings"
        });
      }
    } else {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    if (["rejected", "completed", "cancelled"].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message: "This booking can no longer be updated"
      });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getProviderBookings,
  updateBookingStatus
};
