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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const isObjectId_1 = require("../shared/isObjectId");
// Schema
const ProductSchema = new mongoose_1.Schema({
    // A
    attachedImgs: { type: [String], default: [] },
    // B
    binding: { type: String },
    // C
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        set: (value) => ((0, isObjectId_1.isObjectId)(value) ? value : null),
        ref: "Category",
        default: null,
    },
    // D
    description: { type: String },
    display: { type: Boolean, default: true },
    // E
    edition: { type: String },
    existingQnt: { type: Number, default: 100 },
    // I
    img: { type: String },
    ISBN: { type: String },
    // K
    keywords: { type: [String], default: [] },
    // L
    language: { type: String },
    // M
    metaDescription: { type: String, default: "" },
    metaImg: { type: String, default: "" },
    metaTitle: { type: String, default: "" },
    // N
    numberOfPage: { type: Number },
    // O
    orderType: {
        type: String,
        enum: ["Buy_Now", "Pre_Order"],
        default: "Buy_Now",
    },
    // P
    productType: { type: String },
    seller: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
    },
    // R
    rating: { type: Number, default: 3.5 },
    regularPrice: { type: Number },
    // S
    sellingPrice: { type: Number },
    originalPrice: { type: Number },
    shortDescription: { type: String },
    slug: { type: String, required: true, unique: true },
    stockStatus: { type: String },
    subcategory: {
        type: mongoose_1.Schema.Types.ObjectId,
        set: (value) => ((0, isObjectId_1.isObjectId)(value) ? value : null),
        ref: "Subcategory",
        default: null,
    },
    subTitle: { type: String, default: "" },
    suggestion: {
        type: mongoose_1.Schema.Types.ObjectId,
        set: (value) => ((0, isObjectId_1.isObjectId)(value) ? value : null),
        ref: "Suggestion",
        default: null,
    },
    // T
    titleBn: { type: String, default: "" },
    title: { type: String, required: true },
    translator: { type: String, default: "" },
    // W
    writer: {
        type: mongoose_1.Schema.Types.ObjectId,
        set: (value) => ((0, isObjectId_1.isObjectId)(value) ? value : null),
        ref: "Writer",
        default: null,
    },
    // Y
    youtubeVideo: { type: [String], default: [] },
}, { timestamps: true });
// Slug uniqueness middleware
ProductSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const doc = this;
        if (!doc.isModified("slug"))
            return next();
        let slug = doc.slug;
        let counter = 1;
        while (yield mongoose_1.default.models.Product.exists({ slug })) {
            slug = `${doc.slug}-${counter++}`;
        }
        doc.slug = slug;
        next();
    });
});
const Product = mongoose_1.default.model("Product", ProductSchema);
exports.default = Product;
