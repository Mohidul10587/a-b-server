"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const category_controller_1 = require("./category.controller");
const middlewares_1 = require("../user/middlewares");
const router = (0, express_1.Router)();
//Admin routes
router.post("/create", middlewares_1.verifyAdminToken, category_controller_1.create);
router.get("/singleForEditPage/:id", middlewares_1.verifyAdminToken, category_controller_1.singleForEditPage);
router.get("/allCategoriesForSubCatAddPage", category_controller_1.allCategoriesForSubCatAddPage);
router.get("/getAllCatWithSubCat", category_controller_1.getAllCatWithSubCat);
router.get("/allCategoriesForAdminCatIndexPage", category_controller_1.allCategoriesForAdminCatIndexPage);
router.get("/allCategoryForProductAddPage", category_controller_1.allCategoryForProductAddPage);
router.get("/singleCategoryForCategoryEditPage/:id", category_controller_1.singleCategoryForCategoryEditPage);
router.get("/getCatsWritersPublishersForNavbar", category_controller_1.getCatsWritersPublishersForNavbar);
router.put("/update/:id", middlewares_1.verifyAdminToken, category_controller_1.update);
// common routes
router.get("/allCategoryForFiltering", category_controller_1.allCategoryForFiltering);
router.get("/getAllCategoriesForCatMainPage", category_controller_1.getAllCategoriesForCatMainPage);
router.get("/getAllCategoryForFilterPage", category_controller_1.getAllCategoryForFilterPage);
exports.default = router;
