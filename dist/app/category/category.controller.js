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
exports.getCatsWritersPublishersForNavbar = exports.getAllCatWithSubCat = exports.singleCategoryForCategoryEditPage = exports.getAllCategoriesForCatMainPage = exports.allCategoryForFiltering = exports.allCategoriesForAdminCatIndexPage = exports.allCategoryForProductAddPage = exports.allCategoriesForSubCatAddPage = exports.update = exports.singleForEditPage = exports.create = void 0;
const category_model_1 = __importDefault(require("./category.model"));
const generateSLug_1 = require("../shared/generateSLug");
const writer_model_1 = __importDefault(require("../writer/writer.model"));
const publishers_model_1 = __importDefault(require("../publishers/publishers.model"));
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield category_model_1.default.create(Object.assign(Object.assign({}, req.body), { slug: (0, generateSLug_1.generateSlug)(req.body.title) }));
        // Send success message along with the created category data
        res.status(201).json({
            message: "Created successfully!",
            item,
        });
    }
    catch (error) {
        // Send error message if there was an issue
        res.status(500).json({
            message: "Failed to create.",
            error: error.message,
        });
    }
});
exports.create = create;
const singleForEditPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield category_model_1.default.findOne({ _id: req.params.id });
        res.status(200).json({ message: "Category fetched successfully!", item });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "Failed to fetch Category.", error: error.message });
    }
});
exports.singleForEditPage = singleForEditPage;
// Update
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedItem = yield category_model_1.default.findByIdAndUpdate(id, req.body, {
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
        console.error(error);
        res.status(500).json({
            message: "Failed to update.",
            error: error.message,
        });
    }
});
exports.update = update;
// Get all
const allCategoriesForSubCatAddPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield category_model_1.default.find().select("title slug");
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
exports.allCategoriesForSubCatAddPage = allCategoriesForSubCatAddPage;
// Get all
const allCategoryForProductAddPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield category_model_1.default.find().select("title").populate({
            path: "subcategories",
            select: "title",
        });
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
exports.allCategoryForProductAddPage = allCategoryForProductAddPage;
// Get all
const allCategoriesForAdminCatIndexPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield category_model_1.default.find().select("title slug img");
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
exports.allCategoriesForAdminCatIndexPage = allCategoriesForAdminCatIndexPage;
// Get all
const allCategoryForFiltering = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield category_model_1.default.find().select("title");
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
exports.allCategoryForFiltering = allCategoryForFiltering;
// Get all
const getAllCategoriesForCatMainPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield category_model_1.default.find();
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
exports.getAllCategoriesForCatMainPage = getAllCategoriesForCatMainPage;
// Get single
const singleCategoryForCategoryEditPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield category_model_1.default.findOne({ _id: req.params.id });
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
exports.singleCategoryForCategoryEditPage = singleCategoryForCategoryEditPage;
const getAllCatWithSubCat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield category_model_1.default.find()
            .select("title  subcategories")
            .populate({
            path: "subcategories",
            select: "title",
        });
        res.status(200).json(categories);
    }
    catch (error) {
        console.error("Failed to fetch categories:", error);
        res
            .status(500)
            .json({ message: "Server error while fetching categories." });
    }
});
exports.getAllCatWithSubCat = getAllCatWithSubCat;
const getCatsWritersPublishersForNavbar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield category_model_1.default.find()
            .select("img title slug subcategories")
            .populate({ path: "subcategories", select: "img title slug" });
        const writers = yield writer_model_1.default.find().select("title slug");
        const publishers = yield publishers_model_1.default.find().select("title slug");
        res.json({
            categories,
            writers,
            publishers,
        });
    }
    catch (err) {
        console.error("Failed to fetch common data:", err);
        res.status(500).json({ message: "Something went wrong" });
    }
});
exports.getCatsWritersPublishersForNavbar = getCatsWritersPublishersForNavbar;
