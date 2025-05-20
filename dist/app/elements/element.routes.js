"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const element_controller_1 = require("./element.controller"); // Your controller function
const banner_routes_1 = require("../banner/banner.routes");
const middlewares_1 = require("../user/middlewares");
const router = (0, express_1.Router)();
const uploadFields = banner_routes_1.upload_c.fields([{ name: "images", maxCount: 20 }]);
// Route to handle form submission and image upload
router.post("/create-page-element", middlewares_1.verifyAdminToken, uploadFields, // 'images' is the field name for the file inputs, allowing up to 10 files
element_controller_1.createPageElement);
router.get("/elementByIdAndPage/:id/:pageName", element_controller_1.getElementsByIdAndPage);
// Get PageElement by ID
router.get("/singleElement/:id", element_controller_1.getElementById);
router.get("/singleElementForUpdate/:id", element_controller_1.getElementByIdForUpdate);
// Get all PageElements by page property
router.patch("/updateStatus/:id", middlewares_1.verifyAdminToken, element_controller_1.updatePageElementStatus);
// Delete a single PageElement by ID
router.delete("/delete/:id", middlewares_1.verifyAdminToken, element_controller_1.deletePageElementById);
// PUT route for updating page elements
router.put("/updateElement/:elementId", middlewares_1.verifyAdminToken, uploadFields, element_controller_1.updatePageElement);
exports.default = router;
