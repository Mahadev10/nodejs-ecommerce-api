const express = require("express");
require("dotenv/config");
const morgan = require("morgan");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
app.use(morgan("tiny"));
const productSchema = mongoose.Schema({
  name: String,
  image: String,
  countInStock: Number,
});
const Product = mongoose.model("Product", productSchema);
const api = process.env.API_URL;

mongoose
  .connect("mongodb://localhost/eshop-database")
  .then(() => {
    console.log("Database Connection is ready");
  })
  .catch((err) => {
    console.log(err);
  });
app.listen(3000, () => {
  console.log("server is running http://localhost:3000");
});
