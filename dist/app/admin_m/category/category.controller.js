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
exports.getCategoryById = exports.updateCategory = exports.deleteCategory = exports.getAllCategoriesForCatMainPage = exports.getCategoryBySlug = exports.getAllCategories = exports.createCategory = void 0;
const category_model_1 = __importDefault(require("./category.model"));
const product_model_1 = __importDefault(require("../../product/product.model"));
const uploadSingleFileToCloudinary_1 = require("../../shared/uploadSingleFileToCloudinary");
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryName, slug, description, display, displayPositionOfHomePage, subCategories, metaTitle, metaDescription, tags, position, } = req.body;
        // Create and save the new category
        const newCategory = new category_model_1.default({
            categoryName,
            slug,
            description,
            photoUrl: "/default.jpg",
            subCategories,
            metaTitle,
            metaDescription,
            tags: ["sd"],
            metaImage: "/default.jpg",
            position: 0,
        });
        yield newCategory.save();
        res.status(201).json(newCategory);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.createCategory = createCategory;
const getAllCategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all categories
        const previousCategories = yield category_model_1.default.find();
        // Fetch products and count products per category
        const primaryCategories = yield Promise.all(previousCategories.map((category) => __awaiter(void 0, void 0, void 0, function* () {
            const productCount = yield product_model_1.default.countDocuments({
                category: category._id,
            });
            return Object.assign(Object.assign({}, category.toJSON()), { categoryProducts: productCount });
        })));
        const categories = primaryCategories.sort((a, b) => a.position - b.position);
        res.status(200).json({ categories });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getAllCategories = getAllCategories;
const getCategoryBySlug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = req.params.slug;
    try {
        const category = yield category_model_1.default.findOne({ slug });
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.status(200).json(category);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getCategoryBySlug = getCategoryBySlug;
const getAllCategoriesForCatMainPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch all categories
        const previousCategories = yield category_model_1.default.find().select("categoryName slug photoUrl position");
        // Fetch products and count products per category
        const primaryCategories = yield Promise.all(previousCategories.map((category) => __awaiter(void 0, void 0, void 0, function* () {
            const productCount = yield product_model_1.default.countDocuments({
                category: category._id,
            });
            return Object.assign(Object.assign({}, category.toJSON()), { categoryProducts: productCount });
        })));
        const categories = primaryCategories.sort((a, b) => a.position - b.position);
        res.status(200).json({ categories });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getAllCategoriesForCatMainPage = getAllCategoriesForCatMainPage;
// Add this function  to your existing controller file
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryId = req.params.id;
        const category = yield category_model_1.default.findByIdAndDelete(categoryId);
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.status(200).json({ message: "Category deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.deleteCategory = deleteCategory;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { categoryName, slug, description, infoSections, metaTitle, metaDescription, tags, position, } = req.body;
        const categoryId = req.params.id;
        const category = yield category_model_1.default.findById(categoryId);
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }
        const files = req.files;
        const photoFile = (_a = files === null || files === void 0 ? void 0 : files.photo) === null || _a === void 0 ? void 0 : _a[0];
        const newMetaImageFile = (_b = files === null || files === void 0 ? void 0 : files.metaImage) === null || _b === void 0 ? void 0 : _b[0];
        // Upload metaImage if provided
        const photoUrl = yield (0, uploadSingleFileToCloudinary_1.cloudinaryUpload)(photoFile);
        const newMetaImage = yield (0, uploadSingleFileToCloudinary_1.cloudinaryUpload)(newMetaImageFile);
        const tagsArray = tags.split(",").map((tag) => tag.trim());
        // Update the category with new values
        category.categoryName = categoryName;
        category.slug = slug;
        category.description = description;
        category.subCategories;
        category.metaTitle = metaTitle;
        category.metaDescription = metaDescription;
        category.tags = tagsArray;
        // category.position = parseInt(position);
        category.position = 0;
        if (photoUrl) {
            category.photoUrl = photoUrl;
        }
        if (newMetaImage) {
            category.metaImage = newMetaImage;
        }
        // Fetch all products by category ID
        const products = yield product_model_1.default.find({ category: category._id });
        // Merge info sections and update products individually
        const updatedCategory = yield category.save(); // Ensure the updated category is saved
        res.status(200).json(updatedCategory); // Return the updated category
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.updateCategory = updateCategory;
const getCategoryById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const category = yield category_model_1.default.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ error: "Category not found" });
        }
        res.status(200).json(category);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getCategoryById = getCategoryById;
