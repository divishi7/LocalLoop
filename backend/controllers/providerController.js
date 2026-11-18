
const Provider = require("../models/Provider");
const Category = require("../models/Category");

// CREATE PROVIDER PROFILE
const createProvider = async (req, res) => {
  try {
    const {
      serviceName,
      category,
      description,
      experience,
      price,
      location,
      contact
    } = req.body;

    if (
      !serviceName ||
      !category ||
      !description ||
      experience === undefined ||
      price === undefined ||
      !location ||
      !contact
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required provider details"
      });
    }

    const existingProvider = await Provider.findOne({
      userId: req.user.id
    });

    if (existingProvider) {
      return res.status(409).json({
        success: false,
        message: "Provider profile already exists"
      });
    }

    const validCategory = await Category.findOne({
      _id: category,
      isActive: true
    });

    if (!validCategory) {
      return res.status(400).json({
        success: false,
        message: "Invalid or inactive category"
      });
    }

    const provider = await Provider.create({
      userId: req.user.id,
      serviceName,
      category,
      description,
      experience,
      price,
      location,
      contact
    });

    res.status(201).json({
      success: true,
      message: "Provider profile created successfully",
      provider
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET ALL PROVIDERS
const getProviders = async (req, res) => {
  try {
    const providers = await Provider.find()
      .populate("userId", "name email")
      .populate("category", "name");

    res.status(200).json({
      success: true,
      count: providers.length,
      providers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// GET SINGLE PROVIDER
const getProviderById = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id)
      .populate("userId", "name email")
      .populate("category", "name");

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Provider not found"
      });
    }

    res.status(200).json({
      success: true,
      provider
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// UPDATE PROVIDER PROFILE
const updateProvider = async (req, res) => {
  try {
    const provider = await Provider.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Provider profile not found or access denied"
      });
    }

    const allowedFields = [
      "serviceName",
      "category",
      "description",
      "experience",
      "price",
      "location",
      "contact"
    ];

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        provider[field] = req.body[field];
      }
    }

    await provider.save();

    res.status(200).json({
      success: true,
      message: "Provider profile updated successfully",
      provider
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// DELETE PROVIDER PROFILE
const deleteProvider = async (req, res) => {
  try {
    const provider = await Provider.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!provider) {
      return res.status(404).json({
        success: false,
        message: "Provider profile not found or access denied"
      });
    }

    res.status(200).json({
      success: true,
      message: "Provider profile deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createProvider,
  getProviders,
  getProviderById,
  updateProvider,
  deleteProvider
};
