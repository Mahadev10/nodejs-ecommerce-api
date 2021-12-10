const { Category } = require("../models/category");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const categoryList = await Category.find();
    if (categoryList.length === 0)
      return res.status(200).json({ message: "categoryList is empty." });
    else return res.send(categoryList);
  } catch (err) {
    return res.status(400).json({ success: false, errorMessage: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      res.status(200).send(category);
    } else
      res
        .status(500)
        .json({ message: "The category with the given Id was not found." });
  } catch (err) {
    res.status(400).json({ success: false, errorMessage: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    let category = new Category({
      name: req.body.name,
      icon: req.body.icon,
      color: req.body.color,
    });
    category = await category.save();
    if (!category)
      return res.status(404).send("The category cannot be created");
    res.send(category);
  } catch (err) {
    res.status(400).json({ success: false, errorMessage: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        icon: req.body.icon,
        color: req.body.color,
      },
      { new: true }
    );
    console.log(category);
    if (category) {
      return res.status(200).json({
        success: true,
        message: "The category is updated",
        category: category,
      });
    } else
      return res
        .status(404)
        .json({ success: false, message: "category not found!" });
  } catch (err) {
    res.status(400).json({ success: false, errorMessage: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndRemove(req.params.id);
    if (category) {
      return res
        .status(200)
        .json({ success: true, message: "The category is removed" });
    } else
      return res
        .status(404)
        .json({ success: false, message: "category not found!" });
  } catch (err) {
    res.status(400).json({ success: false, errorMessage: err.message });
  }
});
module.exports = router;
