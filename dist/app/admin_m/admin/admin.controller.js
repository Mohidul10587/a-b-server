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
exports.updateAdminEmail = exports.getCountsOfDocuments = exports.updatePassword = exports.refreshToken = exports.loginAdmin = exports.checkAdmin = exports.registerAdmin = void 0;
const admin_model_1 = __importDefault(require("./admin.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
// Define color codes
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
const registerAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, image } = req.body;
        // Check if admin already exists
        const existingAdmin = yield admin_model_1.default.findOne({ email });
        if (existingAdmin) {
            res.status(400).json({
                success: false,
                message: "Admin already exists with this email",
            });
        }
        // Hash password
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        // Create new admin
        const admin = new admin_model_1.default({
            name,
            email,
            password: hashedPassword,
            image,
        });
        // Save admin to database
        yield admin.save();
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ adminId: admin._id, email: admin.email }, JWT_SECRET, { expiresIn: "20s" });
        const refreshToken = jsonwebtoken_1.default.sign({ adminId: admin._id, email: admin.email }, JWT_SECRET, { expiresIn: "40s" });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        // Send response with token
        res.status(201).json({
            success: true,
            data: admin,
            token,
            message: "Admin registered successfully",
        });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ success: false, message: "Admin registration failed" });
    }
});
exports.registerAdmin = registerAdmin;
// Route to check admin authentication
const checkAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({
        success: true,
        message: "Admin authenticated successfully",
        data: req.admin, // Admin object retrieved from middleware
    });
});
exports.checkAdmin = checkAdmin;
const loginAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Find admin by email
        const admin = yield admin_model_1.default.findOne({ email });
        if (!admin) {
            return res
                .status(404)
                .json({ success: false, message: "Admin not found" });
        }
        // Check if password matches
        const isPasswordValid = yield bcryptjs_1.default.compare(password, admin.password);
        if (!isPasswordValid) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid password" });
        }
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ adminId: admin._id, email: admin.email }, JWT_SECRET, { expiresIn: "20s" });
        const refreshToken = jsonwebtoken_1.default.sign({ adminId: admin._id, email: admin.email }, JWT_SECRET, { expiresIn: "1d" });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        // Send response with token
        res.status(200).json({
            success: true,
            data: admin,
            token,
            message: "Admin logged in successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Admin login failed" });
    }
});
exports.loginAdmin = loginAdmin;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        return res
            .status(401)
            .json({ success: false, message: "No refresh token provided" });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(refreshToken, JWT_SECRET);
        const admin = yield admin_model_1.default.findById(payload.adminId);
        if (!admin) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid refresh token" });
        }
        // Generate a new access token
        const accessToken = jsonwebtoken_1.default.sign({ adminId: admin._id, email: admin.email }, JWT_SECRET, { expiresIn: "20s" });
        return res.status(200).json({
            success: true,
            token: accessToken,
            message: "New access token generated successfully",
        });
    }
    catch (error) {
        console.error("Error verifying refresh token:", error);
        return res
            .status(401)
            .json({ success: false, message: "Invalid refresh token" });
    }
});
exports.refreshToken = refreshToken;
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, newPassword } = req.body;
        // Find admin by email
        const admin = yield admin_model_1.default.findOne({ email });
        if (!admin) {
            return res
                .status(404)
                .json({ success: false, message: "Admin not found" });
        }
        // Update admin's password
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        admin.password = hashedPassword;
        yield admin.save();
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
exports.updatePassword = updatePassword;
const getCountsOfDocuments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // try {
    //   const ordersCount = await Order.countDocuments();
    //   const productsCount = await Product.countDocuments();
    //   const categoriesCount = await Category.countDocuments();
    //   const brandsCount = await Brand.countDocuments();
    //   const bannersCount = await Banner.countDocuments();
    //   res.status(200).json({
    //     ordersCount,
    //     productsCount,
    //     categoriesCount,
    //     brandsCount,
    //     bannersCount,
    //   });
    // } catch (error) {
    //   res.status(500).json({ message: "Error retrieving counts", error });
    // }
});
exports.getCountsOfDocuments = getCountsOfDocuments;
// change
// Controller to update admin email
const updateAdminEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { newEmail, password } = req.body;
        const adminId = (_a = req.admin) === null || _a === void 0 ? void 0 : _a._id;
        // Check if admin is authenticated
        if (!adminId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        // Find the admin by ID
        const admin = yield admin_model_1.default.findById(adminId);
        if (!admin) {
            return res
                .status(404)
                .json({ success: false, message: "Admin not found" });
        }
        // Validate password
        const isPasswordValid = yield bcryptjs_1.default.compare(password, admin.password);
        if (!isPasswordValid) {
            return res
                .status(401)
                .json({ success: false, message: "Invalid password" });
        }
        // Check if the new email already exists
        const existingAdmin = yield admin_model_1.default.findOne({ email: newEmail });
        if (existingAdmin) {
            return res
                .status(400)
                .json({ success: false, message: "Email is already in use" });
        }
        // Update admin email
        admin.email = newEmail;
        yield admin.save();
        // Send success response
        res.status(200).json({
            success: true,
            message: "Email updated successfully",
            data: { email: newEmail },
        });
    }
    catch (error) {
        console.error("Error updating email:", error);
        res.status(500).json({ success: false, message: "Failed to update email" });
    }
});
exports.updateAdminEmail = updateAdminEmail;
