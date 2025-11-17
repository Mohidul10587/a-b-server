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
exports.updateOrderStatusByAdmin = exports.updateStatusBySeller = exports.getOrderById = exports.getAllOrdersForAdmin = exports.getAllOrders = void 0;
const sellerOrder_model_1 = require("./sellerOrder.model"); // Adjust path if needed
const transaction_model_1 = __importDefault(require("../transaction/transaction.model"));
const adminTransaction_model_1 = __importDefault(require("../adminTransaction/adminTransaction.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const model_1 = __importDefault(require("../product/model"));
const user_model_1 = __importDefault(require("../user/user.model"));
// Get all orders
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const sellerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const orders = yield sellerOrder_model_1.SellerOrderModel.find({ sellerId });
        const totalProductsNumber = yield model_1.default.find({
            seller: sellerId,
        }).countDocuments();
        // Use aggregation to calculate counts in one query
        const results = yield sellerOrder_model_1.SellerOrderModel.aggregate([
            { $match: { sellerId } }, // Match orders for the specific seller
            {
                $group: {
                    _id: "$status", // Group by status
                    count: { $sum: 1 }, // Count the documents in each group
                },
            },
        ]);
        // Parse results to dynamically extract counts for all statuses
        const counts = results.reduce((acc, item) => {
            acc[item._id] = item.count; // Use status as key and count as value
            return acc;
        }, {}); // Initialize an empty object for counts
        // Extract specific statuses or set defaults if they don't exist
        const totalPendingOrder = counts["Pending"] || 0;
        const totalApprovedOrder = counts["Approved"] || 0;
        const totalShippedOrder = counts["Shipped"] || 0;
        const totalCanceledOrder = counts["Cancelled"] || 0;
        const totalDeliveredOrder = counts["Delivered"] || 0;
        // Calculate the total orders
        const totalOrderNumber = totalPendingOrder +
            totalApprovedOrder +
            totalShippedOrder +
            totalCanceledOrder +
            totalDeliveredOrder;
        res.status(200).json({
            orders: orders.reverse(),
            totalPendingOrder,
            totalApprovedOrder,
            totalShippedOrder,
            totalCanceledOrder,
            totalDeliveredOrder,
            totalOrderNumber,
            totalProductsNumber,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching orders", error });
    }
});
exports.getAllOrders = getAllOrders;
// Get all orders
const getAllOrdersForAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield sellerOrder_model_1.SellerOrderModel.find().populate({
            path: "sellerId",
            select: "name image email",
            populate: {
                path: "sellerId",
                select: "companyName photo email",
            },
        });
        const totalProductsNumber = yield model_1.default.find().countDocuments();
        // Use aggregation to calculate counts in one query
        const results = yield sellerOrder_model_1.SellerOrderModel.aggregate([
            {
                $group: {
                    _id: "$status", // Group by status
                    count: { $sum: 1 }, // Count the documents in each group
                },
            },
        ]);
        // Parse results to dynamically extract counts for all statuses
        const counts = results.reduce((acc, item) => {
            acc[item._id] = item.count; // Use status as key and count as value
            return acc;
        }, {}); // Initialize an empty object for counts
        // Extract specific statuses or set defaults if they don't exist
        const totalPendingOrder = counts["Pending"] || 0;
        const totalApprovedOrder = counts["Approved"] || 0;
        const totalShippedOrder = counts["Shipped"] || 0;
        const totalCanceledOrder = counts["Cancelled"] || 0;
        const totalDeliveredOrder = counts["Delivered"] || 0;
        // Calculate the total orders
        const totalOrderNumber = totalPendingOrder +
            totalApprovedOrder +
            totalShippedOrder +
            totalCanceledOrder +
            totalDeliveredOrder;
        res.status(200).json({
            orders: orders.reverse(),
            totalPendingOrder,
            totalApprovedOrder,
            totalShippedOrder,
            totalCanceledOrder,
            totalDeliveredOrder,
            totalOrderNumber,
            totalProductsNumber,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching orders", error });
    }
});
exports.getAllOrdersForAdmin = getAllOrdersForAdmin;
// // Get a single order by ID
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const order = yield sellerOrder_model_1.SellerOrderModel.findById({ _id: id }).populate({
            path: "sellerId",
            select: "name image email",
        });
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json(order);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching order", error });
    }
});
exports.getOrderById = getOrderById;
const updateStatusBySeller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const sellerOrderId = req.params.id;
        const { status } = req.body;
        if (!status) {
            throw new Error("Status is required");
        }
        // 1️⃣ Find previous order
        const previousOrder = yield sellerOrder_model_1.SellerOrderModel.findOne({
            _id: sellerOrderId,
        }).session(session);
        if (!previousOrder) {
            throw new Error("Order not found");
        }
        const previousStatus = previousOrder.status;
        // 2️⃣ Update product quantities conditionally
        if (status === "Delivered" && previousStatus !== "Delivered") {
            // Delivered হলে stock কমাও
            for (const product of previousOrder.products) {
                const existingProduct = yield model_1.default.findById(product._id).session(session);
                if (existingProduct) {
                    const newQuantity = Math.max(0, existingProduct.existingQnt - product.quantity);
                    yield model_1.default.findOneAndUpdate({ _id: product._id }, { $set: { existingQnt: newQuantity } }, { session });
                }
            }
        }
        if (previousStatus === "Delivered" && status === "Cancelled") {
            // Cancelled হলে stock ফেরত দাও
            for (const product of previousOrder.products) {
                const existingProduct = yield model_1.default.findById(product._id).session(session);
                if (existingProduct) {
                    const newQuantity = existingProduct.existingQnt + product.quantity;
                    yield model_1.default.findOneAndUpdate({ _id: product._id }, { $set: { existingQnt: newQuantity } }, { session });
                }
            }
        }
        // 3️⃣ Update order status
        const updatedOrder = yield sellerOrder_model_1.SellerOrderModel.findOneAndUpdate({ _id: sellerOrderId }, { status }, { new: true, session });
        if (!updatedOrder) {
            throw new Error("Order not found after update");
        }
        const seller = yield user_model_1.default.findById(updatedOrder.sellerId).session(session);
        if (!seller) {
            throw new Error("Seller not found");
        }
        // 4️⃣ Calculate commissions
        const totalCommission = updatedOrder.products.reduce((total, product) => {
            var _a;
            return total +
                (product.sellingPrice *
                    ((_a = seller.sellerInfo) === null || _a === void 0 ? void 0 : _a.commission) *
                    product.quantity) /
                    100;
        }, 0);
        const remainedCommission = updatedOrder.products.reduce((total, product) => {
            var _a;
            return total +
                ((100 - ((_a = seller.sellerInfo) === null || _a === void 0 ? void 0 : _a.commission) || 10) / 100) *
                    product.sellingPrice *
                    product.quantity;
        }, 0);
        const lastTnxOfAdmin = yield adminTransaction_model_1.default.findOne()
            .sort({ _id: -1 })
            .session(session);
        const lastTnxOfSeller = yield transaction_model_1.default.findOne({
            sellerId: updatedOrder.sellerId,
        })
            .sort({ _id: -1 })
            .session(session);
        // 5️⃣ Handle status transitions
        // Delivered ➡ Cancelled (Refund commissions)
        if (previousStatus === "Delivered" && status === "Cancelled") {
            yield transaction_model_1.default.create([
                {
                    sellerId: updatedOrder.sellerId,
                    userId: updatedOrder.userId,
                    orderId: updatedOrder._id,
                    recentAmount: totalCommission,
                    previousAmount: (_a = lastTnxOfSeller === null || lastTnxOfSeller === void 0 ? void 0 : lastTnxOfSeller.currentTotal) !== null && _a !== void 0 ? _a : 0,
                    currentTotal: ((_b = lastTnxOfSeller === null || lastTnxOfSeller === void 0 ? void 0 : lastTnxOfSeller.currentTotal) !== null && _b !== void 0 ? _b : 0) - totalCommission,
                    reasonOfTransaction: "Cancel after delivered",
                },
            ], { session });
            yield adminTransaction_model_1.default.create([
                {
                    sellerId: updatedOrder.sellerId,
                    userId: updatedOrder.userId,
                    orderId: updatedOrder._id,
                    recentAmount: remainedCommission,
                    previousAmount: (_c = lastTnxOfAdmin === null || lastTnxOfAdmin === void 0 ? void 0 : lastTnxOfAdmin.currentTotal) !== null && _c !== void 0 ? _c : 0,
                    currentTotal: ((_d = lastTnxOfAdmin === null || lastTnxOfAdmin === void 0 ? void 0 : lastTnxOfAdmin.currentTotal) !== null && _d !== void 0 ? _d : 0) - remainedCommission,
                    reasonOfTransaction: "Cancel after delivered",
                },
            ], { session });
        }
        // Any status ➡ Delivered (Give commissions)
        if (status === "Delivered" && previousStatus !== "Delivered") {
            yield transaction_model_1.default.create([
                {
                    sellerId: updatedOrder.sellerId,
                    userId: updatedOrder.userId,
                    orderId: updatedOrder._id,
                    recentAmount: totalCommission,
                    previousAmount: (_e = lastTnxOfSeller === null || lastTnxOfSeller === void 0 ? void 0 : lastTnxOfSeller.currentTotal) !== null && _e !== void 0 ? _e : 0,
                    currentTotal: ((_f = lastTnxOfSeller === null || lastTnxOfSeller === void 0 ? void 0 : lastTnxOfSeller.currentTotal) !== null && _f !== void 0 ? _f : 0) + totalCommission,
                    reasonOfTransaction: "Order delivered",
                },
            ], { session });
            yield adminTransaction_model_1.default.create([
                {
                    sellerId: updatedOrder.sellerId,
                    userId: updatedOrder.userId,
                    orderId: updatedOrder._id,
                    recentAmount: remainedCommission,
                    previousAmount: (_g = lastTnxOfAdmin === null || lastTnxOfAdmin === void 0 ? void 0 : lastTnxOfAdmin.currentTotal) !== null && _g !== void 0 ? _g : 0,
                    currentTotal: ((_h = lastTnxOfAdmin === null || lastTnxOfAdmin === void 0 ? void 0 : lastTnxOfAdmin.currentTotal) !== null && _h !== void 0 ? _h : 0) + remainedCommission,
                    reasonOfTransaction: "Order delivered",
                },
            ], { session });
        }
        // 6️⃣ Commit transaction
        yield session.commitTransaction();
        res.status(200).json(updatedOrder);
    }
    catch (error) {
        yield session.abortTransaction();
        console.error("Error updating order status:", error);
        res
            .status(500)
            .json({ message: error.message || "Error updating order status" });
    }
    finally {
        session.endSession();
    }
});
exports.updateStatusBySeller = updateStatusBySeller;
// // 'Update status by admin'
const updateOrderStatusByAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { id } = req.params;
        const { status } = req.body;
        // Validate that the status is provided
        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }
        const previousOrder = yield sellerOrder_model_1.SellerOrderModel.findOne({ _id: id }).session(session);
        if (!previousOrder) {
            yield session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "Order not found" });
        }
        for (const product of previousOrder.products) {
            const existingProduct = yield model_1.default.findById(product._id).session(session);
            if (existingProduct) {
                const newQuantity = Math.max(0, existingProduct.existingQnt - product.quantity);
                yield model_1.default.findOneAndUpdate({ _id: product._id }, { $set: { existingQnt: newQuantity } }, { new: true, session });
            }
        }
        // Update the order status
        const updatedOrder = yield sellerOrder_model_1.SellerOrderModel.findOneAndUpdate({ _id: id }, { status: status }, { new: true, session });
        if (!updatedOrder) {
            yield session.abortTransaction();
            session.endSession();
            return res.status(404).json({ message: "Order not found" });
        }
        // Calculate commission values
        const totalCommission = updatedOrder.products.reduce((total, product) => {
            const commission = (product.sellingPrice * product.commissionForSeller) / 100;
            return total + commission;
        }, 0);
        const remainedCommission = updatedOrder.products.reduce((total, product) => {
            const commission = ((100 - product.commissionForSeller) / 100) * product.sellingPrice;
            return total + commission;
        }, 0);
        // Get last transactions
        const lastTnxOfAdmin = yield adminTransaction_model_1.default.findOne()
            .sort({ _id: -1 })
            .session(session);
        const lastTnxOfSeller = yield transaction_model_1.default.findOne({
            sellerId: updatedOrder.sellerId,
        })
            .sort({ _id: -1 })
            .session(session);
        if (previousOrder.status === "Delivered" &&
            updatedOrder.status === "Cancelled") {
            yield transaction_model_1.default.create([
                {
                    sellerId: updatedOrder.sellerId,
                    userId: updatedOrder.userId,
                    orderId: updatedOrder._id,
                    recentAmount: totalCommission,
                    previousAmount: (_a = lastTnxOfSeller === null || lastTnxOfSeller === void 0 ? void 0 : lastTnxOfSeller.currentTotal) !== null && _a !== void 0 ? _a : 0,
                    currentTotal: ((_b = lastTnxOfSeller === null || lastTnxOfSeller === void 0 ? void 0 : lastTnxOfSeller.currentTotal) !== null && _b !== void 0 ? _b : 0) - totalCommission,
                    reasonOfTransaction: "Cancel by admin after delivered",
                },
            ], { session });
            yield adminTransaction_model_1.default.create([
                {
                    sellerId: updatedOrder.sellerId,
                    userId: updatedOrder.userId,
                    orderId: updatedOrder._id,
                    recentAmount: remainedCommission,
                    previousAmount: (_c = lastTnxOfAdmin === null || lastTnxOfAdmin === void 0 ? void 0 : lastTnxOfAdmin.currentTotal) !== null && _c !== void 0 ? _c : 0,
                    currentTotal: ((_d = lastTnxOfAdmin === null || lastTnxOfAdmin === void 0 ? void 0 : lastTnxOfAdmin.currentTotal) !== null && _d !== void 0 ? _d : 0) - remainedCommission,
                    reasonOfTransaction: "Cancel by admin after delivered",
                },
            ], { session });
        }
        if (updatedOrder.status === "Delivered") {
            yield transaction_model_1.default.create([
                {
                    sellerId: updatedOrder.sellerId,
                    userId: updatedOrder.userId,
                    orderId: updatedOrder._id,
                    recentAmount: totalCommission,
                    previousAmount: (_e = lastTnxOfSeller === null || lastTnxOfSeller === void 0 ? void 0 : lastTnxOfSeller.currentTotal) !== null && _e !== void 0 ? _e : 0,
                    currentTotal: ((_f = lastTnxOfSeller === null || lastTnxOfSeller === void 0 ? void 0 : lastTnxOfSeller.currentTotal) !== null && _f !== void 0 ? _f : 0) + totalCommission,
                    reasonOfTransaction: "Order delivered by admin",
                },
            ], { session });
            yield adminTransaction_model_1.default.create([
                {
                    sellerId: updatedOrder.sellerId,
                    userId: updatedOrder.userId,
                    orderId: updatedOrder._id,
                    recentAmount: remainedCommission,
                    previousAmount: (_g = lastTnxOfAdmin === null || lastTnxOfAdmin === void 0 ? void 0 : lastTnxOfAdmin.currentTotal) !== null && _g !== void 0 ? _g : 0,
                    currentTotal: ((_h = lastTnxOfAdmin === null || lastTnxOfAdmin === void 0 ? void 0 : lastTnxOfAdmin.currentTotal) !== null && _h !== void 0 ? _h : 0) + remainedCommission,
                    reasonOfTransaction: "Order delivered by admin",
                },
            ], { session });
        }
        // Commit transaction
        yield session.commitTransaction();
        session.endSession();
        res.status(200).json(updatedOrder);
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        res.status(500).json({ message: "Error updating order status", error });
    }
});
exports.updateOrderStatusByAdmin = updateOrderStatusByAdmin;
// // Delete an order
// export const deleteOrder = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const deletedOrder = await SellerOrderModel.findByIdAndDelete(id);
//     if (!deletedOrder) {
//       return res.status(404).json({ message: "Order not found" });
//     }
//     res.status(200).json({ message: "Order deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting order", error });
//   }
// };
