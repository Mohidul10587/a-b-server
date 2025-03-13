"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const brand_controller_1 = require("./brand.controller");
const path_1 = __importDefault(require("path"));
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({
  storage: multer_1.default.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path_1.default.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      
      return;
    }
    cb(null, true);
  },
});
router.post("/create", upload.single("photo"), brand_controller_1.createWriter);
router.get("/all", brand_controller_1.getAllWriters);
router.get("/singleWriter/:id", brand_controller_1.getWriterById);
router.put(
  "/updateWriter/:id",
  upload.single("photo"),
  brand_controller_1.updateWriter
);
router.delete("/deleteWriter/:id", brand_controller_1.deleteWriter);
exports.default = router;
