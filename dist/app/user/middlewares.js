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
exports.verifySellerAndAdminToken = exports.verifyCustomerManagerAndAdminToken = exports.verifyCustomerManagerToken = exports.verifySellerToken = exports.verifyAdminToken = exports.verifyUserToken = exports.verifyStuffToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_model_1 = __importDefault(require("./user.model"));
// Load environment variables
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET;
// 🔄 Reusable Token Verifier by Allowed Roles
const verifyAdminTokenByRoles = (allowedRoles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { refreshToken } = req.cookies;
        if (!refreshToken) {
            return res
                .status(401)
                .json({ success: false, message: "No token provided" });
        }
        jsonwebtoken_1.default.verify(refreshToken, JWT_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
            if (err || !(decoded === null || decoded === void 0 ? void 0 : decoded.userId)) {
                return res
                    .status(401)
                    .json({ success: false, message: "Invalid or expired token" });
            }
            try {
                const user = yield user_model_1.default.findById(decoded.userId);
                if (!user ||
                    user.isUser === false ||
                    !allowedRoles.includes(user.role)) {
                    return res
                        .status(403)
                        .json({ success: false, message: "Access denied" });
                }
                req.user = user;
                next();
            }
            catch (error) {
                console.error(error);
                res
                    .status(500)
                    .json({ success: false, message: "Internal server error" });
            }
        }));
    });
};
// ✅ Middleware for all valid stuff (admin, customerManager, seller)
exports.verifyStuffToken = verifyAdminTokenByRoles([
    "admin",
    "seller",
    "customerManager",
]);
// ✅ Middleware for individual roles
exports.verifyUserToken = verifyAdminTokenByRoles([
    "admin",
    "seller",
    "customerManager",
    "user",
]);
exports.verifyAdminToken = verifyAdminTokenByRoles(["admin"]);
exports.verifySellerToken = verifyAdminTokenByRoles(["seller"]);
exports.verifyCustomerManagerToken = verifyAdminTokenByRoles([
    "customerManager",
]);
exports.verifyCustomerManagerAndAdminToken = verifyAdminTokenByRoles([
    "admin",
    "customerManager",
]);
exports.verifySellerAndAdminToken = verifyAdminTokenByRoles([
    "admin",
    "seller",
]);
