const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");


//signup pages
exports.signup = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await pool.query(
      "INSERT INTO users(name,email,phone,password) VALUES($1,$2,$3,$4) RETURNING *",
      [name, email, phone, hashedPassword]
    );

    res.json({
      message: "User registered",
      user: user.rows[0],
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};


//login pages
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!validPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

     res.json({
   message: "Login successful",
  token,
  user: {
    id: user.rows[0].id,
    name: user.rows[0].name,
    email: user.rows[0].email
  }
     });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};


//phone otp login
exports.sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    const user = await pool.query(
      "SELECT * FROM users WHERE phone=$1",
      [phone]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets:false,
      lowerCaseAlphabets:false,
      specialChars:false
    });

    const expiry = new Date(Date.now() + 5 * 60 * 1000);

    await pool.query(
      "UPDATE users SET otp=$1, otp_expiry=$2 WHERE phone=$3",
      [otp, expiry, phone]
    );

    console.log("OTP:", otp);

    res.json({
      message: "OTP sent successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

//verify otp
exports.verifyOTP = async (req, res) => {

  const { phone, otp } = req.body;

  const user = await pool.query(
    "SELECT * FROM users WHERE phone=$1",
    [phone]
  );

  if (user.rows.length === 0) {
    return res.status(400).json({ message:"User not found"});
  }

  if (user.rows[0].otp !== otp) {
    return res.status(400).json({ message:"Invalid OTP"});
  }

  const token = jwt.sign(
    { id: user.rows[0].id },
    process.env.JWT_SECRET,
    { expiresIn:"1d" }
  );

  res.json({
    message:"OTP verified",
    token
  });
};