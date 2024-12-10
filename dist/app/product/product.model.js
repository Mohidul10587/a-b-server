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
// Schema
const ProductSchema = new mongoose_1.Schema({
    title: { type: String },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    shortDescription: { type: String },
    category: { type: mongoose_1.Schema.Types.ObjectId, ref: "Category", default: null },
    subCategory: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Subcategory",
        default: null,
    },
    price: { type: Number },
    unprice: { type: Number },
    stockStatus: { type: String },
    writer: { type: mongoose_1.Schema.Types.ObjectId, ref: "Writer", default: null },
    youtubeVideo: { type: String, default: "" },
    shippingInside: { type: Number },
    shippingOutside: { type: Number },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    publisher: { type: mongoose_1.Schema.Types.ObjectId, ref: "Publisher", default: null },
    summary: { type: String, default: "" },
    numberOfPage: { type: Number },
    ISBN: { type: String },
    edition: { type: String },
    productType: { type: String },
    translatorName: { type: String, default: "" },
    binding: { type: String },
    language: { type: String },
    orderType: { type: String },
    titleEnglish: { type: String, default: "" },
    subTitle: { type: String, default: "" },
    tags: { type: [String], default: [] },
    photo: { type: String },
    metaImage: { type: String, default: "" },
    attachedFiles: { type: [String], default: [] },
    suggestion: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Suggestion",
        default: null,
    },
}, { timestamps: true });
// Model
// Middleware to make the slug unique if it's already taken
ProductSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const doc = this;
        if (!doc.isModified("slug"))
            return next();
        let slug = doc.slug;
        let counter = 1;
        // Check if a product with the same slug already exists
        while (yield mongoose_1.default.models.Product.exists({ slug })) {
            slug = `${doc.slug}-${counter++}`;
        }
        doc.slug = slug;
        next();
    });
});
const Product = mongoose_1.default.model("Product", ProductSchema);
exports.default = Product;
