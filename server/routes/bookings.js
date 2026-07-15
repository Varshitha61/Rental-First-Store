const router = require("express").Router();
const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Product = require("../models/Product");
const { calculateRentalPrice } = require("../utils/bookingUtils");
const authMiddleware = require("../middleware/auth");

// Helper to check valid MongoDB ObjectID
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * POST /api/bookings
 * Creates a new booking.
 * Calculates totalPrice server-side, validates dates, and checks for overlaps.
 */
router.post("/", authMiddleware, async (req, res, next) => {
  try {
    const { productId, startDate, endDate } = req.body;
    const userId = req.user.userId;

    // 1. Basic validation
    if (!productId || !startDate || !endDate) {
      return res.status(400).json({
        error: "productId, startDate, and endDate are required fields.",
      });
    }

    if (!isValidObjectId(productId)) {
      return res.status(400).json({ error: "Invalid product ID format." });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: "Invalid start or end date format." });
    }

    if (start >= end) {
      return res.status(400).json({ error: "Start date must be strictly before end date." });
    }

    // 2. Fetch product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found." });
    }

    if (!product.available) {
      return res.status(400).json({ error: "Product is currently marked as unavailable for rent." });
    }

    // 3. Double-booking check (Overlap detection)
    const overlappingBooking = await Booking.findOne({
      productId,
      status: { $ne: "cancelled" },
      $or: [
        {
          startDate: { $lte: end },
          endDate: { $gte: start },
        },
      ],
    });

    if (overlappingBooking) {
      return res.status(400).json({
        error: "Product is already booked for the selected date range.",
        conflictingBooking: {
          startDate: overlappingBooking.startDate,
          endDate: overlappingBooking.endDate,
        },
      });
    }

    // 4. Calculate pricing server-side
    const totalPrice = calculateRentalPrice(product.dailyRate, start, end);
    const depositAmount = product.depositAmount;

    // 5. Create Booking
    const booking = new Booking({
      productId,
      userId,
      startDate: start,
      endDate: end,
      totalPrice,
      depositAmount,
      status: "confirmed", // Set default status as confirmed for now
    });

    const savedBooking = await booking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ error: messages.join(", ") });
    }
    next(error);
  }
});

/**
 * GET /api/bookings/:userId
 * List all bookings for a specific user, populating the product details.
 */
router.get("/:userId", authMiddleware, async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Prevent users from accessing other users' booking information
    if (req.user.userId !== userId) {
      return res.status(403).json({ error: "Access denied. You can only view your own bookings." });
    }

    const bookings = await Booking.find({ userId })
      .populate("productId")
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/bookings/:id/return
 * Marks a booking status as "returned".
 */
router.put("/:id/return", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid booking ID format." });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ error: "Booking not found." });
    }

    if (booking.status === "returned") {
      return res.status(400).json({ error: "Booking is already marked as returned." });
    }

    booking.status = "returned";
    const updatedBooking = await booking.save();

    res.status(200).json(updatedBooking);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
