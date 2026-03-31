const express = require("express");

const { createProduct , getItem } = require("../controllers/product.controller");

const router = express.Router();


router.post("/", createProduct);
router.get("/get-item", getItem )


router.get("/", (req, res) => {
  res.send("Product API working");
});

module.exports = router;
