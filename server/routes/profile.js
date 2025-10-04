const express = require("express");
const auth = require("../middleware/auth");
const { getProfiles, getProfile, createProfile, deleteProfile, updateProfile } = require("../controllers/profile");
const router = express.Router();

router.use(auth);

router.get("/", getProfiles);
router.get("/:id", getProfile);
router.post("/", createProfile);
router.delete("/:id", deleteProfile);
router.put("/:id", updateProfile);

module.exports = router;