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
exports.getProductsByCategorySlug = exports.getProductsByCategory2 = exports.getProductsByCategory = exports.getProductsByWriter = exports.getProductsByWriterSlug = exports.deleteProduct = exports.getAllProductsForOfferPage = exports.getAllProductsForAdmin = exports.getSingleProduct = exports.getAllProducts = exports.getProductDetails = exports.updateProduct = exports.createProduct = void 0;
const product_model_1 = __importDefault(require("./product.model"));
const uploadSingleFileToCloudinary_1 = require("../shared/uploadSingleFileToCloudinary");
const writer_model_1 = __importDefault(require("../admin_m/writer/writer.model"));
const category_model_1 = __importDefault(require("../admin_m/category/category.model"));
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { title, slug, description, shortDescription, category, subCategory, price, unprice, stockStatus, writer, youtubeVideo, shippingInside, shippingOutside, metaTitle, metaDescription, tags, publisher, summary, numberOfPage, ISBN, edition, binding, productType, translatorName, language, orderType, titleEnglish, subTitle, suggestion, } = req.body;
    const files = req.files;
    try {
        const photoFile = (_a = files === null || files === void 0 ? void 0 : files.photo) === null || _a === void 0 ? void 0 : _a[0];
        const metaImageFile = (_b = files === null || files === void 0 ? void 0 : files.metaImage) === null || _b === void 0 ? void 0 : _b[0];
        const photoUrl = yield (0, uploadSingleFileToCloudinary_1.cloudinaryUpload)(photoFile);
        const metaImage = yield (0, uploadSingleFileToCloudinary_1.cloudinaryUpload)(metaImageFile);
        const tagsArray = tags.split(",").map((tag) => tag.trim());
        const newProduct = yield product_model_1.default.create({
            title,
            slug,
            description,
            shortDescription,
            category,
            subCategory: subCategory === "" ? null : subCategory,
            price,
            unprice,
            stockStatus,
            writer,
            youtubeVideo,
            shippingInside,
            shippingOutside,
            metaTitle,
            metaDescription,
            publisher,
            summary,
            numberOfPage,
            ISBN,
            edition,
            binding: "dfdf",
            productType,
            translatorName,
            language: "dsds",
            orderType: "dfdf",
            titleEnglish,
            subTitle,
            tags: tagsArray,
            photo: photoUrl ? photoUrl : "",
            metaImage: metaImage ? metaImage : "",
            suggestion: ["null", "undefined", null, undefined, ""].includes(suggestion)
                ? null
                : suggestion,
        });
        res.status(201).json(newProduct);
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});
exports.createProduct = createProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const productId = req.params.productId;
        console.log(productId);
        const { title, slug, description, shortDescription, category, subCategory, price, rating, unprice, stockStatus, writer, photo, featured, sele, condition, warranty, youtubeVideo, shippingInside, shippingOutside, metaTitle, metaDescription, tags, metaImage, suggestion, } = req.body;
        const files = req.files;
        const photoFile = (_a = files === null || files === void 0 ? void 0 : files.photo) === null || _a === void 0 ? void 0 : _a[0];
        const metaImageFile = (_b = files === null || files === void 0 ? void 0 : files.metaImage) === null || _b === void 0 ? void 0 : _b[0];
        const photoUrl = yield (0, uploadSingleFileToCloudinary_1.cloudinaryUpload)(photoFile);
        const metaImageX = yield (0, uploadSingleFileToCloudinary_1.cloudinaryUpload)(metaImageFile);
        const tagsArray = tags.split(",").map((tag) => tag.trim());
        const updatedData = {
            title,
            slug,
            description,
            shortDescription,
            price,
            rating,
            unprice,
            category,
            stockStatus,
            writer,
            photo,
            featured,
            sele,
            condition,
            warranty,
            youtubeVideo,
            shippingInside,
            shippingOutside,
            metaTitle,
            metaDescription,
            tags: tagsArray,
            metaImage,
            suggestion: ["null", "undefined", null, undefined, ""].includes(suggestion)
                ? null
                : suggestion,
        };
        if (photoUrl) {
            updatedData.photo = photoUrl;
        }
        if (metaImageX) {
            updatedData.metaImage = metaImageX;
        }
        const updatedProduct = yield product_model_1.default.findByIdAndUpdate(productId, updatedData, { new: true });
        if (!updatedProduct) {
            res.status(404).json({ message: "Product not found" });
        }
        else {
            res.status(200).json(updatedProduct);
        }
    }
    catch (error) {
        console.log(error);
        console.error("Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.updateProduct = updateProduct;
const getProductDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Step 1: Find the product by slug
        const product = yield product_model_1.default.findOne({ slug: req.params.slug })
            .populate({
            path: "writer",
            model: "Writer",
            select: "title photo slug", // Include only the 'name' field of the brand
        })
            .populate({
            path: "suggestion",
            model: "Suggestion",
            populate: {
                path: "products",
                model: "Product",
                select: "title photo slug price  rating",
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
            select: "categoryName slug", // Include only the 'title' field of the category
        });
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        // const parentCategory = await Category.findById({
        //   // @ts-expect-error: Suppressing error for type mismatch in `_id`
        //   _id: product.category._id,
        // }).select("subCategories._id subCategories.slug subCategories.title");
        // const subCategory = parentCategory.subCategories.find((subCat) =>
        //   // @ts-expect-error: Suppressing error for type mismatch in `_id`
        //   subCat._id.equals(new mongoose.Types.ObjectId(product.subCategory))
        // );
        // Step 2: Fetch the suggestion data separately if it exists
        // let suggestionData = null;
        // if (product.suggestion) {
        //   suggestionData = await Suggestion.findOne({ _id: product.suggestion })
        //     .select("title products")
        //     .populate({
        //       path: "products",
        //       model: "Product",
        //       select: ["_id", "title", "price", "unprice", "photo", "slug"], // Only select the fields you need
        //     });
        // }
        const categoryProducts = yield product_model_1.default.aggregate([
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
                    price: 1,
                    rating: 1,
                    unprice: 1,
                    photo: 1,
                    slug: 1,
                    stockStatus: 1,
                },
            },
        ]);
        // Step 3: Respond with the product and suggestion data
        res.status(200).json(Object.assign(Object.assign({}, product.toObject()), { 
            // subCategory: subCategory || {},
            // suggestion: suggestionData,
            productsOfSameCategory: categoryProducts }));
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getProductDetails = getProductDetails;
// export const updateProductVariant = async (req: Request, res: Response) => {
//   try {
//     const productId = req.params.productId;
//     const { variantTitle, variantSectionsInfo } = req.body;
//     console.log(productId);
//     const parsedVariantSectionsInfo = JSON.parse(variantSectionsInfo);
//     const existingProduct = await Product.findById(productId);
//     if (!existingProduct) {
//       return res.status(404).json({ error: "Banner not found" });
//     }
//     const files = req.files as { [fieldname: string]: Express.Multer.File[] };
//     // Array to hold secure URLs of uploaded images, initialized with existing img values
//     let secureUrlArray: string[] = [];
//     if (
//       files &&
//       files.variantSectionsImage &&
//       files.variantSectionsImage.length > 0
//     ) {
//       // Upload images and collect secure URLs in the same order
//       await Promise.all(
//         files.variantSectionsImage.map(async (file, index) => {
//           try {
//             const result = await uploadToCloudinary(file.buffer);
//             // Assign secure_url to the correct index
//             secureUrlArray[index] = result.secure_url;
//           } catch (error) {
//             console.error("Error uploading image:", error);
//             throw new Error("Error uploading image");
//           }
//         })
//       );
//     }
//     // Update parsedBannersInfo by filling in empty img fields with URLs from secureUrlArray
//     let urlIndex = 0; // To track which collected URL to use
//     const Updated_Variant_info = parsedVariantSectionsInfo.map(
//       (variant: any) => {
//         // Check if the img is empty and we still have collected URLs left to use
//         if (variant.img === "" && urlIndex < secureUrlArray.length) {
//           // Replace the empty img with the next collected URL
//           variant.img = secureUrlArray[urlIndex];
//           urlIndex++; // Move to the next URL for the next empty img
//         }
//         return variant;
//       }
//     );
//     const updatedBanner = await Product.findByIdAndUpdate(
//       productId,
//       {
//         variantTitle,
//         variantSectionInfo: Updated_Variant_info,
//       },
//       { new: true }
//     );
//     if (!updatedBanner) {
//       return res.status(404).json({ error: "Banner not found" });
//     }
//     res.status(200).json(updatedBanner);
//   } catch (error: any) {
//     console.error("Error:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
// export const getPaginatedProducts = async (req: Request, res: Response) => {
//   try {
//     // Extract query parameters
//     const categoryId = req.query.categoryId as string;
//     const skip = parseInt(req.query.skip as string) || 0;
//     const limit = parseInt(req.query.limit as string) || 9;
//     // Build the query object
//     let query: any = {};
//     // Add category filter if categoryId is provided
//     if (categoryId) {
//       query.category = categoryId; // Assuming the category field in the Product model is named `category`
//     }
//     // Fetch products with filtering and pagination
//     const products = await Product.find(query).skip(skip).limit(limit);
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch products" });
//   }
// };
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield product_model_1.default.find()
            .select("_id photo title featured sele price")
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
        const product = yield product_model_1.default.findOne({ _id: req.params.productId })
            .populate("writer")
            .populate("category");
        res.status(200).json(product);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getSingleProduct = getSingleProduct;
const getAllProductsForAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield product_model_1.default.find()
            .select("_id photo title price slug")
            .populate("writer", "title");
        const products = result.reverse();
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getAllProductsForAdmin = getAllProductsForAdmin;
const getAllProductsForOfferPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield product_model_1.default.find()
            .select("_id photo title price slug subCategory ")
            .populate("writer", "title")
            .populate("category", "categoryName");
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
        const result = yield product_model_1.default.deleteOne({ _id: productId });
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
        const result = yield product_model_1.default.find({ writer })
            .select("_id photo title featured sele price slug")
            .populate("writer")
            .populate("category");
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
        const result = yield product_model_1.default.find({ writer: writerId })
            .select("_id photo title featured sele price slug")
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
        const products = yield product_model_1.default.find({
            category: categoryId,
            _id: { $ne: notIncludeProductId },
        })
            .populate("writer")
            .populate("category");
        // if (!products || products.length === 0) {
        //   res.status(404).json({ message: "No products found for this category" });
        //   return;
        // }
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
        const products = yield product_model_1.default.find({
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
            .select("_id categoryName slug photoUrl metaTitle metaDescription description shortDescription tags")
            .lean();
        const categoryId = category === null || category === void 0 ? void 0 : category._id;
        const products = yield product_model_1.default.find({
            category: categoryId,
        })
            .select("_id photo title featured sele price slug stockStatus")
            .populate({
            path: "writer",
            model: "Writer",
            select: "title  slug", // Include only the 'name' field of the brand
        })
            .populate({
            path: "category",
            model: "Category",
            select: "categoryName slug", // Include only the 'title' field of the category
        });
        const writers = yield writer_model_1.default.find().select("_id title slug photo").lean();
        const reverseProducts = products.reverse();
        res.status(200).json({ products: reverseProducts, writers, category });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getProductsByCategorySlug = getProductsByCategorySlug;
// export const getProductsBySubCategorySlug = async (
//   req: Request,
//   res: Response
// ) => {
//   const slug = req.params.slug; // make sure this is the correct param name
//   try {
//     // Find products where 'subCategory' matches the provided subCategoryId
//     const products = await Product.find({ slug })
//       .populate("writer") // populate writer details
//       .populate("category"); // populate category details
//     // Reverse the products array and send a successful response
//     res.status(200).json(products.reverse());
//   } catch (error: any) {
//     // Handle any errors and send a 500 response with the error message
//     res.status(500).json({ error: error.message });
//   }
// };
// export const getProductsBySubCategory2 = async (
//   req: Request,
//   res: Response
// ) => {
//   const subCategoryId = req.params.subcategoryId; // make sure this is the correct param name
//   try {
//     // Find products where 'subCategory' matches the provided subCategoryId
//     const products = await Product.find({ subCategory: subCategoryId })
//       .populate("writer") // populate writer details
//       .populate("category"); // populate category details
//     // Reverse the products array and send a successful response
//     res.status(200).json(products.reverse());
//   } catch (error: any) {
//     // Handle any errors and send a 500 response with the error message
//     res.status(500).json({ error: error.message });
//   }
// };
// export const getTwoProductsByIds = async (req: Request, res: Response) => {
//   const { id1, id2 } = req.params;
//   try {
//     const collectedProducts = await Product.find({ _id: { $in: [id1, id2] } })
//       .populate("category", "categoryName")
//       .select("_id title photo infoSectionsData price ")
//       .lean();
//     if (!collectedProducts || collectedProducts.length !== 2) {
//       res.status(404).json({ message: "One or both Product not found" });
//       return;
//     }
//     // Ensure id1 is the first element and id2 is the second
//     const products = collectedProducts.sort((a, b) => {
//       if (a._id.toString() === id1) return -1;
//       if (b._id.toString() === id1) return 1;
//       return 0;
//     });
//     res.status(200).json(products);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };
// export const searchProducts = async (req: Request, res: Response) => {
//   const { title, categoryId } = req.query;
//   if (!title) {
//     return res.status(400).json({ error: "Title query parameter is required" });
//   }
//   try {
//     const query: any = {
//       title: { $regex: new RegExp(title as string, "i") },
//     };
//     if (categoryId) {
//       query.category = categoryId;
//     }
//     const products = await Product.find(query)
//       .select("_id title photo infoSectionsData price ") // Specify the fields you want to retrieve
//       .lean();
//     res.status(200).json(products);
//   } catch (error) {
//     console.error("Error searching for products:", error);
//     res.status(500).json({ error: "Failed to search for products" });
//   }
// };
// export const getProductsByTitle = async (req: Request, res: Response) => {
//   const title = req.query.title as string;
//   if (!title) {
//     res.status(400).json({ error: "Title query parameter is required" });
//     return;
//   }
//   const products = await Product.find({
//     title: { $regex: new RegExp(title, "i") },
//   })
//     .select("_id title photo price stockStatus")
//     .populate("category")
//     .limit(15);
//   res.status(200).json(products);
// };
// export const getAllProductIds = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const productIds = await Product.find().select("_id").lean();
//     // Extract the _id field from each product and return an array of IDs
//     const ids = productIds.map((product) => product._id);
//     res.status(200).json(ids);
//   } catch (error: any) {
//     res.status(500).json({ error: "Failed to retrieve product IDs" });
//   }
// };
