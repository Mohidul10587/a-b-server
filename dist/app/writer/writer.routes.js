"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const writer_controller_1 = require("./writer.controller");
const middlewares_1 = require("../user/middlewares");
const router = (0, express_1.Router)();
router.post("/create", middlewares_1.verifyAdminToken, writer_controller_1.create);
// Route to get all writer IDs
router.get("/singleWriterForWriterEditPage/:id", writer_controller_1.singleWriterForWriterEditPage);
router.put("/update/:id", middlewares_1.verifyAdminToken, writer_controller_1.update);
router.get("/all", writer_controller_1.getAllBrands);
router.get("/singleWriterBySlug/:slug", writer_controller_1.getWriterBySlug);
router.get("/singleWriter/:id", writer_controller_1.getWriteById);
router.get("/getAllForPageBuilder", writer_controller_1.getAllForPageBuilder);
exports.default = router;
