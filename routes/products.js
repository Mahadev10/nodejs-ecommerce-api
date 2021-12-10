const { Product } = require("../models/product");
const express = require("express");
const { Category } = require("../models/category");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    let filter = {};
    if (req.query.categories) {
      filter = { category: req.query.categories.split(",") };
    }
    const productList = await Product.find(filter).populate("category");
    if (productList.length === 0)
      return res.status(200).json({ message: "productList is empty." });
    else return res.send(productList);
  } catch (err) {
    return res.status(400).json({ errorMessage: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.status(200).send(product);
    } else
      res
        .status(500)
        .json({ message: "The product with the given Id was not found." });
  } catch (err) {
    res.status(400).json({ success: false, errorMessage: err.message });
  }
});

router.get("/get/count", async (req, res) => {
  try {
    const productCount = await Product.countDocuments();
    res.send({ productCount: productCount });
  } catch (err) {
    res.status(400).json({ errorMessage: err });
  }
});

router.post("/", async (req, res) => {
  try {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).json({ message: "Invalid Category" });
    let product = new Product({
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    });
    product = await product.save();
    if (product) return res.send(product);
    else
      return res
        .status(500)
        .json({ message: "The product cannot be created!" });
  } catch (err) {
    res.status(400).json({ errorMessage: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.body.category);
    if (!category) return res.status(400).json({ message: "Invalid Category" });
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: req.body.image,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured,
      },
      { new: true }
    );
    if (product) {
      return res.status(200).json({
        success: true,
        message: "The product is updated",
        product: product,
      });
      category;
      category;
    } else
      return res
        .status(404)
        .json({ success: false, message: "product not found!" });
  } catch (err) {
    res.status(400).json({ success: false, errorMessage: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (product)
      return res
        .status(200)
        .json({ success: true, message: "The product is removed" });
    else
      return res
        .status(404)
        .json({ success: false, message: "product not found!" });
  } catch (err) {
    res.status(400).json({ success: false, errorMessage: err.message });
  }
});

router.get("/get/featured/", async (req, res) => {
  try {
    const count = Number.parseInt(req.query.count) || 5;
    console.log(count);
    const productList = await Product.find({ isFeatured: true })
      .limit(count)
      .populate("category");
    if (productList) res.send(productList);
    else res.status(400).json({ success: false });
  } catch (err) {
    res.status(400).json({ errorMessage: err });
  }
});
module.exports = router;
