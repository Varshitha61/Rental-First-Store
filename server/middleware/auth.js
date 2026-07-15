const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ error: "Access denied. No authorization header provided." });
    }

    // Expecting format: "Bearer <token>"
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ error: "Authorization format is Bearer <token>" });
    }

    const token = parts[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_super_secret_key_here");

    // Attach decoded user info (e.g. userId, email, name) to req.user
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired authentication token." });
  }
};

module.exports = authMiddleware;
