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
exports.registerAdmin = exports.createDefaultSettings = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const settings_model_1 = __importDefault(require("../settings/settings.model"));
const user_model_1 = __importDefault(require("../user/user.model"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
const createDefaultSettings = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingSettings = yield settings_model_1.default.findOne({});
        if (existingSettings) {
            return;
        }
        else {
            const settings = new settings_model_1.default({
                logo: "https://res.cloudinary.com/dpksjt1e3/image/upload/v1720776234/eerg5y8qtmijfdyskx4e.png",
                favicon: "https://res.cloudinary.com/dpksjt1e3/image/upload/v1720776234/eerg5y8qtmijfdyskx4e.png",
                loto: "https://res.cloudinary.com/dpksjt1e3/image/upload/v1720776234/eerg5y8qtmijfdyskx4e.png",
                fbImage: "https://res.cloudinary.com/dpksjt1e3/image/upload/v1720776234/eerg5y8qtmijfdyskx4e.png",
                bgColor: "#ab4725",
                websiteTitle: "Price In Kenya",
                websiteBgColor: "#ffffff", // Default value, adjust if necessary
                copyright: "Copyright © 2012-2023 Price in Kenya. All rights reserved.",
                country: "Kenya",
                currencySymbol: "$",
                priceZero: "Currently Unavailable",
                highlights: "Highlights",
                shippingInside: "Inside Dhaka",
                shippingOutside: "Outside Dhaka",
                deliveryMethod1: "Delivery to your home or office",
                deliveryTime1: "Delivered between Same day delivery",
                deliveryMethod2: "Pickup Station",
                deliveryTime2: "Ready to pickup between Same day delivery",
                payment: "M-PESA Paybill",
                paymentText1: "Business no. 542542",
                paymentText2: "Account no. 794794",
                officeAddress: "Bihi Towers, Ground Floor, Suite G8, Moi Avenue, Nairobi CBD.",
                whatsapp: "",
                telegram: "",
                note: "That though we strive to keep all products up to date, price and availability are subject to change without prior notice.",
                order: "Order",
                orderText: "From Price in Kenya with fast delivery across the country and in-store pickup in Nairobi.",
                metaDescription: "",
                description: "",
                privacyPolicies: "",
                termsAndConditions: "",
                otherPolicies: "",
                sellerDefalutStatus: true,
                phone: "Your phone no",
                tags: ["keyword1", "keyword2"],
            });
            yield settings.save();
        }
    }
    catch (error) {
        console.error(error);
    }
});
exports.createDefaultSettings = createDefaultSettings;
const registerAdmin = (name, email, password, image, slug) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if admin already exists
        const existingAdmin = yield user_model_1.default.findOne({ email });
        if (existingAdmin) {
            return;
        }
        // Hash password
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        // Create new admin
        const admin = new user_model_1.default({
            name,
            slug,
            email,
            password: hashedPassword,
            image,
            role: "admin",
            isUser: true,
            isSeller: true,
        });
        // Save admin to database
        yield admin.save();
        // Generate JWT token
        const token = jsonwebtoken_1.default.sign({ adminId: admin._id, email: admin.email }, JWT_SECRET, { expiresIn: "1h" });
    }
    catch (error) {
        console.error("Admin registration failed", error);
    }
});
exports.registerAdmin = registerAdmin;
