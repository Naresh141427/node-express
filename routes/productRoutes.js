
const express = require("express");
const router = express.Router();


const authenticateToken = require("../middleware/authMiddleware");


const productController = require("../controllers/productController");


router.get("/", authenticateToken, productController.getProducts);

module.exports = router;