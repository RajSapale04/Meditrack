const { Profile } = require("../models");
const { get } = require("../routes/auth");

async function getProfiles(req, res) {
    
      try {
    const profiles = await Profile.findAll({ where: { userId: req.user.id } });
    res.json(profiles);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profiles" });
  }
}
async function getProfile(req, res) {
      try {
    const profile = await Profile.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!profile) return res.status(404).json({ error: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
}

async function createProfile(req, res) {
      try {
    const { name, age } = req.body;

    // limit check
    const count = await Profile.count({ where: { userId: req.user.id } });
    if (count >= 6) {
      return res.status(400).json({ error: "Maximum 6 profiles allowed" });
    }

    const profile = await Profile.create({
      name,
      age,
      userId: req.user.id,
    });

    res.status(201).json(profile);
  } catch (err) {
    res.status(500).json({ error: "Failed to create profile" });
  }
}

async function deleteProfile(req, res) {
      try {
    const profile = await Profile.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!profile) return res.status(404).json({ error: "Profile not found" });

    await profile.destroy();
    res.json({ message: "Profile deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete profile" });
  }
}
async function updateProfile(req, res) {
      try {
    const { name, age } = req.body;

    const profile = await Profile.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!profile) return res.status(404).json({ error: "Profile not found" });

    profile.name = name ?? profile.name;
    profile.age = age ?? profile.age;
    await profile.save();

    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile" });
  }
}

module.exports = {
  getProfiles,
  getProfile,
  deleteProfile,
  updateProfile,    
  createProfile,
};
