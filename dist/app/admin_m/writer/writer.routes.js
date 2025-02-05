"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const writer_controller_1 = require("./writer.controller");
const admin_middleware_1 = __importDefault(require("../admin/admin.middleware"));
const router = (0, express_1.Router)();
router.post("/create", admin_middleware_1.default, writer_controller_1.create);
// Route to get all writer IDs
router.get("/singleWriterForWriterEditPage/:id", writer_controller_1.singleWriterForWriterEditPage);
router.put("/update/:id", admin_middleware_1.default, writer_controller_1.update);
router.get("/all", writer_controller_1.getAllBrands);
router.get("/singleWriterBySlug/:slug", writer_controller_1.getWriterBySlug);
router.get("/singleWriter/:id", writer_controller_1.getWriteById);
exports.default = router;
