"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const product_controller_1 = require("./product.controller");
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
            return cb(new Error("Only images are allowed"));
        }
        cb(null, true);
    },
});
const uploadFields = upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "attachedFiles", maxCount: 10 },
]);
router.post("/create", uploadFields, product_controller_1.createProduct);
exports.default = router;
