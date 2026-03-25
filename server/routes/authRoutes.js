const express = require("express");
const router = express.Router();

const rateLimit = require("express-rate-limit"); // ✅ ADD

const {
 signup,
 login,
 sendOTP,
 verifyOTP
} = require("../controllers/authController");


// ✅ LOGIN RATE LIMITER
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 login attempts
  message: "Too many login attempts. Try again later."
});


router.post("/signup", signup);
router.post("/login", loginLimiter, login); // ✅ APPLY LIMITER HERE
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

module.exports = router;