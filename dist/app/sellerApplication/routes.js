"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const middlewares_1 = require("../user/middlewares");
const reusableControllers_1 = require("../shared/reusableControllers");
const model_1 = require("./model");
const router = (0, express_1.Router)();
//====================== For User ======================
// router.get("/allForUserIndexPage", allForUserIndexPage);
// router.get("/allSlugsForUserIndexPage", allSlugsForUserIndexPage);
// router.get("/singleForUserForDetailsPageBySlug/:slug", singleForUserForDetailsPageBySlug);
//====================== For Admin =====================
router.post("/create", middlewares_1.verUserTkn, controller_1.create);
router.get("/allForAdminIndexPage", middlewares_1.verAdminTkn, controller_1.allForAdminIndexPage);
router.get("/singleForAdmin/:id", middlewares_1.verAdminTkn, controller_1.singleForAdmin);
router.patch("/rejectByAdmin/:id", middlewares_1.verAdminTkn, controller_1.rejectByAdmin);
router.put("/update/:id", middlewares_1.verAdminTkn, controller_1.update);
router.delete("/delete/:id", middlewares_1.verAdminTkn, (0, reusableControllers_1.deleteById)(model_1.SellerApplication));
exports.default = router;
