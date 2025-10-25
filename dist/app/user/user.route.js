"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/user.routes.ts
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const middlewares_1 = require("./middlewares");
const reusableControllers_1 = require("../shared/reusableControllers");
const user_model_1 = __importDefault(require("./user.model"));
const middlewares_2 = require("./middlewares");
const router = express_1.default.Router();
//=================== For user ===================
router.get("/singleUser/:userId", user_controller_1.getSingleUser);
router.get("/getUserByIdForAdmin/:userId", user_controller_1.getUserByIdForAdmin);
router.get("/getSingleUserBySlug/:userSlug", user_controller_1.getSingleUserBySlug);
router.get("/getSingleUserById/:id", user_controller_1.getSingleUserById);
router.get("/sellerStatus/:userSlug", user_controller_1.getStatus);
router.get("/singleForEditPage/:id", middlewares_1.verifyUserToken, user_controller_1.singleForEditPage);
router.get("/getSummaryOfActivity", middlewares_1.verifyUserToken, user_controller_1.getSummaryOfActivity);
router.put("/update/:id", middlewares_1.verifyUserToken, user_controller_1.update);
//================For user authentication ===================
router.get("/getAuthenticatedUser", user_controller_1.getAuthenticatedUser);
router.post("/signUpByCredentials", user_controller_1.signUpByCredentials);
router.post("/logInByCredentials", user_controller_1.logInByCredentials);
router.post("/googleUpsertUser", user_controller_1.googleUpsertUser);
router.post("/setCookie", user_controller_1.setCookie);
router.post("/logout", user_controller_1.logOut);
//===================== For Admin=====================
router.get("/getAllSellerForFilterPage", user_controller_1.getAllSellerForFilterPage);
router.get("/allUserForAdmin", middlewares_2.verifyAdminToken, user_controller_1.allUserForAdmin);
router.get("/singleForEditForSellerSettings/:id", user_controller_1.singleForEditForSellerSettings);
router.patch("/updateSellerStatusOfUser/:userId", middlewares_2.verifyAdminToken, user_controller_1.updateSellerStatus);
router.patch("/updateUserPassword/:userId", middlewares_2.verifyAdminToken, user_controller_1.updateUserPassword);
router.patch("/updateSellerCommission/:userId", middlewares_2.verifyAdminToken, user_controller_1.updateSellerCommission);
router.get("/getDetailsOFSingleUserForAdminCustomerDetailsComponent/:id", 
// verifyAdminToken,
user_controller_1.getDetailsOFSingleUserForAdminCustomerDetailsComponent);
router.get("/check-user-email", middlewares_1.verifyUserToken, user_controller_1.checkUser_Email);
router.get("/checkStuff", middlewares_2.verifyStuffToken, user_controller_1.checkUser_Email);
router.get("/allOrdersOfUser", middlewares_1.verifyUserToken, user_controller_1.allOrdersOfUser);
router.get("/getSingleOrder/:id", middlewares_1.verifyUserToken, user_controller_1.getSingleOrder);
router.get("/allForAdminIndexPage", middlewares_2.verifyAdminToken, user_controller_1.allForAdminIndexPage);
router.get("/allStuffForAdminIndexPage", middlewares_2.verifyAdminToken, user_controller_1.allStuffForAdminIndexPage);
router.get("/getContactInfoOfSingleUserBySlug/:userSlug", user_controller_1.getContactInfoOfSingleUserBySlug);
router.get("/getSingleUserForAddToCartComponent/:id", user_controller_1.getSingleUserForAddToCartComponent);
router.post("/updateUserInfo/:userId", middlewares_1.verifyUserToken, user_controller_1.updateUser);
router.patch("/updateStatus/:id", middlewares_2.verifyAdminToken, user_controller_1.updateStatus);
router.patch("/updatePassword/:id", middlewares_2.verifyAdminToken, user_controller_1.updatePassword);
router.delete("/delete/:id", middlewares_2.verifyAdminToken, (0, reusableControllers_1.deleteById)(user_model_1.default));
exports.default = router;
