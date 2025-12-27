"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transaction_controller_1 = require("./transaction.controller");
const middlewares_1 = require("../user/middlewares");
const router = express_1.default.Router();
// Route to create a new transaction
router.post("/", middlewares_1.verUserTkn, transaction_controller_1.createTransaction);
// Route to get all transactions for the authenticated seller
router.get("/getAllSellerTransaction", middlewares_1.verifySellerToken, transaction_controller_1.getSellerTransactions);
// Route to delete a transaction
router.delete("/:id", middlewares_1.verUserTkn, transaction_controller_1.deleteTransaction);
exports.default = router;
