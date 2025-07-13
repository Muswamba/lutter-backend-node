const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
   const authHeader = req.headers.authorization; // lowercase 'authorization' is correct
   const token = authHeader && authHeader.split(" ")[1]; // Expected: "Bearer <token>"
   if (!token) {
      return res.status(401).json({ message: "No token provided" });
   }
   try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Store the userId and other info in req.user
      next();
   } catch (error) {
      console.error("Error verifying token:", error);
      return res.status(401).json({ message: "Invalid or expired token" });
   }
};

module.exports = verifyToken;
