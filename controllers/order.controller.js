const mongoose = require("mongoose");

const Order = require("../models/Order");
const Product = require("../models/Product");
const { getIO } = require("../config/socket");

exports.placeOrder = async (req, res, next) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items are required",
      });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findOne({
        _id: item.productId,
        isActive: true,
      });

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} is out of stock`,
        });
      }

      product.stock -= item.quantity;

      await product.save();
      if (product.stock <= 5) {
        const io = getIO();

        io.to(product.sellerId.toString()).emit("lowStock", {
          product: product.name,
          stock: product.stock,
        });
      }

      orderItems.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price,
      });

      totalAmount += product.price * item.quantity;
    }

    const order = await Order.create({
      userId: req.user.userId,
      items: orderItems,
      totalAmount,
    });
    const io = getIO();

    io.to("seller").emit("newOrder", {
      message: "New Order Received",
      order,
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
exports.getOrders = async (req, res, next) => {
  try {
    let orders = [];

    if (req.user.role === "customer") {
      orders = await Order.find({
        userId: req.user.userId,
      }).populate("items.productId");
    } else {
      orders = await Order.find()
        .populate("userId", "name email")
        .populate("items.productId");
    }

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;

    await order.save();
    const io = getIO();

    io.to("admin").emit("orderStatusChanged", {
      orderId: order._id,
      status: order.status,
    });

    io.to(order.userId.toString()).emit("orderStatusUpdated", {
      orderId: order._id,
      status: order.status,
    });

    res.json({
      success: true,
      message: "Order status updated",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
