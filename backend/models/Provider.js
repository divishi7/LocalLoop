
const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    serviceName: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    description: {
      type: String,
      required: true
    },

    experience: {
      type: Number,
      required: true,
      min: 0
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    location: {
      type: String,
      required: true
    },

    contact: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Provider", providerSchema);
