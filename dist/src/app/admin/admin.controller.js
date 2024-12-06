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
exports.forgotPassword = exports.loginAdmin = exports.checkAdmin = exports.registerAdmin = void 0;
const admin_model_1 = __importDefault(require("./admin.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
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
        const token = jsonwebtoken_1.default.sign({ adminId: admin._id, email: admin.email }, "JWT_SECRET", { expiresIn: "1h" });
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
        const token = jsonwebtoken_1.default.sign({ adminId: admin._id, email: admin.email }, "JWT_SECRET", { expiresIn: "1h" });
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
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.forgotPassword = forgotPassword;
