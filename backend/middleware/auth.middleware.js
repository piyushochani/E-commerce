const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const extracted = token.split(" ")[1]; // Bearer TOKEN

    const decoded = jwt.verify(extracted, process.env.JWT_SECRET);

    req.userId = decoded.customerId || decoded.sellerId;
    req.role = decoded.role;

    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};
