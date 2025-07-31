"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Schema definition
const TransactionSchema = new mongoose_1.Schema({
    sellerId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Seller", default: null },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", default: null },
    orderId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Order", default: null },
    previousAmount: { type: Number, required: true },
    recentAmount: { type: Number, required: true },
    currentTotal: { type: Number, required: true },
    reasonOfTransaction: {
        type: String,
        enum: [
            "Order delivered",
            "Cancel after delivered",
            "Cancel by admin after delivered",
            "Order delivered by admin",
            "Withdraw",
        ],
        required: true,
    },
}, { timestamps: true });
// Model definition
const Transaction = (0, mongoose_1.model)("Transaction", TransactionSchema);
exports.default = Transaction;
