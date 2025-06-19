"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/orderRoutes.ts
const express_1 = __importDefault(require("express"));
const order_controller_1 = require("./order.controller");
const middlewares_1 = require("../user/middlewares");
const reusableControllers_1 = require("../shared/reusableControllers");
const order_model_1 = __importDefault(require("./order.model"));
const router = express_1.default.Router();
// Create a new order
router.post("/create", middlewares_1.verifyUserToken, order_controller_1.create);
// Get all orders
router.get("/allForAdmin", order_controller_1.allForAdmin);
router.get("/getSingleOrder/:id", order_controller_1.getSingleOrders);
// Update order status
router.patch("/updateOrderStatus/:id", order_controller_1.updateOrderStatus);
router.delete("/delete/:id", (0, reusableControllers_1.deleteById)(order_model_1.default));
exports.default = router;
