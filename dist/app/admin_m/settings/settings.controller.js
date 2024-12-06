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
exports.updateDefaultSellerStatus = exports.updateSettings = exports.getPrivacyPoliciesOfSettings = exports.getSettings = void 0;
const cloudinary_config_1 = __importDefault(require("../../shared/cloudinary.config"));
const settings_model_1 = __importDefault(require("./settings.model"));
const uploadToCloudinary = (file) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary_config_1.default.uploader.upload_stream((error, result) => {
            if (error) {
                return reject(error);
            }
            resolve(result);
        });
        stream.end(file.buffer);
    });
};
const getSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const settings = yield settings_model_1.default.findOne();
        if (!settings) {
            res.status(404).json({ message: "Settings not found" });
            return;
        }
        res.status(200).json(settings);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getSettings = getSettings;
const getPrivacyPoliciesOfSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const settings = yield settings_model_1.default.findOne();
        if (!settings) {
            res.status(404).json({ message: "Settings not found" });
            return;
        }
        res.status(200).json(settings.privacyPolicies);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getPrivacyPoliciesOfSettings = getPrivacyPoliciesOfSettings;
const updateSettings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = req.files;
        const logo = files.logo ? files.logo[0] : null;
        const favicon = files.favicon ? files.favicon[0] : null;
        const loto = files.loto ? files.loto[0] : null;
        const fbImage = files.fbImage ? files.fbImage[0] : null;
        let logoUrl = "";
        let faviconUrl = "";
        let lotoUrl = "";
        let fbImageUrl = "";
        if (logo) {
            const result = yield uploadToCloudinary(logo);
            logoUrl = result.secure_url;
        }
        if (favicon) {
            const result = yield uploadToCloudinary(favicon);
            faviconUrl = result.secure_url;
        }
        if (loto) {
            const result = yield uploadToCloudinary(loto);
            lotoUrl = result.secure_url;
        }
        if (fbImage) {
            const result = yield uploadToCloudinary(fbImage);
            fbImageUrl = result.secure_url;
        }
        // Find the first document in the collection
        const settings = yield settings_model_1.default.findOne();
        if (settings) {
            settings.logo = logoUrl || settings.logo;
            settings.favicon = faviconUrl || settings.favicon;
            settings.loto = lotoUrl || settings.loto;
            settings.fbImage = fbImageUrl || settings.fbImage;
            settings.bgColor = req.body.bgColor || settings.bgColor;
            settings.websiteTitle = req.body.websiteTitle || settings.websiteTitle;
            settings.websiteBgColor =
                req.body.websiteBgColor || settings.websiteBgColor;
            settings.copyright = req.body.copyright || settings.copyright;
            settings.country = req.body.country || settings.country;
            settings.currencySymbol =
                req.body.currencySymbol || settings.currencySymbol;
            settings.priceZero = req.body.priceZero || settings.priceZero;
            settings.highlights = req.body.highlights || settings.highlights;
            settings.shippingInside =
                req.body.shippingInside || settings.shippingInside;
            settings.shippingOutside =
                req.body.shippingOutside || settings.shippingOutside;
            settings.deliveryMethod1 =
                req.body.deliveryMethod1 || settings.deliveryMethod1;
            settings.deliveryTime1 = req.body.deliveryTime1 || settings.deliveryTime1;
            settings.deliveryMethod2 =
                req.body.deliveryMethod2 || settings.deliveryMethod2;
            settings.deliveryTime2 = req.body.deliveryTime2 || settings.deliveryTime2;
            settings.payment = req.body.payment || settings.payment;
            settings.paymentText1 = req.body.paymentText1 || settings.paymentText1;
            settings.paymentText2 = req.body.paymentText2 || settings.paymentText2;
            settings.officeAddress = req.body.officeAddress || settings.officeAddress;
            settings.whatsapp = req.body.whatsapp;
            settings.telegram = req.body.telegram;
            settings.note = req.body.note || settings.note;
            settings.order = req.body.order || settings.order;
            settings.orderText = req.body.orderText || settings.orderText;
            settings.metaDescription =
                req.body.metaDescription || settings.metaDescription;
            settings.description = req.body.description;
            settings.privacyPolicies =
                req.body.privacyPolicies || settings.privacyPolicies;
            settings.termsAndConditions =
                req.body.termsAndConditions || settings.termsAndConditions;
            settings.otherPolicies = req.body.otherPolicies || settings.otherPolicies;
            settings.sellerDefaultStatus =
                req.body.sellerDefaultStatus || settings.sellerDefaultStatus;
            settings.phone = req.body.phone || settings.phone;
            settings.tags =
                req.body.tags.split(",").map((tag) => tag.trim()) ||
                    settings.tags;
            const result = yield settings.save();
            res.status(200).json(settings);
        }
        else {
            res.status(404).json({ message: "Settings not found" });
        }
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.updateSettings = updateSettings;
const updateDefaultSellerStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params; // Extract the ID from request parameters
        const { status } = req.body; // Extract the status from request body
        // Validate that status is provided
        if (status === undefined) {
            return res
                .status(400)
                .json({ message: "Missing required field: status" });
        }
        console.log("Received ID:", id);
        console.log("Received Status:", status);
        // Find the document by ID and update the 'sellerDefaultStatus' field
        const result = yield settings_model_1.default.findByIdAndUpdate(id, // Match the document by ID
        { sellerDefaultStatus: status }, // Update only the 'sellerDefaultStatus' field
        { new: true, runValidators: true } // Return the updated document and validate input
        );
        if (!result) {
            return res
                .status(404)
                .json({ message: "No settings document found with the provided ID" });
        }
        res.status(200).json({
            message: "Default seller status updated successfully",
            data: result,
        });
    }
    catch (error) {
        console.log("Error during update:", error);
        res.status(500).json({
            message: "Error updating Default seller status",
            error: error.message,
        });
    }
});
exports.updateDefaultSellerStatus = updateDefaultSellerStatus;
