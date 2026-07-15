const router = require("express").Router();
const mongoose = require("mongoose");
const Product = require("../models/Product");

// Helper to check valid MongoDB ObjectID
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * GET /api/products
 * Retrieve all products. Supports optional category filtering.
 */
router.get("/", async (req, res, next) => {
  try {
    const { category } = req.query;
    const filter = {};
    if (category) {
      filter.category = new RegExp(category, "i");
    }
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/products/:id
 * Retrieve a single product by ID.
 */
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid product ID format" });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/products
 * Create a new product.
 */
router.post("/", async (req, res, next) => {
  try {
    const { name, description, imageUrl, category, dailyRate, depositAmount, available } = req.body;

    // Basic request body validation
    const missingFields = [];
    if (!name) missingFields.push("name");
    if (!description) missingFields.push("description");
    if (!category) missingFields.push("category");
    if (dailyRate === undefined) missingFields.push("dailyRate");
    if (depositAmount === undefined) missingFields.push("depositAmount");

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }

    // Number validation
    const rate = Number(dailyRate);
    const deposit = Number(depositAmount);

    if (isNaN(rate) || rate <= 0) {
      return res.status(400).json({ error: "dailyRate must be a positive number" });
    }
    if (isNaN(deposit) || deposit < 0) {
      return res.status(400).json({ error: "depositAmount must be a non-negative number" });
    }

    const product = new Product({
      name,
      description,
      imageUrl,
      category,
      dailyRate: rate,
      depositAmount: deposit,
      available: available !== undefined ? available : true,
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ error: messages.join(", ") });
    }
    next(error);
  }
});

/**
 * PUT /api/products/:id
 * Update an existing product.
 */
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid product ID format" });
    }

    const { name, description, imageUrl, category, dailyRate, depositAmount, available } = req.body;

    // Validate rates/deposits if provided
    if (dailyRate !== undefined) {
      const rate = Number(dailyRate);
      if (isNaN(rate) || rate <= 0) {
        return res.status(400).json({ error: "dailyRate must be a positive number" });
      }
    }
    if (depositAmount !== undefined) {
      const deposit = Number(depositAmount);
      if (isNaN(deposit) || deposit < 0) {
        return res.status(400).json({ error: "depositAmount must be a non-negative number" });
      }
    }

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (imageUrl !== undefined) updates.imageUrl = imageUrl;
    if (category !== undefined) updates.category = category;
    if (dailyRate !== undefined) updates.dailyRate = Number(dailyRate);
    if (depositAmount !== undefined) updates.depositAmount = Number(depositAmount);
    if (available !== undefined) updates.available = available;

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      returnDocument: "after",
      runValidators: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ error: messages.join(", ") });
    }
    next(error);
  }
});

/**
 * DELETE /api/products/:id
 * Delete a product by ID.
 */
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid product ID format" });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully", id });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
