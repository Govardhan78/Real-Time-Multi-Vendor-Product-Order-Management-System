const Product = require("../models/Product");

exports.createProduct = async (req, res, next) => {
  try {
    const images = req.files ? req.files.map((file) => file.filename) : [];

    const product = await Product.create({
      ...req.body,
      images,
      sellerId: req.user.userId,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = req.query.search || "";

    const filter = {
      isActive: true,
      name: {
        $regex: search,
        $options: "i",
      },
    };

    const products = await Product.find(filter)
      .populate("sellerId", "name email")
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      total,
      page,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (
      req.user.role !== "admin" &&
      product.sellerId.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    Object.assign(product, req.body);

    if (req.files.length > 0) {
      product.images = req.files.map((file) => file.filename);
    }

    await product.save();

    res.json({
      success: true,
      message: "Product updated",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (
      req.user.role !== "admin" &&
      product.sellerId.toString() !== req.user.userId
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    product.isActive = false;

    await product.save();

    res.json({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    next(error);
  }
};
