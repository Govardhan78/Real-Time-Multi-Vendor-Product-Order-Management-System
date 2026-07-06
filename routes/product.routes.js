const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/role.middleware");
const upload = require("../middleware/upload.middleware");

const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

router.get("/", getProducts);

router.post(
  "/",
  auth,
  allowRoles("seller", "admin"),
  upload.array("images", 5),
  createProduct,
);

router.put(
  "/:id",
  auth,
  allowRoles("seller", "admin"),
  upload.array("images", 5),
  updateProduct,
);

router.delete("/:id", auth, allowRoles("seller", "admin"), deleteProduct);

module.exports = router;
