"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomePageElements = void 0;
const mongoose_1 = require("mongoose");
const homePageElementsSchema = new mongoose_1.Schema({
    sectionTitle: { type: String, required: true },
    link: { type: String },
    status: { type: String, required: true },
    subtitle: { type: String, default: "" },
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
    showTitle: { type: Boolean, default: false },
    position: { type: Number, required: true },
    selectionType: { type: String, required: true },
    bannerId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Banner", default: null }, // Reference to banner
    productSectionId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Product",
        default: null,
    },
    images: { type: [String], default: [] }, // Array of image URLs
});
exports.HomePageElements = (0, mongoose_1.model)("HomePageElements", homePageElementsSchema);
