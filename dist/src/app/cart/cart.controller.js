"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateIsChecked = exports.removeItemFromCart = exports.getUserCart = exports.updateProductQuantityInDataBase = exports.addSingleItemToCart = exports.createOrUpdate = void 0;
const cart_model_1 = __importDefault(require("./cart.model"));
const createOrUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, cartItems } = req.body;
        if (!userId || !cartItems || !Array.isArray(cartItems)) {
            return res.status(400).json({ message: "Invalid request data" });
        }
        // Find the cart for the user
        let cart = yield cart_model_1.default.findOne({ userId });
        if (!cart) {
            // Create a new cart if none exists
            cart = new cart_model_1.default({ userId, cartItems });
        }
        else {
            // Loop through the new cart items
            cartItems.forEach((newItem) => {
                const existingItemIndex = cart.cartItems.findIndex((item) => item.variantId === newItem.variantId);
                if (existingItemIndex !== -1) {
                    // Update quantity if item already exists
                    cart.cartItems[existingItemIndex].quantity += newItem.quantity;
                }
                else {
                    // Add new item to cart only if it's not already there
                    cart.cartItems.push(newItem);
                }
            });
            // Ensure cartItems don't have duplicates
            cart.cartItems = Array.from(new Map(cart.cartItems.map((item) => [item.variantId, item])).values());
        }
        // Save the cart after updates
        yield cart.save();
        res.status(200).json({ message: "Cart updated successfully", cart });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.createOrUpdate = createOrUpdate;
const addSingleItemToCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, cartItem } = req.body; // Accept a single cart item
        if (!userId || !cartItem || typeof cartItem !== "object") {
            return res.status(400).json({ message: "Invalid request data" });
        }
        // Find the cart for the user
        let cart = yield cart_model_1.default.findOne({ userId });
        if (!cart) {
            // Create a new cart if none exists
            cart = new cart_model_1.default({ userId, cartItems: [cartItem] });
        }
        else {
            // Check if the item already exists in the cart
            const existingItemIndex = cart.cartItems.findIndex((item) => item.variantId === cartItem.variantId);
            if (existingItemIndex !== -1) {
                // Update quantity if item already exists
                cart.cartItems[existingItemIndex].quantity += cartItem.quantity;
            }
            else {
                // Add new item to cart
                cart.cartItems.push(cartItem);
            }
        }
        // Save the updated cart
        yield cart.save();
        res.status(200).json({ message: "Item added to cart successfully", cart });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding item to cart", error });
    }
});
exports.addSingleItemToCart = addSingleItemToCart;
const updateProductQuantityInDataBase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, productId, variantId, operationType } = req.body;
        if (!userId || !productId || !variantId || !operationType) {
            return res.status(400).json({ message: "Invalid request data" });
        }
        // Find the user's cart
        let cart = yield cart_model_1.default.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        // Find the item in the cart
        const itemIndex = cart.cartItems.findIndex((item) => item._id.toString() === productId && item.variantId === variantId);
        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not found in cart" });
        }
        // Update the quantity based on the operation type
        if (operationType === "increase") {
            cart.cartItems[itemIndex].quantity += 1;
        }
        else if (operationType === "decrease") {
            if (cart.cartItems[itemIndex].quantity > 1) {
                cart.cartItems[itemIndex].quantity -= 1;
            }
            else {
                // Remove item from cart if quantity becomes 0
                cart.cartItems.splice(itemIndex, 1);
            }
        }
        else {
            return res.status(400).json({ message: "Invalid operation type" });
        }
        // Save the updated cart
        yield cart.save();
        res
            .status(200)
            .json({ message: "Item quantity updated successfully", cart });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating item quantity", error });
    }
});
exports.updateProductQuantityInDataBase = updateProductQuantityInDataBase;
const getUserCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params; // Get userId from the query parameter
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }
        // Find the cart for the given userId
        const cart = yield cart_model_1.default.findOne({ userId });
        // Return the user's cart data
        res.status(200).json({
            message: "Cart fetched successfully",
            respondedData: (cart === null || cart === void 0 ? void 0 : cart.cartItems) || [],
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching cart", error });
    }
});
exports.getUserCart = getUserCart;
const removeItemFromCart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, productId, variantId } = req.body;
        if (!userId || !productId || !variantId) {
            return res.status(400).json({ message: "Invalid request data" });
        }
        // Find the user's carts
        let cart = yield cart_model_1.default.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        // Filter out the item to be removed
        const updatedCartItems = cart.cartItems.filter((item) => !(item._id.toString() === productId && item.variantId === variantId));
        // Update cart items
        cart.cartItems = updatedCartItems;
        yield cart.save();
        res.status(200).json({ message: "Item removed successfully", cart });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error removing item from cart", error });
    }
});
exports.removeItemFromCart = removeItemFromCart;
const updateIsChecked = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, variantId, isChecked } = req.body;
        if (!userId || !variantId) {
            return res.status(400).json({ message: "Missing required fields." });
        }
        const cart = yield cart_model_1.default.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found." });
        }
        const updatedCart = yield cart_model_1.default.findOneAndUpdate({ userId, "cartItems.variantId": variantId }, { $set: { "cartItems.$.isChecked": isChecked } }, { new: true });
        if (!updatedCart) {
            return res.status(404).json({ message: "Product not found in cart." });
        }
        res
            .status(200)
            .json({ message: "isChecked updated successfully", cart: updatedCart });
    }
    catch (error) {
        console.error("Error updating isChecked:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateIsChecked = updateIsChecked;
