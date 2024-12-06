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
// import multer from "multer";
// import path from "path";
// import verifyToken from "../admin/admin.middleware";
const router = (0, express_1.Router)();
// Multer configuration for file uploads (image validation)
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    fileFilter: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        if (ext !== ".jpg" &&
            ext !== ".jpeg" &&
            ext !== ".webp" &&
            ext !== ".png") {
            return cb(new Error("Only images are allowed"));
        }
        cb(null, true);
    },
});
// Middleware for handling both single and multiple file uploads
const uploadMiddleware = upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "metaImage", maxCount: 1 },
    { name: "fieldIcons", maxCount: 50 },
    { name: "sectionIcons", maxCount: 10 },
]);
/** Category Routes **/
// Route to create a new category (with file uploads)
router.post("/create", uploadMiddleware, category_controller_1.createCategory);
// Route to get all categories
router.get("/all", category_controller_1.getAllCategories);
// // Route to get a single category by ID
// router.get("/allCategoryIds", getAllCategoryIds);
// router.get("/category_by_slug/:slug", getCategoryBySlug);
router.get("/:id", category_controller_1.getCategoryById);
// router.get("/subCategoryBySlug/:slug", findSubcategoryBySlug);
// router.get("/subCategory/:subCategoryId", findSubcategoryById);
// // Route to get all category IDs (used for dropdowns, selects, etc.)
// // Route to update an existing category (with file uploads)
router.put("/update/:id", admin_middleware_1.default, uploadMiddleware, category_controller_1.updateCategory);
// // Route to delete a category by ID
router.delete("/:id", admin_middleware_1.default, category_controller_1.deleteCategory);
// /** Subcategory Routes **/
// // Route to get a specific subcategory of a specific category by IDs
// router.get(
//   "/getSubcategory/:categoryId/:subcategoryId",
//   verifyToken,
//   getSubcategoryById
// );
// // Route to add a subcategory to a specific category
// router.post(
//   "/addSubCategory/:id", // `:id` refers to the category ID
//   verifyToken,
//   uploadMiddleware,
//   addSubcategory
// );
// // Route to update a specific subcategory of a category
// router.put(
//   "/updateSubcategory/:categoryId/:subcategoryId",
//   verifyToken,
//   uploadMiddleware,
//   updateSubcategory
// );
// router.delete("/subCategory/:categoryId/:subcategoryId", deleteSubcategory);
exports.default = router;
