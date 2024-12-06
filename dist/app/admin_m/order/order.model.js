"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const checkoutSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    location: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    products: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Product" }], // Updated field
    shippingCost: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    selectedShipping: { type: String, required: true },
    selectedDeliveryOption: { type: String, required: true },
    variantTitle: { type: String },
    variantSectionTitle: { type: String },
    status: { type: String, required: true },
}, { timestamps: true } // Enable timestamps
);
const Order = (0, mongoose_1.model)("Order", checkoutSchema);
exports.default = Order;
