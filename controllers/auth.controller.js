const bcrypt = require("bcryptjs");

const User = require("../models/User");
const generateToken = require("../utills/generateToken");


// Register
exports.register = async (req, res, next) => {
    try {

        const { name, email, password, role } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "Email already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: user,
        });

    } catch (error) {
        next(error);
    }
};


// Login
exports.login = async (req, res, next) => {
    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        const token = generateToken(user);

        res.json({
            success: true,
            token,
        });

    } catch (error) {
        next(error);
    }
};