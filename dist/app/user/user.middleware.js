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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("./user.model"));
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        return res
            .status(401)
            .json({ success: false, message: "Token not provided" });
    }
    jsonwebtoken_1.default.verify(token, "JWT_SECRET", (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            return res
                .status(401)
                .json({ success: false, message: "Failed to authenticate token" });
        }
        try {
            const user = yield user_model_1.default.findById(decoded.userId);
            if (!user) {
                return res
                    .status(404)
                    .json({ success: false, message: "User not found" });
            }
            // Attach user object to request for further usage
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
exports.default = verifyToken;
