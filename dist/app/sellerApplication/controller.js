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
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectSellerApplicationByAdmin = exports.singleForUserForDetailsPageBySlug = exports.allSlugsForUserIndexPage = exports.allForUserIndexPage = exports.singleForAdmin = exports.allForAdminIndexPage = exports.update = exports.create = void 0;
const model_1 = require("./model");
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
const rejectSellerApplicationByAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Find application
        const application = yield model_1.SellerApplication.findById(id);
        if (!application) {
            return res.status(404).json({ message: "Application not found" });
        }
        application.status = "rejected";
        yield application.save();
        return res.json({
            message: `Application rejected successfully`,
            application,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.rejectSellerApplicationByAdmin = rejectSellerApplicationByAdmin;
