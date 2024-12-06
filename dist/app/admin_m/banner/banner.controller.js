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
exports.getBannersWithHomePageChecked = exports.updatePagesInBanners = exports.getBannersByBrand = exports.getBannersByCategory = exports.deleteBannerById = exports.getBannerById = exports.getAllBanners = exports.updateBannerById = exports.createBanner = void 0;
const banner_model_1 = __importDefault(require("./banner.model")); // Ensure the correct path to the model
const uplCloudinary_1 = require("../../shared/uplCloudinary");
const createBanner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, bannersInfo } = req.body;
        // Extract banners data from JSON string in request body
        const bannersData = JSON.parse(bannersInfo);
        // Handle file uploads and map them with banner data
        const bannerUploads = yield Promise.all(bannersData.map((banner, index) => __awaiter(void 0, void 0, void 0, function* () {
            const file = req.files.bannerImages[index];
            if (file) {
                const result = yield (0, uplCloudinary_1.uploadToCloudinary)(file.buffer);
                return {
                    img: result.secure_url,
                    title: banner.title,
                    link: banner.link,
                };
            }
            return null;
        })));
        // Filter out any null values in bannerUploads
        const filteredBannerUploads = bannerUploads.filter((upload) => upload !== null);
        // Create a new banner document
        const newBanner = new banner_model_1.default({
            title,
            banners: filteredBannerUploads,
        });
        // Save the banner document to MongoDB
        yield newBanner.save();
        // Respond with the saved banner data
        res.status(201).json(newBanner);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.createBanner = createBanner;
// Controller function to update a banner by ID
const updateBannerById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, bannersInfo } = req.body;
        const parsedBannersInfo = JSON.parse(bannersInfo);
        const existingBanner = yield banner_model_1.default.findById(req.params.id);
        if (!existingBanner) {
            return res.status(404).json({ error: "Banner not found" });
        }
        const files = req.files;
        // Array to hold secure URLs of uploaded images, initialized with existing img values
        let secureUrlArray = [];
        if (files && files.bannerImages && files.bannerImages.length > 0) {
            // Upload images and collect secure URLs in the same order
            yield Promise.all(files.bannerImages.map((file, index) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const result = yield (0, uplCloudinary_1.uploadToCloudinary)(file.buffer);
                    // Assign secure_url to the correct index
                    secureUrlArray[index] = result.secure_url;
                }
                catch (error) {
                    console.error("Error uploading image:", error);
                    throw new Error("Error uploading image");
                }
            })));
        }
        // Update parsedBannersInfo by filling in empty img fields with URLs from secureUrlArray
        let urlIndex = 0; // To track which collected URL to use
        const Updated_Banner_info = parsedBannersInfo.map((banner) => {
            // Check if the img is empty and we still have collected URLs left to use
            if (banner.img === "" && urlIndex < secureUrlArray.length) {
                // Replace the empty img with the next collected URL
                banner.img = secureUrlArray[urlIndex];
                urlIndex++; // Move to the next URL for the next empty img
            }
            return banner;
        });
        const updatedBanner = yield banner_model_1.default.findByIdAndUpdate(req.params.id, {
            title,
            banners: Updated_Banner_info,
        }, { new: true });
        if (!updatedBanner) {
            return res.status(404).json({ error: "Banner not found" });
        }
        res.status(200).json(updatedBanner);
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.updateBannerById = updateBannerById;
const getAllBanners = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const banners = (yield banner_model_1.default.find()).reverse();
        res.status(200).json(banners);
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getAllBanners = getAllBanners;
const getBannerById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const banner = yield banner_model_1.default.findById(req.params.id);
        if (!banner) {
            return res.status(404).json({ error: "Banner not found" });
        }
        res.status(200).json(banner);
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getBannerById = getBannerById;
const deleteBannerById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bannerId = req.params.id;
        // Find and delete the banner by ID
        const banner = yield banner_model_1.default.findByIdAndDelete(bannerId);
        if (!banner) {
            return res.status(404).json({ error: "Banner not found" });
        }
        // Respond with a success message
        res.status(200).json({ message: "Banner deleted successfully" });
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.deleteBannerById = deleteBannerById;
// Controller function to get banners by category
const getBannersByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categoryId = req.params.categoryId;
        // Find banners that contain the specified category ID
        const banners = yield banner_model_1.default.find({ category: categoryId });
        res.status(200).json(banners);
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getBannersByCategory = getBannersByCategory;
const getBannersByBrand = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const brandId = req.params.brandId;
        // Find banners that contain the specified category ID
        const banners = yield banner_model_1.default.find({ brands: brandId });
        res.status(200).json(banners);
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getBannersByBrand = getBannersByBrand;
// banners.controller.ts
// Controller function to update the pages field in all banner documents
const updatePagesInBanners = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const newPages = [{ _id: "1", title: "Home", checked: false }];
        // Update the pages field in all banner documents
        yield banner_model_1.default.updateMany({}, { pages: newPages });
        // Optionally, fetch updated banners after update
        const updatedBanners = yield banner_model_1.default.find();
        res.status(200).json(updatedBanners);
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.updatePagesInBanners = updatePagesInBanners;
const getBannersWithHomePageChecked = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const banners = yield banner_model_1.default.find({
            "pages.title": "Home",
            "pages.checked": true,
        }).sort({ position: 1 }); // Sort by 'position' in ascending order
        res.status(200).json(banners);
    }
    catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.getBannersWithHomePageChecked = getBannersWithHomePageChecked;
