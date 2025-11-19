
const express = require("express");
const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");


const productController = require("../controllers/productController");


router.get("/", authenticateToken, productController.getProducts);
router.get("/:productId", authenticateToken, productController.getSpecificProduct)
router.post("/", authenticateToken, productController.addProduct)
router.delete("/:productId", authenticateToken, productController.deleteSpecificProduct)
router.put("/:productId", authenticateToken, productController.updateSpecificProductDetails)

module.exports = router;