const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/role.middleware");

const {
    sellerRevenue,
    topProducts,
    monthlyRevenue,
    dashboard,
    lowStockProducts,
} = require("../controllers/report.controller");

router.get(
    "/seller-revenue",
    auth,
    allowRoles("admin"),
    sellerRevenue
);

router.get(
    "/top-products",
    auth,
    allowRoles("admin"),
    topProducts
);

router.get(
    "/monthly-revenue",
    auth,
    allowRoles("admin"),
    monthlyRevenue
);

router.get(
    "/dashboard",
    auth,
    allowRoles("admin"),
    dashboard
);

router.get(
    "/low-stock",
    auth,
    allowRoles("admin"),
    lowStockProducts
);

module.exports = router;