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
exports.deleteAllPageElements = exports.deletePageElementById = exports.getPageElementById = exports.createPageElement = void 0;
const element_model_1 = require("./element.model"); // Your Mongoose model
const cloudinary_config_1 = __importDefault(require("../shared/cloudinary.config"));
// Helper function to upload images to Cloudinary using promises
// Helper function to upload images to Cloudinary using promises
const uploadImageToCloudinary = (file) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_config_1.default.uploader.upload_stream({ resource_type: "image", folder: "your_folder_name" }, // Optional: specify folder
        (error, result) => {
            if (error) {
                reject(error); // Reject the promise on error
            }
            else if (result && result.secure_url) {
                resolve(result.secure_url); // Resolve the promise with the image URL
            }
            else {
                reject(new Error("Image upload failed, no result returned from Cloudinary"));
            }
        });
        // Stream the file buffer to Cloudinary
        uploadStream.end(file.buffer);
    });
};
const createPageElement = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { sectionTitle, link, status, subtitle, titleLink, titleAlignment, isTitle, desktopGrid, mobileGrid, margin, padding, titleBackgroundColor, sectionBackgroundColor, gridStyle, productStyle, postLimit, display, imagePosition, showTitle, position, selectionType, bannerId, productSectionId, } = req.body;
    try {
        // Handle uploaded images
        const uploadedImages = req.files;
        const images = (uploadedImages === null || uploadedImages === void 0 ? void 0 : uploadedImages.images) || [];
        const imageUrls = []; // Initialize an array to store Cloudinary URLs
        // Upload each image to Cloudinary using promises
        for (const file of images) {
            const imageUrl = yield uploadImageToCloudinary(file); // Await the upload and get the URL
            imageUrls.push(imageUrl); // Push the image URL to the array
        }
        console.log(imageUrls);
        // Create a new PageElement with the form data and image URLs
        const newPageElement = new element_model_1.HomePageElements({
            sectionTitle,
            link,
            status,
            subtitle,
            titleLink,
            titleAlignment,
            isTitle: isTitle === "true", // Convert string back to boolean
            desktopGrid: parseInt(desktopGrid), // Convert string back to number
            mobileGrid: parseInt(mobileGrid), // Convert string back to number
            margin: parseInt(margin), // Convert string back to number
            padding: parseInt(padding), // Convert string back to number
            titleBackgroundColor,
            sectionBackgroundColor,
            gridStyle,
            productStyle,
            postLimit: parseInt(postLimit), // Convert string back to number
            display,
            imagePosition,
            showTitle: showTitle === "true", // Convert string back to boolean
            position: parseInt(position), // Convert string back to number
            selectionType,
            bannerId: bannerId ? bannerId : null,
            productSectionId,
            images: imageUrls, // Store image URLs in the database
        });
        // Save the new PageElement to the database
        const savedPageElement = yield newPageElement.save();
        res.status(201).json({
            message: "PageElement created successfully",
            data: savedPageElement,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error creating PageElement",
            error: error.message,
        });
    }
});
exports.createPageElement = createPageElement;
const getPageElementById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        // Find the page element by ID and populate the banner and product section
        const pageElements = yield element_model_1.HomePageElements.findById(id)
            .populate("bannerId")
            .populate("productSectionId");
        // If the page element doesn't exist, return 404
        if (!pageElements) {
            return res.status(404).json({
                message: "HomePageElements not found",
            });
        }
        // Send success response with the fetched data
        res.status(200).json({
            message: "HomePageElements fetched successfully",
            data: pageElements,
        });
    }
    catch (error) {
        // Narrow the error type before using it
        if (error instanceof Error) {
            return res.status(500).json({
                message: "Error fetching HomePageElements",
                error: error.message,
            });
        }
        // Fallback for unexpected error types
        res.status(500).json({
            message: "Unknown error occurred",
        });
    }
});
exports.getPageElementById = getPageElementById;
// Delete a single PageElement by ID
const deletePageElementById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const pageElement = yield element_model_1.HomePageElements.findByIdAndDelete(id);
        if (!pageElement) {
            return res.status(404).json({ message: "PageElement not found" });
        }
        res.status(200).json({
            message: "PageElement deleted successfully",
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error deleting PageElement", error: error.message });
    }
});
exports.deletePageElementById = deletePageElementById;
// Delete all HomePageElements
const deleteAllPageElements = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield element_model_1.HomePageElements.deleteMany();
        res
            .status(200)
            .json({ message: "All HomePageElements deleted successfully" });
    }
    catch (error) {
        res.status(500).json({
            message: "Error deleting all HomePageElements",
            error: error.message,
        });
    }
});
exports.deleteAllPageElements = deleteAllPageElements;
