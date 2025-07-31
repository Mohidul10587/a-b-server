"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const withdraw_controller_1 = require("./withdraw.controller");
const middlewares_1 = require("../user/middlewares");
const router = express_1.default.Router();
// Routes
router.post("/request", middlewares_1.verifySellerToken, withdraw_controller_1.createWithdrawRequest); // Create a transaction
router.get("/getWithdrawRequestsForAdmin", 
//   verifyToken,
withdraw_controller_1.getWithdrawRequestsForAdmin); // Create a transaction
// Route to update withdrawal status
router.put("/updateStatus/:withdrawId", withdraw_controller_1.updateStatus);
exports.default = router;
