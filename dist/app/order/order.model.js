"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// models/Order.ts
const mongoose_1 = __importStar(require("mongoose"));
const cart_model_1 = require("../cart/cart.model");
const OrderSchema = new mongoose_1.Schema({
    cart: [cart_model_1.CartItemSchema],
    user: { type: mongoose_1.default.Types.ObjectId, ref: "User", default: null },
    deliveryInfo: {
        name: { type: String, required: true },
        email: { type: String },
        address: { type: String },
        phone: { type: String, required: true },
        receiverName: { type: String },
        receiverPhone: { type: String },
        deliveryType: { type: String },
        district: { type: String },
        thana: { type: String },
        village: { type: String },
        postOffice: { type: String },
        postalCode: { type: String },
        courierAddress: { type: String },
    },
    paidAmount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    paymentStatus: { type: Boolean, default: false },
    paymentTnxId: { type: String, required: true },
    status: { type: String, default: "Pending" },
}, { timestamps: true });
const Order = mongoose_1.default.model("Order", OrderSchema);
exports.default = Order;
