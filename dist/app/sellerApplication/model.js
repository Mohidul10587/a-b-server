"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellerApplication = void 0;
const mongoose_1 = require("mongoose");
const SellerApplicationSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    companyName: { type: String, required: true },
    companyEmail: { type: String, required: true },
    companyPhone: { type: String, required: true },
    firstContactPersonName: { type: String, required: true },
    firstContactPersonPhone: { type: String, required: true },
    secondContactPersonName: { type: String, default: "" },
    secondContactPersonPhone: { type: String, default: "" },
    facebook: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    coverImg: { type: String, default: "" },
    image: { type: String, default: "" },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
}, { timestamps: true });
exports.SellerApplication = (0, mongoose_1.model)("SellerApplication", SellerApplicationSchema);
