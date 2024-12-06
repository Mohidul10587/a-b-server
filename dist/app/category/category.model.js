"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const FieldSchema = new mongoose_1.Schema({
    fieldIcon: { type: String },
    fieldTitle: { type: String, required: true },
    content: { type: String, required: true },
    display: { type: Boolean, required: true },
});
const InfoSectionSchema = new mongoose_1.Schema({
    sectionIcon: { type: String },
    sectionTitle: { type: String, required: true },
    fields: [FieldSchema],
});
const SubcategorySchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    photo: { type: String, required: true },
    description: { type: String },
});
const CategorySchema = new mongoose_1.Schema({
    categoryName: { type: String, required: true },
    description: { type: String },
    display: { type: Boolean },
    displayPositionOfHomePage: { type: Number },
    infoSections: [InfoSectionSchema],
    photoUrl: { type: String, required: true },
    subCategories: [SubcategorySchema],
});
const Category = (0, mongoose_1.model)("Category", CategorySchema);
exports.default = Category;
