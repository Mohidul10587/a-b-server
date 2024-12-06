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
exports.updatePageElement = exports.updatePageElementStatus = exports.deletePageElementById = exports.getElementsByIdAndPage = exports.getElementByIdForUpdate = exports.getElementById = exports.createPageElement = void 0;
const element_model_1 = require("./element.model"); // Your Mongoose model
const cloudinary_config_1 = __importDefault(require("../../shared/cloudinary.config"));
const product_model_1 = __importDefault(require("../../product/product.model"));
const uplCloudinary_1 = require("../../shared/uplCloudinary");
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
    const { targetedPageId, sectionTitle, link, status, subtitle, titleLink, titleAlignment, isTitle, desktopGrid, mobileGrid, margin, padding, titleBackgroundColor, boxText, sectionBackgroundColor, boxBg, gridStyle, productStyle, postLimit, display, imagePosition, page, position, selectionType, bannerId, productSectionId, width, height, suggestionId, } = req.body;
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
        // Create a new PageElement with the form data and image URLs
        const newPageElement = new element_model_1.PageElements({
            targetedPageId,
            sectionTitle,
            link,
            status: status === "true",
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
            boxText,
            boxBg,
            gridStyle,
            productStyle,
            postLimit: parseInt(postLimit), // Convert string back to number
            display,
            imagePosition,
            page,
            position: parseInt(position), // Convert string back to number
            selectionType,
            bannerId: bannerId ? bannerId : null,
            productSectionId,
            images: imageUrls, // Store image URLs in the database
            width,
            height,
            suggestionId: suggestionId ? suggestionId : null,
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
// Get PageElement by ID
const getElementById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const pageElement = yield element_model_1.PageElements.findById(id).populate("bannerId");
        if (!pageElement) {
            return res.status(404).json({ message: "PageElement not found" });
        }
        res.status(200).json({
            message: "PageElement fetched successfully",
            data: pageElement,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error fetching PageElement", error: error.message });
    }
});
exports.getElementById = getElementById;
// Get PageElement by ID
const getElementByIdForUpdate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const pageElement = yield element_model_1.PageElements.findById(id);
        if (!pageElement) {
            return res.status(404).json({ message: "PageElement not found" });
        }
        res.status(200).json({
            message: "PageElement fetched successfully",
            data: pageElement,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error fetching PageElement", error: error.message });
    }
});
exports.getElementByIdForUpdate = getElementByIdForUpdate;
const getElementsByIdAndPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, pageName } = req.params;
    try {
        // Fetch all page elements for the targeted page ID and page name
        const pageElements = yield element_model_1.PageElements.find({
            targetedPageId: id,
            page: pageName,
            status: true,
        })
            .populate("bannerId")
            .populate({
            path: "suggestionId",
            populate: {
                path: "products",
                select: "_id title slug photo price unprice stockStatus",
            },
        });
        // If no page elements are found, return a 404 error
        if (!pageElements.length) {
            return res
                .status(404)
                .json({ message: "No PageElements found for the targeted page ID" });
        }
        // Helper function to find products based on category, subcategory, or brand
        const findProducts = (element, postLimit) => __awaiter(void 0, void 0, void 0, function* () {
            let products = [];
            // Check by category
            const categoryProducts = yield product_model_1.default.find({
                category: element.productSectionId,
            }).select("_id title slug photo price unprice stockStatus");
            if (categoryProducts.length > 0) {
                products = categoryProducts;
            }
            else {
                // Check by subcategory if no category products found
                const subCategoryProducts = yield product_model_1.default.find({
                    subCategory: element.productSectionId,
                }).select("_id title slug photo price unprice stockStatus");
                if (subCategoryProducts.length > 0) {
                    products = subCategoryProducts;
                }
                else {
                    // Fallback to brand if no category or subcategory products found
                    const brandProducts = yield product_model_1.default.find({
                        brand: element.productSectionId,
                    }).select("_id title slug photo price unprice stockStatus");
                    products = brandProducts;
                }
            }
            // Return the latest 10 products
            return products.reverse().slice(0, postLimit);
        });
        // Initialize an array to store updated page elements with products
        const updatedPageElements = yield Promise.all(pageElements.map((element) => __awaiter(void 0, void 0, void 0, function* () {
            // Only process elements where selectionType is 'productSection'
            if (element.selectionType === "productSection") {
                const productOfThisId = yield findProducts(element, element.postLimit);
                // Return the updated element with the productOfThisId attached
                return Object.assign(Object.assign({}, element.toObject()), { productOfThisId });
            }
            return element.toObject(); // If selectionType isn't 'productSection', just return the element
        })));
        // Sort the updated elements by position
        const finalResponse = updatedPageElements.sort((a, b) => a.position - b.position);
        // Send the final response
        res.status(200).json({
            message: `PageElements for targeted Page Id: ${id} fetched successfully`,
            data: finalResponse,
        });
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error fetching PageElements", error: error.message });
    }
});
exports.getElementsByIdAndPage = getElementsByIdAndPage;
// Delete a single PageElement by ID
const deletePageElementById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const pageElement = yield element_model_1.PageElements.findByIdAndDelete(id);
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
// Update the status of a PageElement by ID
const updatePageElementStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params; // Make sure the ID is being passed correctly
    const { status } = req.body;
    try {
        const updatedPageElement = yield element_model_1.PageElements.findByIdAndUpdate(id, { status }, // Ensure 'status' is the correct field
        { new: true } // Return the updated document
        );
        if (!updatedPageElement) {
            return res.status(404).json({ message: "PageElement not found" });
        }
        res.status(200).json({
            message: "PageElement status updated successfully",
            data: updatedPageElement,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error updating PageElement status",
            error: error.message,
        });
    }
});
exports.updatePageElementStatus = updatePageElementStatus;
// Update Page Element
const updatePageElement = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { elementId } = req.params;
    const { targetedPageId, sectionTitle, link, status, titleLink, titleAlignment, isTitle, desktopGrid, mobileGrid, margin, padding, titleBackgroundColor, sectionBackgroundColor, boxText, boxBg, gridStyle, productStyle, postLimit, display, imagePosition, page, position, selectionType, bannerId, productSectionId, width, height, images, suggestionId, } = req.body;
    const parsedBannerId = bannerId === "null" ? null : bannerId;
    const parsedSuggestionId = suggestionId === "null" ? null : suggestionId;
    const parsedImages = JSON.parse(images);
    try {
        // Find the existing PageElement by ID
        const pageElement = yield element_model_1.PageElements.findById(elementId);
        if (!pageElement) {
            return res.status(404).json({ message: "PageElement not found" });
        }
        // Handle image uploads if any
        const files = req.files;
        // Upload new images to Cloudinary
        let secureUrlArray = [];
        if (files && files.images && files.images.length > 0) {
            // Upload images and collect secure URLs in the same order
            yield Promise.all(files.images.map((file, index) => __awaiter(void 0, void 0, void 0, function* () {
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
        let urlIndex = 0; // To track which collected URL to use
        const Updated_Images_info = parsedImages.map((img) => {
            // Check if the img is empty and we still have collected URLs left to use
            if (img === "imgUrl" && urlIndex < secureUrlArray.length) {
                // Replace the empty img with the next collected URL
                img = secureUrlArray[urlIndex];
                urlIndex++; // Move to the next URL for the next empty img
            }
            return img;
        });
        // Update the PageElement with new data and uploaded images
        pageElement.targetedPageId = targetedPageId || pageElement.targetedPageId;
        pageElement.sectionTitle = sectionTitle || pageElement.sectionTitle;
        pageElement.link = link || pageElement.link;
        pageElement.status =
            status !== undefined ? status === "true" : pageElement.status;
        pageElement.titleLink = titleLink || pageElement.titleLink;
        pageElement.titleAlignment = titleAlignment || pageElement.titleAlignment;
        pageElement.isTitle =
            isTitle !== undefined ? isTitle === "true" : pageElement.isTitle;
        pageElement.desktopGrid = desktopGrid
            ? parseInt(desktopGrid)
            : pageElement.desktopGrid;
        pageElement.mobileGrid = mobileGrid
            ? parseInt(mobileGrid)
            : pageElement.mobileGrid;
        pageElement.margin = margin ? parseInt(margin) : pageElement.margin;
        pageElement.padding = padding ? parseInt(padding) : pageElement.padding;
        pageElement.titleBackgroundColor =
            titleBackgroundColor || pageElement.titleBackgroundColor;
        pageElement.sectionBackgroundColor =
            sectionBackgroundColor || pageElement.sectionBackgroundColor;
        pageElement.boxText = boxText || pageElement.boxText;
        pageElement.boxBg = boxBg || pageElement.boxBg;
        pageElement.gridStyle = gridStyle || pageElement.gridStyle;
        pageElement.productStyle = productStyle || pageElement.productStyle;
        pageElement.postLimit = postLimit
            ? parseInt(postLimit)
            : pageElement.postLimit;
        pageElement.display = display || pageElement.display;
        pageElement.imagePosition = imagePosition || pageElement.imagePosition;
        pageElement.page = page || pageElement.page;
        pageElement.position = position ? parseInt(position) : pageElement.position;
        pageElement.selectionType = selectionType || pageElement.selectionType;
        pageElement.width = width || pageElement.width;
        pageElement.height = height || pageElement.height;
        if (selectionType == "productSection") {
            pageElement.productSectionId = productSectionId;
            pageElement.suggestionId = null;
            pageElement.bannerId = null;
        }
        else if (selectionType == "suggestionSection") {
            pageElement.suggestionId = parsedSuggestionId;
            pageElement.productSectionId = "";
            pageElement.bannerId = null;
        }
        else {
            pageElement.bannerId = parsedBannerId;
            pageElement.productSectionId = "";
            pageElement.suggestionId = null;
        }
        pageElement.productSectionId = productSectionId;
        // Only update images if new images are uploaded
        pageElement.images = Updated_Images_info;
        // Save the updated PageElement to the database
        const updatedPageElement = yield pageElement.save();
        res.status(200).json({
            message: "PageElement updated successfully",
            data: updatedPageElement,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error updating PageElement",
            error: error.message,
        });
    }
});
exports.updatePageElement = updatePageElement;
