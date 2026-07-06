const express = require("express");

const router = express.Router();

router.use("/auth", require("./auth.routes"));
router.use("/products", require("./product.routes"));
router.use("/orders", require("./order.routes"));
router.use("/reports", require("./report.routes"));

module.exports = router;
