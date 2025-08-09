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
exports.getSingleOrders = exports.updateOrderStatus = exports.allForAdmin = exports.create = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cart_model_1 = __importDefault(require("../cart/cart.model"));
const category_model_1 = __importDefault(require("../category/category.model"));
const writer_model_1 = __importDefault(require("../writer/writer.model"));
const model_1 = __importDefault(require("../product/model"));
const order_model_1 = __importDefault(require("../order/order.model"));
const user_model_1 = __importDefault(require("../user/user.model"));
const sellerOrder_model_1 = require("../ordersOFSeller/sellerOrder.model");
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const orderInfo = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized: user not found" });
        }
        // 1. Create the new order
        const newOrder = yield order_model_1.default.create([orderInfo], { session });
        const sellerOrdersMap = new Map();
        orderInfo.cart.forEach((product) => {
            const sellerId = product.seller.toString();
            if (!sellerOrdersMap.has(sellerId)) {
                sellerOrdersMap.set(sellerId, {
                    sellerId: sellerId,
                    products: [],
                    name: orderInfo.deliveryInfo.name,
                    address: orderInfo.deliveryInfo.address,
                    location: orderInfo.deliveryInfo.address,
                    phone: orderInfo.deliveryInfo.phone,
                    status: orderInfo.paymentStatus,
                    userId: orderInfo.user,
                    paymentMethod: orderInfo.paymentMethod,
                    shippingMethod: orderInfo.shippingMethod || "Cache on delivery",
                    transactionId: orderInfo.paymentTnxId || "Cache on delivery",
                    totalAmount: 0,
                });
            }
            // Add product to the respective seller order
            const sellerOrder = sellerOrdersMap.get(sellerId);
            sellerOrder.products.push(Object.assign(Object.assign({}, product), { commissionForSeller: 90, transactionId: orderInfo.paymentTnxId, userId: orderInfo.userId }));
            sellerOrder.totalAmount += product.sellingPrice * product.quantity;
        });
        // Convert map values to array
        const sellerOrders = Array.from(sellerOrdersMap.values());
        yield sellerOrder_model_1.SellerOrderModel.insertMany(sellerOrders, { session });
        // 3. Clear the user's cart
        yield cart_model_1.default.findOneAndUpdate({ userId }, { $set: { cartItems: [] } }, { session });
        // 3. Commit the transaction
        yield session.commitTransaction();
        session.endSession();
        res.status(201).json({
            message: "Order placed successfully!",
            order: newOrder[0],
        });
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        console.error("Order transaction error:", error);
        res.status(500).json({
            message: "Failed to place order.",
            error: error instanceof Error ? error.message : error,
        });
    }
});
exports.create = create;
const allForAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_model_1.default.find()
            .select("deliveryInfo.name deliveryInfo.address paymentStatus paymentMethod deliveryInfo.phone status cart")
            .sort({ createdAt: -1 });
        const updatedOrders = orders.map((order) => ({
            customersName: order.deliveryInfo.name,
            address: order.deliveryInfo.address,
            phone: order.deliveryInfo.phone,
            paymentStatus: order.paymentStatus ? "Paid" : "Unpaid",
            paymentMethod: order.paymentMethod,
            _id: order._id,
            firstProduct: order.cart[0],
            status: order.status,
        }));
        const [categoriesCount, writersCount, ordersCount, productsCount, sellersCount, usersCount,] = yield Promise.all([
            category_model_1.default.countDocuments(),
            writer_model_1.default.countDocuments(),
            order_model_1.default.countDocuments(),
            model_1.default.countDocuments(),
            user_model_1.default.countDocuments({ role: "seller" }),
            user_model_1.default.countDocuments(),
        ]);
        res.status(200).json({
            orders: updatedOrders,
            counts: {
                categoriesCount,
                writersCount,
                ordersCount,
                productsCount,
                sellersCount,
                usersCount,
            },
        });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch orders.", error });
    }
});
exports.allForAdmin = allForAdmin;
// Update order status
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const order = yield order_model_1.default.findByIdAndUpdate(id, { status }, { new: true });
        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }
        res
            .status(200)
            .json({ message: "Order status updated successfully!", order });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to update order status.", error });
    }
});
exports.updateOrderStatus = updateOrderStatus;
const getSingleOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield order_model_1.default.findOne({ _id: req.params.id });
        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }
        res.status(200).json(order);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch order.", error });
    }
});
exports.getSingleOrders = getSingleOrders;
