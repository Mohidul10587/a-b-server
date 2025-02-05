"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("./category.controller");
const admin_middleware_1 = __importDefault(require("../admin/admin.middleware"));
const router = (0, express_1.Router)();
//Admin routes
router.post("/create", admin_middleware_1.default, category_controller_1.create);
router.get("/allCategoriesForSubCatAddPage", category_controller_1.allCategoriesForSubCatAddPage);
router.get("/allCategoriesForNavBar", category_controller_1.allCategoriesForNavBar);
router.get("/allCategoriesForAdminCatIndexPage", category_controller_1.allCategoriesForAdminCatIndexPage);
router.get("/allCategoryForProductAddPage", category_controller_1.allCategoryForProductAddPage);
router.get("/singleCategoryForCategoryEditPage/:id", category_controller_1.singleCategoryForCategoryEditPage);
router.put("/update/:id", admin_middleware_1.default, category_controller_1.update);
// common routes
router.get("/allCategoryForFiltering", category_controller_1.allCategoryForFiltering);
router.get("/getAllCategoriesForCatMainPage", category_controller_1.getAllCategoriesForCatMainPage);
exports.default = router;
