"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/adminRoutes.ts
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("./admin.controller");
const admin_middleware_1 = __importDefault(require("./admin.middleware"));
const logOut_1 = require("../shared/logOut");
const router = express_1.default.Router();
router.post("/register", admin_controller_1.registerAdmin);
router.post("/login", admin_controller_1.loginAdmin);
router.post("/logout", logOut_1.logOut);
router.put("/update-password", admin_middleware_1.default, admin_controller_1.updatePassword);
router.get("/check-admin", admin_middleware_1.default, admin_controller_1.checkAdmin); // Adding the checkAdmin route with verifyToken middleware
router.get("/getOrdersCount", admin_controller_1.getCountsOfDocuments);
exports.default = router;
