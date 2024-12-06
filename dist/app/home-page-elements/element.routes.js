"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const element_controller_1 = require("./element.controller"); // Your controller function
const banner_routes_1 = require("../banner/banner.routes");
const router = (0, express_1.Router)();
const uploadFields = banner_routes_1.upload_c.fields([{ name: "images", maxCount: 10 }]);
// Route to handle form submission and image upload
router.post("/create-page-element", uploadFields, // 'images' is the field name for the file inputs, allowing up to 10 files
element_controller_1.createPageElement);
// Get PageElement by ID
router.get("/:id", element_controller_1.getPageElementById);
// Delete a single PageElement by ID
router.delete("/:id", element_controller_1.deletePageElementById);
// Delete all PageElements
router.delete("/", element_controller_1.deleteAllPageElements);
exports.default = router;
