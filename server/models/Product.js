const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
    },
    imageUrl: {
      type: String,
      default: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3", // default fallback
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      trim: true,
    },
    dailyRate: {
      type: Number,
      required: [true, "Daily rental rate is required"],
      min: [0.01, "Daily rate must be a positive number"],
    },
    depositAmount: {
      type: Number,
      required: [true, "Deposit amount is required"],
      min: [0, "Deposit amount cannot be negative"],
    },
    available: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // adds updatedAt automatically as well, keeping createdAt compatible
  }
);

module.exports = mongoose.model("Product", productSchema);
