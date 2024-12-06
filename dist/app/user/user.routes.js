"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/userRoutes.ts
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const user_middleware_1 = __importDefault(require("./user.middleware"));
const router = express_1.default.Router();
router.post("/register", user_controller_1.registerUser);
router.post("/login", user_controller_1.loginUser);
router.put("/forgot-password", user_controller_1.forgotPassword);
router.get("/check-user", user_middleware_1.default, user_controller_1.checkUser); // Adding the checkUser route with verifyToken middleware
exports.default = router;
