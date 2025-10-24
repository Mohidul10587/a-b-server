"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subcategory_controller_1 = require("./subcategory.controller");
const middlewares_1 = require("../user/middlewares");
const subcategory_model_1 = __importDefault(require("./subcategory.model"));
const reusableControllers_1 = require("../shared/reusableControllers");
const router = (0, express_1.Router)();
// Route to create a new category
router.post("/create", subcategory_controller_1.create);
router.get("/singleForEditPage/:id", middlewares_1.verifyAdminToken, subcategory_controller_1.singleForEditPage);
router.get("/allSubcategoriesForAdminSubCatIndexPage", subcategory_controller_1.allSubcategoriesForAdminSubCatIndexPage);
router.put("/update/:id", subcategory_controller_1.update);
router.delete("/delete/:id", middlewares_1.verifyAdminToken, (0, reusableControllers_1.deleteById)(subcategory_model_1.default));
exports.default = router;
