"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const writer_controller_1 = require("./writer.controller");
const path_1 = __importDefault(require("path"));
const admin_middleware_1 = __importDefault(require("../admin/admin.middleware"));
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
]);
router.post("/create", uploadMiddleware, writer_controller_1.createBrand);
// Route to get all writer IDs
// router.get("/allBrandIds", getAllBrandIds);
router.get("/all", writer_controller_1.getAllBrands);
router.get("/singleWriterBySlug/:slug", writer_controller_1.getWriterBySlug);
router.get("/singleWriter/:id", writer_controller_1.getWriteById);
// router.get("/all2", getAllBrands2);
router.put("/updateWriter/:id", admin_middleware_1.default, uploadMiddleware, writer_controller_1.updateBrand);
// router.delete("/deleteBrand/:id", verifyToken, deleteBrand);
exports.default = router;
