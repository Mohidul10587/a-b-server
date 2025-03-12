"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const settings_controller_1 = require("./settings.controller");
const admin_middleware_1 = __importDefault(require("../admin/admin.middleware"));
const multer_1 = __importDefault(require("../shared/multer"));
const router = (0, express_1.Router)();
router.get("/", settings_controller_1.getSettings);
router.get("/getPrivacyPoliciesOfSettings", settings_controller_1.getPrivacyPoliciesOfSettings);
router.put("/updateSellerDefaultStatus/:id", settings_controller_1.updateDefaultSellerStatus);
router.put("/update", admin_middleware_1.default, multer_1.default.fields([
    { name: "logo", maxCount: 1 },
    { name: "favicon", maxCount: 1 },
    { name: "loto", maxCount: 1 },
    { name: "fbImage", maxCount: 1 },
]), settings_controller_1.updateSettings);
exports.default = router;
