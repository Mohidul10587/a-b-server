"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const banner_controller_1 = require("./banner.controller");
const middlewares_1 = require("../user/middlewares");
const router = express_1.default.Router();
router.post("/create", middlewares_1.verifyAdminToken, banner_controller_1.create);
router.get("/singleForEditPage/:id", middlewares_1.verifyAdminToken, banner_controller_1.singleForEditPage);
router.put("/update/:id", middlewares_1.verifyAdminToken, banner_controller_1.update);
router.get("/allForAdminIndexPage", banner_controller_1.allForAdminIndexPage);
router.get("/singleBanner/:id", banner_controller_1.getBannerById);
router.delete("/:id", banner_controller_1.deleteBannerById);
router.get("/all", banner_controller_1.getAllBanners);
exports.default = router;
