"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.update = exports.singleSubcategoryForSubcategoryEditPage = exports.allSubcategoriesForChildCatAddPage = exports.allSubcategoriesForAdminSubCatIndexPage = exports.createSubcategory = void 0;
const subcategory_model_1 = __importDefault(require("./subcategory.model"));
const category_model_1 = __importDefault(require("../category/category.model"));
const convertToArray_1 = require("../../shared/convertToArray");
const generateSLug_1 = require("../../shared/generateSLug");
const createSubcategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { parentCategory, title } = req.body;
        // Split titles into an array
        const titlesArray = (0, convertToArray_1.convertToArray)(title);
        console.log(titlesArray);
        // Initialize an array to store new subcategory IDs
        const createdItems = [];
        // Iterate through titles and create subcategories
        for (const title of titlesArray) {
            const newSubcategory = yield subcategory_model_1.default.create(Object.assign(Object.assign({}, req.body), { title, slug: (0, generateSLug_1.generateSlug)(title) }));
            // Add the created subcategory ID to the array
            createdItems.push(newSubcategory._id);
        }
        // Update the parent category with all new subcategory IDs
        const updatedCategory = yield category_model_1.default.findByIdAndUpdate(parentCategory, { $push: { subcategories: { $each: createdItems } } }, // Push multiple subcategory IDs at once
        { new: true } // Return the updated document
        );
        if (!updatedCategory) {
            console.log("Parent category not found.");
            return res.status(404).json({ message: "Parent category not found." });
        }
        // Send success response
        res.status(201).json({
            message: "Subcategories created successfully!",
            subcategories: createdItems,
            updatedCategory,
        });
    }
    catch (error) {
        console.error(error);
        // Send error response
        res.status(500).json({
            message: "Failed to create subcategories.",
            error: error.message,
        });
    }
});
exports.createSubcategory = createSubcategory;
// Get all
const allSubcategoriesForAdminSubCatIndexPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield subcategory_model_1.default.find().select("title slug img");
        res.status(200).json({
            message: "Fetched successfully!",
            respondedData: items.reverse(),
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch.",
            error: error.message,
        });
    }
});
exports.allSubcategoriesForAdminSubCatIndexPage = allSubcategoriesForAdminSubCatIndexPage;
// Get all
const allSubcategoriesForChildCatAddPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield subcategory_model_1.default.find().select("title slug");
        res.status(200).json({
            message: "Fetched successfully!",
            respondedData: items.reverse(),
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch.",
            error: error.message,
        });
    }
});
exports.allSubcategoriesForChildCatAddPage = allSubcategoriesForChildCatAddPage;
// Get single
const singleSubcategoryForSubcategoryEditPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield subcategory_model_1.default.findOne({ _id: req.params.id });
        res.status(200).json({
            message: "Fetched successfully!",
            respondedData: item,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch.",
            error: error.message,
        });
    }
});
exports.singleSubcategoryForSubcategoryEditPage = singleSubcategoryForSubcategoryEditPage;
// Update
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedItem = yield subcategory_model_1.default.findByIdAndUpdate(id, req.body, {
            new: true, // Return the updated document
            runValidators: true, // Run validation on the updated data
        });
        if (!updatedItem) {
            return res.status(404).json({
                message: "Not found.",
            });
        }
        res.status(200).json({
            message: "Updated successfully!",
            respondedData: updatedItem,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to update.",
            error: error,
        });
    }
});
exports.update = update;
