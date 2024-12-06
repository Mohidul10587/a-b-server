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
exports.updateOrderStatus = exports.deleteOrder = exports.updateOrder = exports.getSingleOrder = exports.getAllOrders = exports.submitOrder = void 0;
const order_model_1 = __importDefault(require("./order.model"));
// Submit a new order
const submitOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderData = req.body;
        orderData.status = "Pending";
        // Create the order
        const order = yield order_model_1.default.create(orderData);
        // Populate product details after the order is created
        const populatedOrder = yield order.populate({
            path: "products",
            select: "title  price stockStatus photo", // Specify the fields you want to include
        });
        res
            .status(201)
            .json({ message: "Order submitted successfully", order: populatedOrder });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating order", error });
    }
});
exports.submitOrder = submitOrder;
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_model_1.default.find().populate({
            path: "products",
            select: "photo  price",
        });
        res.status(200).json(orders.reverse());
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving orders", error });
    }
});
exports.getAllOrders = getAllOrders;
// Get a single order by ID
const getSingleOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield order_model_1.default.findById(req.params.id).populate({
            path: "products",
            select: "_id title photo price stockStatus", // Select only the fields you need from the product
        });
        if (!order) {
            res.status(404).json({ message: "Order not found" });
            return;
        }
        res.status(200).json(order);
    }
    catch (error) {
        res.status(500).json({ message: "Error retrieving order", error });
    }
});
exports.getSingleOrder = getSingleOrder;
// Update an order by ID
const updateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedOrder = yield order_model_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updatedOrder) {
            res.status(404).json({ message: "Order not found" });
            return;
        }
        res
            .status(200)
            .json({ message: "Order updated successfully", updatedOrder });
    }
    catch (error) {
        res.status(500).json({ message: "Error updating order", error });
    }
});
exports.updateOrder = updateOrder;
// Delete an order by ID
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deletedOrder = yield order_model_1.default.findByIdAndDelete(req.params.id);
        if (!deletedOrder) {
            res.status(404).json({ message: "Order not found" });
            return;
        }
        res.status(200).json({ message: "Order deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting order", error });
    }
});
exports.deleteOrder = deleteOrder;
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const validStatuses = ["Pending", "Shipped", "Delivered", "Cancelled"];
        if (!validStatuses.includes(status)) {
            res.status(400).json({ message: "Invalid status value" });
            return;
        }
        const updatedOrder = yield order_model_1.default.findByIdAndUpdate(id, { status }, { new: true, runValidators: true });
        if (!updatedOrder) {
            res.status(404).json({ message: "Order not found" });
            return;
        }
        res.status(200).json({
            message: "Order status updated successfully",
            order: updatedOrder,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error updating order status", error });
    }
});
exports.updateOrderStatus = updateOrderStatus;
