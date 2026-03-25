const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");

//generate username
const generateUsername = async (name) => {

  let baseUsername = name.toLowerCase().replace(/\s+/g, "");

  let username = baseUsername;
  let counter = 1;

  while (true) {

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE username=$1",
      [username]
    );

    if (existingUser.rows.length === 0) {
      return username;
    }

    username = baseUsername + counter;
    counter++;

  }

};
//signup pages
exports.signup = async (req,res)=>{
  try{

    const {name,email,password} = req.body;

    const hashedPassword = await bcrypt.hash(password,10);

    const username = await generateUsername(name); // ✅ FIX
    console.log("Generated username:", username);

    const user = await pool.query(
      "INSERT INTO users(name,email,password,username) VALUES($1,$2,$3,$4) RETURNING *",
      [name,email,hashedPassword,username]
    );

    res.json({
      message:"Signup successful",
      user:user.rows[0]
    });

  }catch(err){
    console.error(err);
    res.status(500).send("Server error");
  }
}


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
    email: user.rows[0].email,
    username: user.rows[0].username
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