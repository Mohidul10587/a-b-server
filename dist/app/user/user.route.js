"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/user.routes.ts
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const user_middleware_1 = __importDefault(require("./user.middleware"));
const router = express_1.default.Router();
// Route to create a new user
router.post("/create", user_controller_1.createUser);
router.post("/logInWithEmailPassword", user_controller_1.logInWithEmailPassword);
router.get("/check-user-email", user_middleware_1.default, user_controller_1.checkUser_Email);
router.post("/logout", user_controller_1.logOut);
router.post("/signUpWithEmailPassword", user_controller_1.createUserByEmailAndPassword);
router.post("/logout", user_controller_1.logOut);
router.get("/allOrdersOfUser", user_middleware_1.default, user_controller_1.getOrdersByUserId);
router.get("/getSingleOrder/:id", user_middleware_1.default, user_controller_1.getSingleOrder);
router.get("/all", user_controller_1.getAllUsers);
router.get("/singleUser/:userId", user_controller_1.getSingleUser);
router.get("/getSingleUserBySlug/:userSlug", user_controller_1.getSingleUserBySlug);
router.get("/getSingleUserById/:id", user_controller_1.getSingleUserById);
router.get("/sellerStatus/:userSlug", user_controller_1.getStatus);
router.get("/getContactInfoOfSingleUserBySlug/:userSlug", user_controller_1.getContactInfoOfSingleUserBySlug);
router.get("/getSingleUserForAddToCartComponent/:id", user_controller_1.getSingleUserForAddToCartComponent);
router.post("/updateUserInfo/:userId", user_middleware_1.default, user_controller_1.updateUser);
router.post("/add-coins", user_controller_1.addCoins);
exports.default = router;
