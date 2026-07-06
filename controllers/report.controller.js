const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

exports.sellerRevenue = async (req, res, next) => {
    try {

        const data = await Order.aggregate([
            {
                $unwind: "$items"
            },
            {
                $lookup: {
                    from: "products",
                    localField: "items.productId",
                    foreignField: "_id",
                    as: "product"
                }
            },
            {
                $unwind: "$product"
            },
            {
                $group: {
                    _id: "$product.sellerId",
                    totalOrders: {
                        $sum: 1
                    },
                    revenue: {
                        $sum: {
                            $multiply: [
                                "$items.quantity",
                                "$items.price"
                            ]
                        }
                    }
                }
            }
        ]);

        res.json({
            success: true,
            data
        });

    } catch (error) {
        next(error);
    }
};

exports.topProducts = async (req, res, next) => {

    try {

        const data = await Order.aggregate([
            {
                $unwind: "$items"
            },
            {
                $group: {
                    _id: "$items.productId",
                    totalSold: {
                        $sum: "$items.quantity"
                    }
                }
            },
            {
                $sort: {
                    totalSold: -1
                }
            },
            {
                $limit: 5
            },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "product"
                }
            }
        ]);

        res.json({
            success: true,
            data
        });

    } catch (error) {
        next(error);
    }

};
exports.monthlyRevenue = async (req, res, next) => {

    try {

        const data = await Order.aggregate([
            {
                $group: {
                    _id: {
                        year: {
                            $year: "$createdAt"
                        },
                        month: {
                            $month: "$createdAt"
                        }
                    },
                    revenue: {
                        $sum: "$totalAmount"
                    }
                }
            },
            {
                $sort: {
                    "_id.year": 1,
                    "_id.month": 1
                }
            }
        ]);

        res.json({
            success: true,
            data
        });

    } catch (error) {

        next(error);

    }

};
exports.dashboard = async (req, res, next) => {

    try {

        const totalUsers =
            await User.countDocuments();

        const totalProducts =
            await Product.countDocuments({
                isActive: true
            });

        const totalOrders =
            await Order.countDocuments();

        const revenue = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: {
                        $sum: "$totalAmount"
                    }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                totalUsers,
                totalProducts,
                totalOrders,
                totalRevenue:
                    revenue[0]?.totalRevenue || 0
            }
        });

    } catch (error) {

        next(error);

    }

};
exports.lowStockProducts = async (
    req,
    res,
    next
) => {

    try {

        const products = await Product.find({
            stock: {
                $lte: 5
            },
            isActive: true
        }).populate(
            "sellerId",
            "name email"
        );

        res.json({
            success: true,
            data: products
        });

    } catch (error) {

        next(error);

    }

};