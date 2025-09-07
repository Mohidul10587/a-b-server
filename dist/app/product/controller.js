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
exports.getFilteredProducts = exports.allForIndexPage = exports.updateStatus = exports.getExistingQuantity = exports.getProductsByPublishersSlug = exports.getProductsByCategorySlug = exports.getProductsByCategory2 = exports.getProductsByCategory = exports.getProductsByWriter = exports.getProductsByWriterSlug = exports.deleteProduct = exports.getAllProductsForOfferPage = exports.getAllForSeriesAddPage = exports.getSingleProduct = exports.getAllProducts = exports.singleForEditPage = exports.singleForUserFoDetailsPageBySlug = exports.update = exports.create = void 0;
const model_1 = __importDefault(require("./model"));
const writer_model_1 = __importDefault(require("../writer/writer.model"));
const category_model_1 = __importDefault(require("../category/category.model"));
const publishers_model_1 = __importDefault(require("../publishers/publishers.model"));
const generateSLug_1 = require("../shared/generateSLug");
const user_model_1 = __importDefault(require("../user/user.model"));
const create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const item = yield model_1.default.create(Object.assign(Object.assign({}, data), { slug: (0, generateSLug_1.generateSlug)(data.title) }));
        // Send success message along with the created product data
        res.status(201).json({
            message: "Created successfully!",
            item, // Optionally, include the created product in the response
        });
    }
    catch (error) {
        // Send error message if there was an issue
        res.status(500).json({
            message: "Failed to create.",
            error: error.message,
        });
    }
});
exports.create = create;
// Update
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const item = yield model_1.default.findByIdAndUpdate(id, req.body, {
            new: true, // Return the updated document
            runValidators: true, // Run validation on the updated data
        });
        if (!item) {
            return res.status(404).json({
                message: "Not found.",
            });
        }
        res.status(200).json({
            message: "Updated successfully!",
            item,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to update.",
            error: error,
        });
    }
});
exports.update = update;
const singleForUserFoDetailsPageBySlug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Step 1: Find the product by slug
        const product = yield model_1.default.findOne({ slug: req.params.slug })
            .populate({
            path: "writer",
            model: "Writer",
            select: "title img slug", // Include only the 'name' field of the brand
        })
            .populate({
            path: "suggestion",
            model: "Suggestion",
            populate: {
                path: "products",
                model: "Product",
                select: "title img slug sellingPrice  rating",
                populate: {
                    path: "writer",
                    model: "Writer",
                    select: "title",
                },
            },
            select: "title", // Include only the 'title' field of the category
        })
            .populate({
            path: "category",
            model: "Category",
            select: "title slug", // Include only the 'title' field of the category
        });
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        const categoryProducts = yield model_1.default.aggregate([
            {
                $match: {
                    // @ts-expect-error: Suppressing error for type mismatch in `_id`
                    category: product.category._id,
                    _id: { $ne: product._id },
                },
            },
            {
                $sample: {
                    size: 10, // Randomly select 10 products
                },
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    writer: 1,
                    sellingPrice: 1,
                    rating: 1,
                    regularPrice: 1,
                    img: 1,
                    slug: 1,
                    stockStatus: 1,
                },
            },
        ]);
        // Step 3: Respond with the product and suggestion data
        res.status(200).json({
            success: true,
            message: "Fetched successfully",
            resData: Object.assign(Object.assign({}, product.toObject()), { productsOfSameCategory: categoryProducts }),
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.singleForUserFoDetailsPageBySlug = singleForUserFoDetailsPageBySlug;
const singleForEditPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const item = yield model_1.default.findOne({ _id: req.params.id });
        res.status(200).json({ message: "Product fetched successfully!", item });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "Failed to fetch Product.", error: error.message });
    }
});
exports.singleForEditPage = singleForEditPage;
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield model_1.default.find()
            .select("_id img title featured  sellingPrice")
            .populate("writer")
            .populate("category");
        const products = result.reverse();
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getAllProducts = getAllProducts;
const getSingleProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield model_1.default.findOne({ _id: req.params.productId })
            .populate("writer")
            .populate("category");
        res.status(200).json(product);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getSingleProduct = getSingleProduct;
// Get all data with optional filtering
const getAllForSeriesAddPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { category, subcategory } = req.query;
        // Build filter dynamically
        const filter = {
            display: true,
        };
        if (category)
            filter.category = category;
        if (subcategory)
            filter.subcategory = subcategory;
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === "seller") {
            filter.seller = req.user._id;
        }
        const items = yield model_1.default.find(filter).select("title sellingPrice img slug display seller");
        res.status(200).json({
            message: "Fetched successfully!",
            resData: items.reverse(),
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to fetch.",
            error: error.message,
        });
    }
});
exports.getAllForSeriesAddPage = getAllForSeriesAddPage;
const getAllProductsForOfferPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield model_1.default.find()
            .select("_id img title sellingPrice slug subcategory ")
            .populate("writer", "title")
            .populate("category", "title");
        const products = result.reverse();
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getAllProductsForOfferPage = getAllProductsForOfferPage;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productId = req.params.productId;
    try {
        const result = yield model_1.default.deleteOne({ _id: productId });
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.deleteProduct = deleteProduct;
const getProductsByWriterSlug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = req.params.slug;
    try {
        const writer = yield writer_model_1.default.find({ slug });
        const result = yield model_1.default.find({ writer }).select("_id img title featured  sellingPrice slug category subcategory publisher language");
        const products = result.reverse();
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getProductsByWriterSlug = getProductsByWriterSlug;
const getProductsByWriter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const writerId = req.params.writerId;
    try {
        const result = yield model_1.default.find({ writer: writerId })
            .select("_id img title featured  sellingPrice slug")
            .populate("writer")
            .populate("category");
        const products = result.reverse();
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getProductsByWriter = getProductsByWriter;
const getProductsByCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = req.params.categoryId;
    const notIncludeProductId = req.params.notIncludeProductId;
    try {
        const products = yield model_1.default.find({
            category: categoryId,
            _id: { $ne: notIncludeProductId },
        })
            .populate("writer")
            .populate("category");
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getProductsByCategory = getProductsByCategory;
const getProductsByCategory2 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryId = req.params.categoryId;
    try {
        const products = yield model_1.default.find({
            category: categoryId,
        })
            .populate("writer")
            .populate("category");
        res.status(200).json(products.reverse());
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getProductsByCategory2 = getProductsByCategory2;
const getProductsByCategorySlug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = req.params.slug;
    try {
        const category = yield category_model_1.default.findOne({ slug: slug })
            .select("_id title slug img metaTitle metaDescription description shortDescription keywords ")
            .populate({
            path: "subcategories",
            select: "title",
        })
            .lean();
        const categoryId = category === null || category === void 0 ? void 0 : category._id;
        const products = yield model_1.default.find({
            category: categoryId,
        }).select("_id img title featured sele sellingPrice slug stockStatus writer publisher seller subcategory language");
        const writers = yield writer_model_1.default.find().select("_id title slug img").lean();
        const reverseProducts = products.reverse();
        res.status(200).json({ products: reverseProducts, writers, category });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getProductsByCategorySlug = getProductsByCategorySlug;
const getProductsByPublishersSlug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slug = req.params.slug;
    try {
        const publisher = yield publishers_model_1.default.findOne({ slug: slug })
            .select("_id title slug imgUrl keywords metaTitle metaDescription description shortDescription keywords ")
            .lean();
        const publisherId = publisher === null || publisher === void 0 ? void 0 : publisher._id;
        const products = yield model_1.default.find({
            publisher: publisherId,
        }).select("_id img title category subcategory writer  featured  sellingPrice slug stockStatus language ");
        const writers = yield writer_model_1.default.find().select("title").lean();
        const categories = yield category_model_1.default.find()
            .select("title")
            .populate({
            path: "subcategories",
            select: "title",
        })
            .lean();
        const reverseProducts = products.reverse();
        res
            .status(200)
            .json({ products: reverseProducts, writers, publisher, categories });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getProductsByPublishersSlug = getProductsByPublishersSlug;
const getExistingQuantity = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { mainId } = req.query;
        const product = yield model_1.default.findOne({ _id: mainId });
        res.status(200).json({
            message: "Fetched successfully!",
            respondedData: product === null || product === void 0 ? void 0 : product.existingQnt, // Optionally, include the created category in the response
        });
        return;
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to Fetch.",
            error: error.message,
        });
    }
});
exports.getExistingQuantity = getExistingQuantity;
// Update the status  by ID
const updateStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { display } = req.body;
    try {
        const updateProduct = yield model_1.default.findByIdAndUpdate(id, { display }, // Ensure 'status' is the correct field
        { new: true } // Return the updated document
        );
        if (!updateProduct) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({
            message: "User status updated successfully",
            data: updateProduct,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Error updating User status",
            error: error.message,
        });
    }
});
exports.updateStatus = updateStatus;
// Get all data with pagination and filtering
const allForIndexPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const searchText = req.query.search;
        const displayFilter = req.query.display; // e.g., 'true' or 'false'
        const skip = (page - 1) * limit;
        let query = {};
        let displayTrueQuery = { display: true };
        let displayFalseQuery = { display: false };
        if (searchText) {
            query.$or = [
                { title: { $regex: searchText, $options: "i" } },
                { SKU: { $regex: searchText, $options: "i" } },
            ];
        }
        if (displayFilter === "true") {
            query.display = true;
        }
        else if (displayFilter === "false") {
            query.display = false;
        }
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) === "seller") {
            query.seller = req.user._id;
            displayTrueQuery.seller = req.user._id;
            displayFalseQuery.seller = req.user._id;
        }
        const [items, totalCount, totalActiveCount, totalInactiveCount] = yield Promise.all([
            model_1.default.find(query)
                .select("title SKU sellingPrice img slug  display display_2   seller ")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            model_1.default.countDocuments(query),
            model_1.default.countDocuments(displayTrueQuery),
            model_1.default.countDocuments(displayFalseQuery),
        ]);
        res.status(200).json({
            message: "Fetched successfully!",
            resData: items,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit),
            totalItems: totalCount,
            totalActiveCount,
            totalInactiveCount,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to fetch.",
            error: error.message,
        });
    }
});
exports.allForIndexPage = allForIndexPage;
const getFilteredProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = "1", limit = "10", search = "", sellers = "", categories = "", minRating, lang = "all", orderType = "all", } = req.query;
        console.log("THis is order type", orderType);
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const sellerSlugs = (sellers === null || sellers === void 0 ? void 0 : sellers.split("--").filter(Boolean)) || [];
        const categorySlugs = (categories === null || categories === void 0 ? void 0 : categories.split("--").filter(Boolean)) || [];
        const minRatingNum = minRating
            ? parseFloat(minRating)
            : undefined;
        const language = lang;
        const filter = {};
        // Search by product title
        if (search) {
            const regex = new RegExp(search, "i");
            filter.$or = [{ title: regex }, { titleBn: regex }];
        }
        // Filter by seller slugs
        if (sellerSlugs.length > 0) {
            const matchingSellers = yield user_model_1.default.find({ slug: { $in: sellerSlugs }, role: "seller" }, "_id");
            const sellerIds = matchingSellers.map((s) => s._id);
            filter.seller = { $in: sellerIds };
        }
        // ✅ Correct: Filter by category slugs
        if (categorySlugs.length > 0) {
            const matchingCategories = yield category_model_1.default.find({ slug: { $in: categorySlugs } }, "_id");
            const categoryIds = matchingCategories.map((cat) => cat._id);
            filter.category = { $in: categoryIds };
        }
        // Filter by rating
        if (minRatingNum !== undefined) {
            filter.rating = { $gte: minRatingNum };
        }
        // Filter by language
        if (language && language !== "all") {
            filter.language = language;
        }
        // Filter by language
        if (orderType && orderType !== "all") {
            filter.orderType = orderType;
        }
        // Count total matching products
        const totalProducts = yield model_1.default.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limitNum);
        // Fetch paginated products
        const products = yield model_1.default.find(filter)
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum)
            .populate({
            path: "seller",
            match: { role: "seller" },
            select: "slug companyName",
        })
            .populate({
            path: "category",
            select: "slug title",
        })
            .lean();
        res.status(200).json({
            products,
            totalProducts,
            totalPages,
            currentPage: pageNum,
            limit: limitNum,
        });
    }
    catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getFilteredProducts = getFilteredProducts;
