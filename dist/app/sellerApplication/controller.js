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
exports.updateSellerApplicationStatus = exports.singleForUserForDetailsPageBySlug = exports.allSlugsForUserIndexPage = exports.allForUserIndexPage = exports.singleForAdmin = exports.allForAdminIndexPage = exports.update = exports.create = void 0;
const model_1 = require("./model");
const user_model_1 = __importDefault(require("../user/user.model"));
//===================== Admin Controllers =====================
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield model_1.SellerApplication.create(req.body);
        res
            .status(201)
            .json({ message: "SellerApplication created successfully!", item });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to create SellerApplication.",
            error: error.message,
        });
    }
});
exports.create = create;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const item = yield model_1.SellerApplication.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!item)
            return res.status(404).json({ message: "SellerApplication not found." });
        res
            .status(200)
            .json({ message: "SellerApplication updated successfully!", item });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to update SellerApplication.",
            error: error.message,
        });
    }
});
exports.update = update;
const allForAdminIndexPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield model_1.SellerApplication.find()
            .populate("user", "name username email phone image")
            .sort({ createdAt: -1 });
        res.status(200).json(items);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch SellerApplications.",
            error: error.message,
        });
    }
});
exports.allForAdminIndexPage = allForAdminIndexPage;
const singleForAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield model_1.SellerApplication.findOne({ _id: req.params.id }).populate("user", "name username email phone image");
        res.status(200).json(item);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch SellerApplication.",
            error: error.message,
        });
    }
});
exports.singleForAdmin = singleForAdmin;
// ================== User Controllers ======================
const allForUserIndexPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield model_1.SellerApplication.find().sort({ createdAt: -1 });
        res.status(200).json(items);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch SellerApplications.",
            error: error.message,
        });
    }
});
exports.allForUserIndexPage = allForUserIndexPage;
const allSlugsForUserIndexPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield model_1.SellerApplication.find({ display: true }, "slug -_id");
        res.status(200).json({
            message: "SellerApplication slugs fetched successfully!",
            items,
        });
    }
    catch (error) {
        console.error("Failed to fetch slugs:", error);
        res
            .status(500)
            .json({ message: "Failed to fetch SellerApplication slugs." });
    }
});
exports.allSlugsForUserIndexPage = allSlugsForUserIndexPage;
const singleForUserForDetailsPageBySlug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield model_1.SellerApplication.findOne({ slug: req.params.slug });
        if (!item) {
            return res
                .status(404)
                .json({ message: "Oops! SellerApplication not found.", item: null });
        }
        res.status(200).json(item);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch SellerApplication.",
            error: error.message,
        });
    }
});
exports.singleForUserForDetailsPageBySlug = singleForUserForDetailsPageBySlug;
const updateSellerApplicationStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!["pending", "approved", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }
        // Find application
        const application = yield model_1.SellerApplication.findById(id).populate("user");
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }
        application.status = status;
        yield application.save();
        // ✅ If approved, update user with application details
        if (status === "approved" && application.user) {
            // @ts-ignore
            yield user_model_1.default.findByIdAndUpdate(application.user._id, {
                role: "seller",
                isEnabledByAdmin: true,
                companyName: application.companyName,
                companyEmail: application.companyEmail,
                companyPhone: application.companyPhone,
                whatsapp: application.whatsapp,
                coverImg: application.coverImg,
                image: application.image,
                firstContactPersonName: application.firstContactPersonName,
                firstContactPersonPhone: application.firstContactPersonPhone,
                secondContactPersonName: application.secondContactPersonName,
                secondContactPersonPhone: application.secondContactPersonPhone,
            });
        }
        return res.json({
            message: `Application ${status} successfully`,
            application,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateSellerApplicationStatus = updateSellerApplicationStatus;
