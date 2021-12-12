const { User } = require("../models/user");
const express = require("express");
const { request } = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
  const userList = await User.find().select("-passwordHash -__v");

  if (!userList) {
    return res.status(500).json({ success: false });
  }
  return res.send(userList);
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-passwordHash -__v"
    );
    if (user) {
      res.status(200).send(user);
    } else
      res
        .status(404)
        .json({ message: "The user with the given Id was not found." });
  } catch (err) {
    res.status(400).json({ success: false, errorMessage: err.message });
  }
});

router.get("/get/count", async (req, res) => {
  try {
    const userCount = await User.find().count();
    res.send({ userCount: userCount });
  } catch (err) {
    res.status(400).json({ errorMessage: err });
  }
});

router.post("/", async (req, res) => {
  try {
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(req.body.password, 10),
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    });
    user = await user.save();
    if (!user)
      return res.status(400).send({ message: "User cannot be created" });
    res.send(user);
  } catch (err) {
    res.status(400).json({ errorMessage: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    console.log(req.body.email);
    const user = await User.findOne({
      email: req.body.email,
    });
    if (!user) return res.status(400).send({ message: "The user not found" });
    const secret = process.env.SECRET;
    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
      const token = jwt.sign(
        {
          userId: user.id,
          isAdmin: user.isAdmin,
        },
        secret,
        { expiresIn: "1d" }
      );
      return res.send({ email: user.email, token: token });
    } else {
      return res.status(400).send({ message: "User Not Authenticated" });
    }
  } catch (err) {
    res.status(400).json({ success: false, errorMessage: err.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      passwordHash: bcrypt.hashSync(req.body.password, 10),
      phone: req.body.phone,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    });
    user = await user.save();
    if (!user)
      return res.status(400).send({ message: "User cannot be created" });
    res.send(user);
  } catch (err) {
    res.status(400).json({ errorMessage: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByIdAndDelete(id);
    if (user) {
      return res
        .status(200)
        .json({ success: true, message: "The user is removed" });
    } else
      return res
        .status(404)
        .json({ success: false, message: "user not found!" });
  } catch (err) {
    res.status(400).json({ success: false, errorMessage: err.message });
  }
});
module.exports = router;
