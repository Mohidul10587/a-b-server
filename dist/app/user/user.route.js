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
//-----------------for user-----------------------------------
router.post("/create", user_controller_1.createUserBySocialMethod);
router.post("/createUserByEmailAndPassword", user_controller_1.createUserByEmailAndPassword);
router.get("/getAuthenticatedUser", user_controller_1.getAuthenticatedUser);
router.post("/logout", user_controller_1.logOut);
router.post("/logInUserWithEmailPassword", user_controller_1.logInUserWithEmailPassword);
router.post("/logInStuffWithEmailPassword", user_controller_1.logInStuffWithEmailPassword);
router.get("/singleUser/:userId", user_controller_1.getSingleUser);
router.get("/getSingleUserBySlug/:userSlug", user_controller_1.getSingleUserBySlug);
router.get("/getSingleUserById/:id", user_controller_1.getSingleUserById);
router.get("/sellerStatus/:userSlug", user_controller_1.getStatus);
router.get("/singleForEditPage/:id", middlewares_1.verifyUserToken, user_controller_1.singleForEditPage);
router.get("/getSummaryOfActivity", middlewares_1.verifyUserToken, user_controller_1.getSummaryOfActivity);
router.post("/add-coins", user_controller_1.addCoins);
router.put("/update/:id", middlewares_1.verifyUserToken, user_controller_1.update);
//-----------------for Admin-----------------------------------
router.post("/createStuffByEmailAndPassword", middlewares_2.verifyAdminToken, user_controller_1.createStuffByEmailAndPassword);
router.get("/getDetailsOFSingleUserForAdminCustomerDetailsComponent/:id", 
// verifyAdminToken,
user_controller_1.getDetailsOFSingleUserForAdminCustomerDetailsComponent);
router.get("/check-user-email", middlewares_1.verifyUserToken, user_controller_1.checkUser_Email);
router.get("/checkStuff", middlewares_2.verifyStuffToken, user_controller_1.checkUser_Email);
router.get("/allOrdersOfUser", middlewares_1.verifyUserToken, user_controller_1.getOrdersByUserId);
router.get("/getSingleOrder/:id", middlewares_1.verifyUserToken, user_controller_1.getSingleOrder);
router.get("/allForAdminIndexPage", middlewares_2.verifyAdminToken, user_controller_1.allForAdminIndexPage);
router.get("/allStuffForAdminIndexPage", middlewares_2.verifyAdminToken, user_controller_1.allStuffForAdminIndexPage);
router.get("/getContactInfoOfSingleUserBySlug/:userSlug", user_controller_1.getContactInfoOfSingleUserBySlug);
router.get("/getSingleUserForAddToCartComponent/:id", user_controller_1.getSingleUserForAddToCartComponent);
router.post("/updateUserInfo/:userId", middlewares_1.verifyUserToken, user_controller_1.updateUser);
router.patch("/updateStatus/:id", middlewares_2.verifyAdminToken, user_controller_1.updateStatus);
router.patch("/updatePassword/:id", middlewares_2.verifyAdminToken, user_controller_1.updatePassword);
router.delete("/delete/:id", middlewares_2.verifyAdminToken, (0, reusableControllers_1.deleteById)(user_model_1.default));
router.post("/createUserAsStuffByEmailAndPasswordByAdmin", middlewares_2.verifyAdminToken, user_controller_1.createUserByEmailAndPassword);
exports.default = router;
