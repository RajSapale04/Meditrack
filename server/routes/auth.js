const { login, register } = require("../controllers/auth");
const passport =require("passport");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
router.post("/login", login);
router.post("/register", register);
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/me", auth, (req, res) => {
    console.log("GET /me called");
    console.log("Authenticated user:", req.user);
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.json({ user: req.user });
});
router.get("/google/callback", passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign({ userId: req.user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true }).redirect(process.env.CLIENT_URL + "/dashboard");
  }
);

router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  return res.json({ message: "Logged out" });
});

module.exports = router;