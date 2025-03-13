"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cart_controller_1 = require("./cart.controller");
const user_middleware_1 = __importDefault(require("../user/user.middleware"));
const router = express_1.default.Router();
router.post("/create", cart_controller_1.createOrUpdate);
router.post("/addSingleItemToCart", cart_controller_1.addSingleItemToCart);
router.post("/updateProductQuantityInDataBase", user_middleware_1.default, cart_controller_1.updateProductQuantityInDataBase);
router.get("/getUserCart/:userId", cart_controller_1.getUserCart);
router.delete("/removeItemFromCart", cart_controller_1.removeItemFromCart);
router.patch("/update-isChecked", user_middleware_1.default, cart_controller_1.updateIsChecked);
exports.default = router;
