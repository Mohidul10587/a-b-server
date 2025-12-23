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
exports.getSingleOrders = exports.updateOrderStatus = exports.allCancelledOrderForAdmin = exports.allDeliveredOrderForAdmin = exports.allOrderForAdmin = exports.allPendingOrderForAdmin = exports.latestPendingOrdersForAdminWithCounts = exports.create = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const cart_model_1 = __importDefault(require("../cart/cart.model"));
const category_model_1 = __importDefault(require("../category/category.model"));
const writer_model_1 = __importDefault(require("../writer/writer.model"));
const model_1 = __importDefault(require("../product/model"));
const order_model_1 = __importDefault(require("../order/order.model"));
const user_model_1 = __importDefault(require("../user/user.model"));
const sellerOrder_model_1 = require("../ordersOFSeller/sellerOrder.model");
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const orderInfo = req.body;
        console.log("This is order info", orderInfo);
        const userId = orderInfo.user;
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
                    receiverName: orderInfo.deliveryInfo.receiverName,
                    receiverPhone: orderInfo.deliveryInfo.receiverPhone,
                    deliveryType: orderInfo.deliveryInfo.deliveryType,
                    district: orderInfo.deliveryInfo.district,
                    thana: orderInfo.deliveryInfo.thana,
                    village: orderInfo.deliveryInfo.village,
                    postOffice: orderInfo.deliveryInfo.postOffice,
                    postalCode: orderInfo.deliveryInfo.postalCode,
                    courierAddress: orderInfo.deliveryInfo.courierAddress,
                    status: orderInfo.status,
                    userId: orderInfo.user || null,
                    paymentMethod: orderInfo.paymentMethod,
                    shippingMethod: orderInfo.shippingMethod || "Cache on delivery",
                    transactionId: orderInfo.paymentTnxId || "Cache on delivery",
                    totalAmount: 0,
                });
            }
            // Add product to the respective seller order
            const sellerOrder = sellerOrdersMap.get(sellerId);
            sellerOrder.products.push(Object.assign(Object.assign({}, product), { commissionForSeller: 90, transactionId: orderInfo.paymentTnxId, userId: orderInfo.userId || null }));
            sellerOrder.totalAmount += product.sellingPrice * product.quantity;
        });
        // Convert map values to array
        const sellerOrders = Array.from(sellerOrdersMap.values());
        yield sellerOrder_model_1.SellerOrderModel.insertMany(sellerOrders, { session });
        // 3. Clear the user's cart
        if (userId) {
            yield cart_model_1.default.findOneAndUpdate({ userId }, { $set: { cartItems: [] } }, { session });
        }
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
const fetchOrders = (status, page, limit, sortBy) => __awaiter(void 0, void 0, void 0, function* () {
    const query = {};
    if (status)
        query.status = status;
    // Run order queries parallel
    const [orders, totalOrders] = yield Promise.all([
        order_model_1.default.find(query)
            .select("deliveryInfo.name deliveryInfo.address deliveryInfo.phone paymentStatus paymentMethod status cart createdAt")
            .sort({ [sortBy]: -1 })
            .skip((page - 1) * limit)
            .limit(limit),
        order_model_1.default.countDocuments(query),
    ]);
    const updatedOrders = orders.map((order) => {
        var _a;
        return ({
            customersName: order.deliveryInfo.name,
            address: order.deliveryInfo.address,
            phone: order.deliveryInfo.phone,
            paymentStatus: order.paymentStatus ? "Paid" : "Unpaid",
            paymentMethod: order.paymentMethod,
            _id: order._id,
            firstProduct: (_a = order.cart) === null || _a === void 0 ? void 0 : _a[0],
            status: order.status,
        });
    });
    return { updatedOrders, totalOrders };
});
// Get latest pending orders + counts
const latestPendingOrdersForAdminWithCounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        // Run both in parallel
        const [orderData, categoriesCount, writersCount, ordersCount, productsCount, sellersCount, usersCount,] = yield Promise.all([
            fetchOrders("Pending", page, limit, "createdAt"),
            category_model_1.default.countDocuments(),
            writer_model_1.default.countDocuments(),
            order_model_1.default.countDocuments(),
            model_1.default.countDocuments(),
            user_model_1.default.countDocuments({ role: "seller" }),
            user_model_1.default.countDocuments(),
        ]);
        res.status(200).json({
            orders: orderData.updatedOrders,
            totalOrders: orderData.totalOrders,
            page,
            limit,
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
exports.latestPendingOrdersForAdminWithCounts = latestPendingOrdersForAdminWithCounts;
// Get pending orders
const allPendingOrderForAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { updatedOrders, totalOrders } = yield fetchOrders("Pending", page, limit, "createdAt");
        res.status(200).json({ orders: updatedOrders, totalOrders, page, limit });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch pending orders.", error });
    }
});
exports.allPendingOrderForAdmin = allPendingOrderForAdmin;
const allOrderForAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { updatedOrders, totalOrders } = yield fetchOrders(null, page, limit, "createdAt");
        res.status(200).json({ orders: updatedOrders, totalOrders, page, limit });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to fetch pending orders.", error });
    }
});
exports.allOrderForAdmin = allOrderForAdmin;
// Get delivered orders
const allDeliveredOrderForAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { updatedOrders, totalOrders } = yield fetchOrders("Delivered", page, limit, "updatedAt");
        res.status(200).json({ orders: updatedOrders, totalOrders, page, limit });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Failed to fetch delivered orders.", error });
    }
});
exports.allDeliveredOrderForAdmin = allDeliveredOrderForAdmin;
// Get cancelled orders
const allCancelledOrderForAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const { updatedOrders, totalOrders } = yield fetchOrders("Cancelled", page, limit, "updatedAt");
        res.status(200).json({ orders: updatedOrders, totalOrders, page, limit });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Failed to fetch cancelled orders.", error });
    }
});
exports.allCancelledOrderForAdmin = allCancelledOrderForAdmin;
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
