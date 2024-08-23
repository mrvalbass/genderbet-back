const express = require("express");
const router = express.Router();
const User = require("../models/users");

router.post("/", async (req, res) => {
  try {
    const user = await new User(req.body).save();
    res.json({ user });
  } catch (error) {
    res.json({ error });
  }
});

module.exports = router;
