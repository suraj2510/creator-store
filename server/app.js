const express = require("express");
const cors = require("cors");
require("dotenv").config();

const rateLimit = require("express-rate-limit"); // ✅ ADD THIS
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());


// ✅ LOGIN RATE LIMITER
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // max 10 login attempts
  message: "Too many login attempts. Try again later."
});

// apply limiter only on login route
app.use("/api/auth/login", loginLimiter);


app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Server Running...");
});

app.listen(process.env.PORT, () => {
  console.log("Server running on port", process.env.PORT);
});