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
exports.updateStatus = exports.deleteWithdrawRequest = exports.updateWithdrawRequest = exports.getWithdrawRequestById = exports.getWithdrawRequests = exports.getWithdrawRequestsForAdmin = exports.createWithdrawRequest = void 0;
const withdraw_model_1 = __importDefault(require("./withdraw.model"));
const transaction_model_1 = __importDefault(require("../transaction/transaction.model"));
const adminTransaction_model_1 = __importDefault(require("../adminTransaction/adminTransaction.model"));
// Create a new withdraw request
const createWithdrawRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const data = req.body;
        const sellerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id; // Access seller ID from middleware
        const dataWithSellerId = Object.assign(Object.assign({}, data), { sellerId });
        const newWithdrawRequest = yield withdraw_model_1.default.create(dataWithSellerId);
        res.status(201).json({
            message: "Withdraw request created successfully",
            withdrawRequest: newWithdrawRequest,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error creating withdraw request", error });
    }
});
exports.createWithdrawRequest = createWithdrawRequest;
// Get all withdraw requests for a seller
const getWithdrawRequestsForAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const sellerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id; // Access seller ID from middleware
        const withdrawRequests = yield withdraw_model_1.default.find().populate({
            path: "sellerId", // Populate sellerId field in WithdrawRequest
            model: "User", // From the User model
            populate: {
                path: "sellerId", // Populate sellerId field in the populated User
                model: "Seller", // From the Seller model
                select: "companyName email photo",
            },
        });
        res.status(200).json({
            message: "Withdraw requests fetched successfully",
            withdrawRequests,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error fetching withdraw requests", error });
    }
});
exports.getWithdrawRequestsForAdmin = getWithdrawRequestsForAdmin;
// Get all withdraw requests for a seller
const getWithdrawRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const sellerId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id; // Access seller ID from middleware
        const withdrawRequests = yield withdraw_model_1.default.find({ sellerId });
        res.status(200).json({
            message: "Withdraw requests fetched successfully",
            withdrawRequests,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error fetching withdraw requests", error });
    }
});
exports.getWithdrawRequests = getWithdrawRequests;
// Get a specific withdraw request by ID
const getWithdrawRequestById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const withdrawRequest = yield withdraw_model_1.default.findById(id);
        if (!withdrawRequest) {
            return res.status(404).json({ message: "Withdraw request not found" });
        }
        res.status(200).json({
            message: "Withdraw request fetched successfully",
            withdrawRequest,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching withdraw request", error });
    }
});
exports.getWithdrawRequestById = getWithdrawRequestById;
// Update a withdraw request
const updateWithdrawRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const updatedWithdrawRequest = yield withdraw_model_1.default.findByIdAndUpdate(id, updatedData, {
            new: true,
        });
        if (!updatedWithdrawRequest) {
            return res.status(404).json({ message: "Withdraw request not found" });
        }
        res.status(200).json({
            message: "Withdraw request updated successfully",
            withdrawRequest: updatedWithdrawRequest,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error updating withdraw request", error });
    }
});
exports.updateWithdrawRequest = updateWithdrawRequest;
// Delete a withdraw request
const deleteWithdrawRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedWithdrawRequest = yield withdraw_model_1.default.findByIdAndDelete(id);
        if (!deletedWithdrawRequest) {
            return res.status(404).json({ message: "Withdraw request not found" });
        }
        res.status(200).json({
            message: "Withdraw request deleted successfully",
            withdrawRequest: deletedWithdrawRequest,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error deleting withdraw request", error });
    }
});
exports.deleteWithdrawRequest = deleteWithdrawRequest;
// Update withdraw request status
const updateStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const { withdrawId } = req.params;
    const { withdrawStatus } = req.body;
    // Validate the status
    if (!["Pending", "Rejected", "Approved"].includes(withdrawStatus)) {
        return res.status(400).json({ message: "Invalid status provided" });
    }
    try {
        // Find the withdraw request by ID and update the status
        const updatedWithdraw = yield withdraw_model_1.default.findByIdAndUpdate(withdrawId, { withdrawStatus }, { new: true }).populate({
            path: "sellerId", // Populate sellerId field in WithdrawRequest
            model: "User", // From the User model
            select: "_id",
        });
        if (!updatedWithdraw) {
            return res.status(404).json({ message: "Withdraw request not found" });
        }
        const lastTnxOfAdmin = yield adminTransaction_model_1.default.findOne().sort({
            _id: -1,
        });
        if (updatedWithdraw.withdrawStatus === "Approved") {
            const lastTransaction = yield transaction_model_1.default.findOne({
                sellerId: (_a = updatedWithdraw.sellerId) === null || _a === void 0 ? void 0 : _a._id,
            }).sort({ _id: -1 });
            yield transaction_model_1.default.create({
                sellerId: lastTransaction === null || lastTransaction === void 0 ? void 0 : lastTransaction.sellerId,
                userId: lastTransaction === null || lastTransaction === void 0 ? void 0 : lastTransaction.userId,
                orderId: lastTransaction === null || lastTransaction === void 0 ? void 0 : lastTransaction.orderId,
                recentAmount: (_b = lastTransaction === null || lastTransaction === void 0 ? void 0 : lastTransaction.currentTotal) !== null && _b !== void 0 ? _b : 0,
                previousAmount: (_c = lastTransaction === null || lastTransaction === void 0 ? void 0 : lastTransaction.currentTotal) !== null && _c !== void 0 ? _c : 0,
                currentTotal: 0,
                reasonOfTransaction: "Withdraw",
            });
            yield adminTransaction_model_1.default.create({
                sellerId: updatedWithdraw.sellerId,
                recentAmount: updatedWithdraw.amount,
                previousAmount: (_d = lastTnxOfAdmin === null || lastTnxOfAdmin === void 0 ? void 0 : lastTnxOfAdmin.currentTotal) !== null && _d !== void 0 ? _d : 0,
                currentTotal: ((_e = lastTnxOfAdmin === null || lastTnxOfAdmin === void 0 ? void 0 : lastTnxOfAdmin.currentTotal) !== null && _e !== void 0 ? _e : 0) - updatedWithdraw.amount,
                reasonOfTransaction: "Pay to seller",
            });
        }
        // Return the updated withdraw request
        return res.status(200).json(updatedWithdraw);
    }
    catch (error) {
        console.error("Error updating withdraw status:", error);
        return res.status(500).json({ message: "Server error" });
    }
});
exports.updateStatus = updateStatus;
