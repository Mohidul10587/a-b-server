"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload_c = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const banner_controller_1 = require("./banner.controller");
const admin_middleware_1 = __importDefault(require("../admin/admin.middleware"));
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
exports.upload_c = (0, multer_1.default)({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname);
        if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".webp" && ext !== ".png") {
            return cb(new Error("Only images are allowed"));
        }
        cb(null, true);
    },
});
const uploadFields = exports.upload_c.fields([{ name: "bannerImages", maxCount: 20 }]);
router.post("/create", admin_middleware_1.default, uploadFields, banner_controller_1.createBanner);
router.get("/all", banner_controller_1.getAllBanners);
router.get("/singleBanner/:id", banner_controller_1.getBannerById);
router.delete("/:id", banner_controller_1.deleteBannerById);
router.put("/update/:id", uploadFields, banner_controller_1.updateBannerById);
exports.default = router;
