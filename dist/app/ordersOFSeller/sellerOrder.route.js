"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sellerOrder_controller_1 = require("./sellerOrder.controller");
const middlewares_1 = require("../user/middlewares");
const router = express_1.default.Router();
router.get("/", middlewares_1.verifySellerToken, sellerOrder_controller_1.getAllOrders);
router.get("/allOrdersForAdmin", middlewares_1.verifyAdminToken, sellerOrder_controller_1.getAllOrdersForAdmin);
router.post("/updateStatusByAdmin/:id", sellerOrder_controller_1.updateOrderStatusByAdmin);
router.post("/updateStatusBySeller/:id", sellerOrder_controller_1.updateOrderStatusBySeller);
router.get("/getSingleOrder/:id", sellerOrder_controller_1.getOrderById);
exports.default = router;
