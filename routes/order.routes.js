const express = require("express");

const router = express.Router();

const auth = require("../middleware/auth.middleware");
const allowRoles = require("../middleware/role.middleware");

const {
    placeOrder,
    getOrders,
    updateOrderStatus,
} = require("../controllers/order.controller");

router.post(
    "/",
    auth,
    allowRoles("customer"),
    placeOrder
);

router.get(
    "/",
    auth,
    getOrders
);

router.patch(
    "/:id/status",
    auth,
    allowRoles("admin"),
    updateOrderStatus
);

module.exports = router;