const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Product ID is required"],
    },
    userId: {
      type: String,
      required: [true, "User ID is required"],
      trim: true,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
      min: [0, "Total price cannot be negative"],
    },
    depositAmount: {
      type: Number,
      required: [true, "Deposit amount is required"],
      min: [0, "Deposit amount cannot be negative"],
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "confirmed", "returned", "cancelled"],
        message: "Status must be pending, confirmed, returned, or cancelled",
      },
      default: "pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
