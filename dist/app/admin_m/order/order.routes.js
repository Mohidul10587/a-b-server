"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/orderRoutes.ts
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("./order.controller");
const router = express_1.default.Router();
// Create a new order
router.post("/create", order_controller_1.createOrder);
// Get all orders
router.get("/all", order_controller_1.getOrders);
router.get("/getSingleOrder/:id", order_controller_1.getSingleOrders);
// Update order status
router.patch("/updateOrderStatus/:id", order_controller_1.updateOrderStatus);
exports.default = router;
