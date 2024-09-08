const express = require("express");
const uid2 = require("uid2");
const bcrypt = require("bcrypt");
const router = express.Router();
const User = require("../models/users");

router.post("/signUp", async (req, res) => {
  try {
    if (req.body.password.length < 6)
      throw new Error("password must be at least 6 characters");
    const user = await new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
      token: uid2(32),
      predictions: {
        gender: null,
        firstName: {
          boy: [],
          girl: [],
        },

        birthDay: null,
      },
    }).save();
    res.json({ result: true, user });
  } catch (error) {
    console.log(error.message);

    res.json({ result: false, error: error.message });
  }
});

router.post("/signIn", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw new Error("User not found");
    if (!bcrypt.compareSync(req.body.password, user.password))
      throw new Error("Password is incorrect");
    res.json({ result: true, user });
  } catch (error) {
    res.json({ result: false, error: error.message });
  }
});

router.get("/:token", async (req, res) => {
  try {
    const user = await User.findOne(
      { token: req.params.token },
      "name email token predictions"
    );
    res.json({ result: true, user });
  } catch (error) {
    res.json({ result: false, error: error.message });
  }
});

router.put("/updateGender", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { token: req.body.token },
      { "predictions.gender": req.body.gender },
      { new: true }
    );
    res.json({ result: true, user });
  } catch (error) {
    res.json({ result: false, error: error.message });
  }
});

router.put("/updateFirstName", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { token: req.body.token },
      {
        "predictions.firstName": {
          boy: req.body.boy,
          girl: req.body.girl,
        },
      },
      { new: true }
    );
    res.json({ result: true, user });
  } catch (error) {
    res.json({ result: false, error: error.message });
  }
});

router.put("/updateBirthday", async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { token: req.body.token },
      {
        "predictions.birthDay": req.body.date,
      },
      { new: true }
    );
    res.json({ result: true, user });
  } catch (error) {
    res.json({ result: false, error: error.message });
  }
});

router.put("/updatePassword", async (req, res) => {
  try {
    if (req.body.password.length < 6)
      throw new Error("password must be at least 6 characters");
    const user = await User.findOneAndUpdate(
      { email: req.body.email },
      {
        password: bcrypt.hashSync(req.body.password, 10),
      },
      { new: true }
    );
    if (!user) throw new Error("User not found");
    res.json({ result: true, user });
  } catch (error) {
    res.json({ result: false, error: error.message });
  }
});

module.exports = router;
