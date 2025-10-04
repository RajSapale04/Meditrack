const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {User} = require("../models/index");

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

function isValidEmail(email) {

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Helper: Validate password strength (min 6 chars)
function isValidPassword(password) {
  return typeof password === "string" && password.length >= 6;
}

// Helper: Validate username (min 3 chars)
function isValidName(name) {
  return typeof name === "string" && name.trim().length >= 3;
}

function validate(email, password, name) {
  if (!isValidName(name)) {
    return { valid: false, message: "Name must be at least 3 characters" };
  }
  if (!isValidEmail(email)) {
    return { valid: false, message: "Invalid email format" };
  }
  if (!isValidPassword(password)) {
    return { valid: false, message: "Password must be at least 6 characters" };
  }
  return { valid: true };
}

// Register controller
async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    const { valid, message } = validate(email, password, name);
    if (!valid) {
      return res.status(400).json({ message });
    }
    let user = await User.findOne({ where: { email } });
    if (user) return res.status(400).json({ message: "User already exists" });

    user = await User.create({ name, email, password });
    const token = generateToken(user.id);
    res
      .cookie("token", token, { httpOnly: true })
      .json({ message: "Logged in" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

// Login controller
async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });
    // Example: create JWT token
    const token = generateToken(user.id);
    res
      .cookie("token", token, { httpOnly: true })
      .json({ message: "Logged in" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

async function logout(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  return res.json({ message: "Logged out" });
} 

async function getMe(req, res) {
    console.log("GET /me called");
    console.log("Authenticated user:", req.user);
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.json({ user: req.user });
}

module.exports = {
  register,
  login,
  logout,
  getMe,
};
