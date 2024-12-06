"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageElements = void 0;
const mongoose_1 = require("mongoose");
const pageElementsSchema = new mongoose_1.Schema({
    targetedPageId: { type: String, required: true },
    sectionTitle: { type: String, required: true },
    link: { type: String },
    status: { type: Boolean, required: true },
    titleLink: { type: String, default: "" },
    titleAlignment: {
        type: String,
        enum: ["left", "center", "right"],
        default: "left",
    },
    isTitle: { type: Boolean, default: true },
    desktopGrid: { type: Number, default: 4 },
    mobileGrid: { type: Number, default: 1 },
    margin: { type: Number, default: 0 },
    padding: { type: Number, default: 0 },
    titleBackgroundColor: { type: String, default: "#ffffff" },
    sectionBackgroundColor: { type: String, default: "#ffffff" },
    gridStyle: { type: String, default: "1" },
    productStyle: { type: String, default: "1" },
    postLimit: { type: Number, default: 10 },
    display: {
        type: String,
        enum: ["both", "desktop", "mobile"],
        default: "both",
    },
    imagePosition: {
        type: String,
        enum: ["left", "right", "top", "bottom"],
        default: "left",
    },
    page: { type: String, required: true },
    position: { type: Number, required: true },
    selectionType: { type: String, required: true },
    bannerId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Banner", default: null }, // Reference to banner
    productSectionId: {
        type: String,
        required: false,
    },
    images: { type: [String], default: [] }, // Array of image URLs
    width: { type: Number, required: true },
    height: { type: Number, required: true },
});
exports.PageElements = (0, mongoose_1.model)("Elements", pageElementsSchema);
