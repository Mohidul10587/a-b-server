"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPassword = exports.loginUser = exports.checkUser = exports.registerUser = void 0;
const user_model_1 = __importDefault(require("./user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, image } = req.body;
        // Check if user already exists
        const existingUser = yield user_model_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({
                success: false,
                message: "User already exists with this email",
            });
        }
        // Hash password
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        // Create new user
        const user = new user_model_1.default({
            name,
            email,
            password: hashedPassword,
            image,
        });
        // Save user to database
        yield user.save();
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, "JWT_SECRET", { expiresIn: "1h" });
        // Send response with token
        res.status(201).json({
            success: true,
            data: user,
            token,
            message: "User registered successfully",
        });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ success: false, message: "User registration failed" });
    }
});
exports.registerUser = registerUser;
// Route to check user authentication
const checkUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({
        success: true,
        message: "User authenticated successfully",
        data: req.user, // User object retrieved from middleware
    });
});
exports.checkUser = checkUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Find user by email
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }
        // Check if password matches
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid password" });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, "JWT_SECRET", { expiresIn: "1h" });
        // Send response with token
        res.status(200).json({
            success: true,
            data: user,
            token,
            message: "User logged in successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "User login failed" });
    }
});
exports.loginUser = loginUser;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, newPassword } = req.body;
        // Find user by email
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }
        // Update user's password
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        yield user.save();
        // Send response
        res
            .status(200)
            .json({ success: true, message: "Password updated successfully" });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ success: false, message: "Failed to update password" });
    }
});
exports.forgotPassword = forgotPassword;
