const { login, register ,logout, getMe} = require("../controllers/auth");
const passport =require("passport");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
router.post("/login", login);
router.post("/register", register);
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/me", auth, getMe);
router.get("/google/callback", passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign({ userId: req.user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.cookie("token", token, { httpOnly: true }).redirect(process.env.CLIENT_URL + "/dashboard");
  }
);

router.post("/logout", logout);

module.exports = router;