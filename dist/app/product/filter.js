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
exports.filter = void 0;
const model_1 = __importDefault(require("./model"));
const category_model_1 = __importDefault(require("../category/category.model"));
const subcategory_model_1 = __importDefault(require("../subcategory/subcategory.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const writer_model_1 = __importDefault(require("../writer/writer.model"));
const user_model_1 = __importDefault(require("../user/user.model"));
const filter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categories = "", subcategories = "", writers = "", sellers = "", page = 1, limit = 9, } = req.query;
        let filter = {};
        const parseIds = (str) => { var _a; return ((_a = (Array.isArray(str) ? str[0] : str)) === null || _a === void 0 ? void 0 : _a.split("--").filter(Boolean)) || []; };
        // Convert to ObjectId arrays (safe)
        const categoryIds = parseIds(categories).map((id) => new mongoose_1.default.Types.ObjectId(id));
        const subcategoryIds = parseIds(subcategories).map((id) => new mongoose_1.default.Types.ObjectId(id));
        const sellersIds = parseIds(sellers).map((id) => new mongoose_1.default.Types.ObjectId(id));
        const writersIds = parseIds(writers).map((id) => new mongoose_1.default.Types.ObjectId(id));
        if (categoryIds.length)
            filter.category = { $in: categoryIds };
        if (sellersIds.length)
            filter.seller = { $in: sellersIds };
        if (writersIds.length)
            filter.writer = { $in: writersIds };
        if (subcategoryIds.length)
            filter.subcategory = { $in: subcategoryIds };
        // ✅ Build dynamic filter
        if (subcategoryIds.length > 0) {
            // Find categories of selected subcategories
            const subs = yield subcategory_model_1.default.find({
                _id: { $in: subcategoryIds },
            }).select("parentCategory");
            const categoriesWithSub = new Set(subs.map((s) => String(s.parentCategory)));
            const categoriesWithoutSub = categoryIds.filter((id) => !categoriesWithSub.has(String(id)));
            const orFilters = [];
            // ✅ only subcategory based data for matched categories
            orFilters.push(Object.assign(Object.assign({ subcategory: { $in: subcategoryIds } }, (sellersIds.length && { seller: { $in: sellersIds } })), (writersIds.length && { writer: { $in: writersIds } })));
            // ✅ full category data for others
            if (categoriesWithoutSub.length > 0) {
                orFilters.push(Object.assign(Object.assign({ category: { $in: categoriesWithoutSub } }, (sellersIds.length && { seller: { $in: sellersIds } })), (writersIds.length && { writer: { $in: writersIds } })));
            }
            filter = { $or: orFilters };
        }
        else if (categoryIds.length > 0) {
            // ✅ only categories selected, no subcategories
            filter.category = { $in: categoryIds };
        }
        const skip = (Number(page) - 1) * Number(limit);
        // --- Aggregation filters ---
        const categoryCountFilter = Object.assign({}, filter);
        delete categoryCountFilter.category;
        delete categoryCountFilter.subcategory;
        delete categoryCountFilter.writer;
        delete categoryCountFilter.seller;
        const subcategoryCountFilter = Object.assign({}, filter);
        delete subcategoryCountFilter.subcategory;
        delete subcategoryCountFilter.writer;
        delete subcategoryCountFilter.seller;
        const writerCountFilter = Object.assign({}, filter);
        delete writerCountFilter.writer;
        const sellerCountFilter = Object.assign({}, filter);
        delete sellerCountFilter.seller;
        // --- Fetch products, counts, categories & subcategories ---
        const [products, totalCount, categoryCounts, subcategoryCounts, writersCounts, sellersCounts, allCategories, allSubcategories, allWriters, allSellers,] = yield Promise.all([
            model_1.default.find(filter)
                .skip(skip)
                .limit(Number(limit))
                .populate([
                { path: "category", select: "title slug img" },
                { path: "writer", select: "title slug img" },
                { path: "seller", select: "name slug img" },
                { path: "subcategory", select: "title slug parentCategory" },
            ])
                .select("title slug img sellingPrice regularPrice"),
            model_1.default.countDocuments(filter),
            category_model_1.default.aggregate([
                {
                    $lookup: {
                        from: "products", // Product collection name
                        let: { catId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ["$category", "$$catId"] },
                                },
                            },
                        ],
                        as: "products",
                    },
                },
                {
                    $addFields: {
                        count: { $size: "$products" }, // যাদের product নেই -> count = 0
                    },
                },
                {
                    $project: {
                        title: 1,
                        slug: 1,
                        img: 1,
                        count: 1,
                    },
                },
            ]),
            model_1.default.aggregate([
                { $match: subcategoryCountFilter },
                { $group: { _id: "$subcategory", count: { $sum: 1 } } },
            ]),
            model_1.default.aggregate([
                { $match: writerCountFilter },
                { $group: { _id: "$writer", count: { $sum: 1 } } },
            ]),
            model_1.default.aggregate([
                { $match: sellerCountFilter },
                { $group: { _id: "$seller", count: { $sum: 1 } } },
            ]),
            category_model_1.default.find().select("title slug img"),
            categoryIds.length
                ? subcategory_model_1.default.find({ parentCategory: { $in: categoryIds } })
                    .select("title slug parentCategory")
                    .lean()
                : Promise.resolve([]),
            writer_model_1.default.find().select("title slug img"),
            user_model_1.default.find({ role: "seller" }).select("name slug img"),
        ]);
        const totalPages = Math.ceil(totalCount / Number(limit));
        // --- Prepare valid categories with counts and selected flags ---
        const validCategories = allCategories
            .map((cat) => {
            const found = categoryCounts.find((c) => String(c._id) === String(cat._id));
            if (!found)
                return null;
            return Object.assign(Object.assign({}, cat.toObject()), { count: found.count, selected: categories.includes(new mongoose_1.default.Types.ObjectId(cat._id)) });
        })
            .filter(Boolean);
        const validWriters = allWriters
            .map((cat) => {
            const found = writersCounts.find((c) => String(c._id) === String(cat._id));
            if (!found)
                return null;
            return Object.assign(Object.assign({}, cat.toObject()), { count: found.count, selected: writers.includes(new mongoose_1.default.Types.ObjectId(cat._id)) });
        })
            .filter(Boolean);
        const validSellers = allSellers
            .map((cat) => {
            const found = sellersCounts.find((c) => String(c._id) === String(cat._id));
            if (!found)
                return null;
            return Object.assign(Object.assign({}, cat.toObject()), { count: found.count, selected: sellers.includes(new mongoose_1.default.Types.ObjectId(cat._id)) });
        })
            .filter(Boolean);
        // --- Prepare valid subcategories with counts and selected flags ---
        const validSubcategories = allSubcategories
            .map((sub) => {
            const found = subcategoryCounts.find((c) => c);
            if (!found)
                return null;
            return Object.assign(Object.assign({}, sub), { count: found.count, selected: subcategoryIds.includes(new mongoose_1.default.Types.ObjectId(sub._id)) });
        })
            .filter(Boolean);
        res.status(200).json({
            products,
            totalPages,
            currentPage: Number(page),
            categories: validCategories,
            subcategories: validSubcategories,
            writers: validWriters,
            sellers: validSellers,
        });
    }
    catch (error) {
        console.error("Filter Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.filter = filter;
