"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const middlewares_1 = require("../user/middlewares");
const router = (0, express_1.Router)();
//====================== For User ======================
// router.get("/allForUserIndexPage", allForUserIndexPage);
// router.get("/allSlugsForUserIndexPage", allSlugsForUserIndexPage);
// router.get("/singleForUserForDetailsPageBySlug/:slug", singleForUserForDetailsPageBySlug);
//====================== For Admin =====================
router.post("/create", middlewares_1.verifyUserToken, controller_1.create);
router.get("/allForAdminIndexPage", middlewares_1.verifyAdminToken, controller_1.allForAdminIndexPage);
router.get("/singleForAdmin/:id", middlewares_1.verifyAdminToken, controller_1.singleForAdmin);
router.put("/updateSellerApplicationStatus/:id", middlewares_1.verifyAdminToken, controller_1.updateSellerApplicationStatus);
// router.put("/update/:id", verifyAdminToken, update);
// router.delete("/delete/:id", verifyAdminToken, deleteById(SellerApplication));
exports.default = router;
