"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subcategory_controller_1 = require("./subcategory.controller");
const router = (0, express_1.Router)();
// Route to create a new category
router.post("/create", subcategory_controller_1.createSubcategory);
router.get("/allSubcategoriesForChildCatAddPage", subcategory_controller_1.allSubcategoriesForChildCatAddPage);
router.get("/allSubcategoriesForAdminSubCatIndexPage", subcategory_controller_1.allSubcategoriesForAdminSubCatIndexPage);
router.get("/singleSubcategoryForSubcategoryEditPage/:id", subcategory_controller_1.singleSubcategoryForSubcategoryEditPage);
router.put("/update/:id", subcategory_controller_1.update);
exports.default = router;
