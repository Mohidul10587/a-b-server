"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("./category.controller");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const admin_middleware_1 = __importDefault(require("../admin/admin.middleware"));
const router = (0, express_1.Router)();
// Multer configuration for file uploads (image validation)
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    fileFilter: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
            return cb(new Error("Only images are allowed"));
        }
        cb(null, true);
    },
});
// Middleware for handling both single and multiple file uploads
const uploadMiddleware = upload.fields([
    { name: "photo", maxCount: 1 }, // For category image (single file)
    { name: "fieldIcons", maxCount: 50 }, // For field icons (multiple files)
    { name: "sectionIcons", maxCount: 10 }, // For section icons (multiple files)
]);
/** Category Routes **/
// Route to create a new category (with file uploads)
router.post("/create", admin_middleware_1.default, uploadMiddleware, category_controller_1.createCategory);
// Route to get all categories
router.get("/all", category_controller_1.getAllCategories);
// Route to get a single category by ID
router.get("/:id", category_controller_1.getCategoryById);
router.get("/subCategory/:subCategoryId", category_controller_1.findSubcategoryById);
// Route to get all category IDs (used for dropdowns, selects, etc.)
router.get("/allCategoryIds", category_controller_1.getAllCategoryIds);
// Route to update an existing category (with file uploads)
router.put("/update/:id", admin_middleware_1.default, uploadMiddleware, category_controller_1.updateCategory);
// Route to delete a category by ID
router.delete("/:id", admin_middleware_1.default, category_controller_1.deleteCategory);
/** Subcategory Routes **/
// Route to get a specific subcategory of a specific category by IDs
router.get("/getSubcategory/:categoryId/:subcategoryId", admin_middleware_1.default, category_controller_1.getSubcategoryById);
// Route to add a subcategory to a specific category
router.post("/addSubCategory/:id", // `:id` refers to the category ID
admin_middleware_1.default, uploadMiddleware, category_controller_1.addSubcategory);
// Route to update a specific subcategory of a category
router.put("/updateSubcategory/:categoryId/:subcategoryId", admin_middleware_1.default, uploadMiddleware, category_controller_1.updateSubcategory);
router.delete("/subCategory/:categoryId/:subcategoryId", category_controller_1.deleteSubcategory);
exports.default = router;
