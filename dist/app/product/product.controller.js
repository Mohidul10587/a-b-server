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
exports.deleteProduct = exports.getAllProductsForAdmin = exports.getAllProducts = exports.createProduct = void 0;
const product_model_1 = __importDefault(require("./product.model"));
const uploadSingleFileToCloudinary_1 = require("../shared/uploadSingleFileToCloudinary");
// import cloudinary from "../shared/cloudinary.config";
// import {
//   CloudinaryUploadResult,
//   uploadToCloudinary,
// } from "../shared/uploadToCloudinary";
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { title, slug, description, shortDescription, category, subCategory, price, unprice, stockStatus, writer, youtubeVideo, shippingInside, shippingOutside, metaTitle, metaDescription, tags, publisher, summary, numberOfPage, ISBN, edition, binding, productType, translatorName, language, orderType, titleEnglish, subTitle, } = req.body;
    const files = req.files;
    try {
        const photoFile = (_a = files === null || files === void 0 ? void 0 : files.photo) === null || _a === void 0 ? void 0 : _a[0];
        const metaImageFile = (_b = files === null || files === void 0 ? void 0 : files.metaImage) === null || _b === void 0 ? void 0 : _b[0];
        const attachedFiles = (files === null || files === void 0 ? void 0 : files.attachedFiles) || [];
        const photoUrl = yield (0, uploadSingleFileToCloudinary_1.cloudinaryUpload)(photoFile);
        const metaImage = yield (0, uploadSingleFileToCloudinary_1.cloudinaryUpload)(metaImageFile);
        const attachedFilesUrls = [];
        // for (const file of attachedFiles) {
        //   const result = await new Promise<CloudinaryUploadResult>(
        //     (resolve, reject) => {
        //       cloudinary.uploader
        //         .upload_stream({ resource_type: "image" }, (error, result) => {
        //           if (error) reject(error);
        //           else resolve(result as CloudinaryUploadResult);
        //         })
        //         .end(file.buffer);
        //     }
        //   );
        //   attachedFilesUrls.push(result.secure_url);
        // }
        const tagsArray = tags.split(",").map((tag) => tag.trim());
        const newProduct = yield product_model_1.default.create({
            title,
            slug: JSON.stringify(Math.random()),
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
            publisher: "67444ff54a37388ed8edafe5",
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
            attachedFiles: attachedFilesUrls,
        });
        res.status(201).json(newProduct);
    }
    catch (error) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
});
exports.createProduct = createProduct;
// export const updateProduct = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const productId = req.params.productId;
//     const {
//       title,
//       slug,
//       description,
//       shortDescription,
//       category,
//       subCategory,
//       infoSectionsData,
//       price,
//       unprice,
//       stockStatus,
//       writer,
//       photo,
//       featured,
//       sele,
//       condition,
//       warranty,
//       youtubeVideo,
//       shippingInside,
//       shippingOutside,
//       metaTitle,
//       metaDescription,
//       tags,
//       metaImage,
//     } = req.body;
//     let existingImagesArray = JSON.parse(req.body.attachedFiles);
//     const files = req.files as {
//       photo?: Express.Multer.File[];
//       metaImage?: Express.Multer.File[];
//       attachedFiles?: Express.Multer.File[];
//     };
//     const photoFile = files?.photo?.[0];
//     // Upload photo if     provided
//     let photoUrl = "";
//     if (photoFile) {
//       const result = await new Promise<CloudinaryUploadResult>(
//         (resolve, reject) => {
//           cloudinary.uploader
//             .upload_stream({ resource_type: "image" }, (error, result) => {
//               if (error) reject(error);
//               else resolve(result as CloudinaryUploadResult);
//             })
//             .end(photoFile.buffer);
//         }
//       );
//       photoUrl = result.secure_url;
//     }
//     const newMetaImageFile = files?.metaImage?.[0];
//     // Upload metaImage if provided
//     let newMetaImage = "";
//     if (newMetaImageFile) {
//       const result = await new Promise<CloudinaryUploadResult>(
//         (resolve, reject) => {
//           cloudinary.uploader
//             .upload_stream({ resource_type: "image" }, (error, result) => {
//               if (error) reject(error);
//               else resolve(result as CloudinaryUploadResult);
//             })
//             .end(newMetaImageFile.buffer);
//         }
//       );
//       newMetaImage = result.secure_url;
//     }
//     let secureUrlArray: string[] = [];
//     // Upload new attached files and get their URLs
//     if (files && files.attachedFiles && files.attachedFiles.length > 0) {
//       // Upload images and collect secure URLs in the same order
//       await Promise.all(
//         files.attachedFiles.map(async (file) => {
//           try {
//             const result = await uploadToCloudinary(file.buffer);
//             secureUrlArray.push(result.secure_url);
//           } catch (error) {
//             console.error("Error uploading image:", error);
//             throw new Error("Error uploading image");
//           }
//         })
//       );
//       // Update the existingImagesArray array with the secure URLs
//       let urlIndex = 0;
//       for (let i = 0; i < existingImagesArray.length; i++) {
//         if (existingImagesArray[i] === "" && urlIndex < secureUrlArray.length) {
//           existingImagesArray[i] = secureUrlArray[urlIndex];
//           urlIndex++;
//         }
//       }
//       // If there are more URLs than empty slots, append the remaining URLs
//       if (urlIndex < secureUrlArray.length) {
//         existingImagesArray = existingImagesArray.concat(
//           secureUrlArray.slice(urlIndex)
//         );
//       }
//     }
//     const tagsArray = tags.split(",").map((tag: string) => tag.trim());
//     const updatedData: any = {
//       title,
//       slug,
//       description,
//       shortDescription,
//       price,
//       unprice,
//       category,
//       subCategory,
//       infoSectionsData: JSON.parse(infoSectionsData),
//       stockStatus,
//       writer,
//       photo,
//       featured,
//       sele,
//       condition,
//       warranty,
//       youtubeVideo,
//       shippingInside,
//       shippingOutside,
//       attachedFiles: existingImagesArray, // Ensure the attachedFiles field is updated
//       metaTitle,
//       metaDescription,
//       tags: tagsArray,
//       metaImage,
//     };
//     if (photoUrl) {
//       updatedData.photo = photoUrl;
//     }
//     if (newMetaImage) {
//       updatedData.metaImage = newMetaImage;
//     }
//     const updatedProduct = await Product.findByIdAndUpdate(
//       productId,
//       updatedData,
//       { new: true }
//     );
//     if (!updatedProduct) {
//       res.status(404).json({ message: "Product not found" });
//     } else {
//       res.status(200).json(updatedProduct);
//     }
//   } catch (error: any) {
//     console.error("Error:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };
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
const getAllProductsForAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield product_model_1.default.find().select("_id photo title ");
        const products = result.reverse();
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getAllProductsForAdmin = getAllProductsForAdmin;
// export const getLastUploadedProducts = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const result = await Product.find()
//       .select("_id photo title featured sele price stockStatus")
//       .populate("writer")
//       .populate("category")
//       .sort({ _id: -1 })
//       .limit(10);
//     const products = result;
//     res.status(200).json(products);
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// };
// export const getAllProductsForHomePage = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const result = await Product.find()
//       .select("_id photo title featured sale price stockStatus")
//       .populate({
//         path: "category",
//         match: { display: true },
//         select: "categoryName display displayPositionOfHomePage _id", // Include category ID
//       })
//       .exec();
//     // Filter out products with no category (in case match fails)
//     const filteredProducts = result.filter(
//       (product) => product.category !== null
//     );
//     // Group products by category
//     const groupedByCategory = filteredProducts.reduce<
//       {
//         categoryName: string;
//         categoryId: string; // Include category ID
//         position: number;
//         products: typeof filteredProducts;
//       }[]
//     >((acc, product) => {
//       // Type assertions to help TypeScript understand the populated data structure
//       const categoryName = (product.category as any).categoryName;
//       const position = (product.category as any).displayPositionOfHomePage;
//       const categoryId = (product.category as any)._id.toString(); // Get category ID as string
//       // Find the existing category in the accumulator
//       const existingCategory = acc.find(
//         (item) => item.categoryId === categoryId
//       );
//       if (existingCategory) {
//         // If category exists, add the product to the category's products array
//         existingCategory.products.push(product);
//       } else {
//         // If category does not exist, create a new category object
//         acc.push({
//           categoryName,
//           categoryId, // Include category ID
//           position,
//           products: [product],
//         });
//       }
//       return acc;
//     }, []);
//     // Limit products per category to 10 and reverse the products array
//     const resultWithLimitedProducts = groupedByCategory.map((category) => {
//       const totalProducts = category.products.length;
//       const lastTenProducts = category.products
//         .slice(Math.max(totalProducts - 10, 0)) // Get the last 10 products
//         .reverse(); // Reverse the products array
//       return {
//         ...category,
//         products: lastTenProducts,
//       };
//     });
//     // Sort the grouped categories by position
//     resultWithLimitedProducts.sort((a, b) => a.position - b.position);
//     res.status(200).json(resultWithLimitedProducts);
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// };
// export const getProductDetails = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const slug = req.params.slug;
//   console.log(slug);
//   try {
//     const product = await Product.findOne({ slug: slug })
//       .populate("writer")
//       .populate("category");
//     if (!product) {
//       res.status(404).json({ message: "Product not found" });
//       return;
//     }
//     console.log(product);
//     res.status(200).json(product);
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// };
// export const getSingleProduct = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const productId = req.params.productId;
//   try {
//     const product = await Product.findById(productId)
//       .populate("writer")
//       .populate("category");
//     if (!product) {
//       res.status(404).json({ message: "Product not found" });
//       return;
//     }
//     res.status(200).json(product);
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// };
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
// export const getProductsByWriterSlug = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const slug = req.params.slug;
//   try {
//     const result = await Product.find({ slug })
//       .select("_id photo title featured sele price slug")
//       .populate("writer")
//       .populate("category");
//     const products = result.reverse();
//     res.status(200).json(products);
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// };
// export const getProductsByWriter = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const writerId = req.params.writerId;
//   try {
//     const result = await Product.find({ writer: writerId })
//       .select("_id photo title featured sele price slug")
//       .populate("writer")
//       .populate("category");
//     const products = result.reverse();
//     res.status(200).json(products);
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// };
// export const getProductsByCategory = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const categoryId = req.params.categoryId;
//   const notIncludeProductId = req.params.notIncludeProductId;
//   try {
//     const products = await Product.find({
//       category: categoryId,
//       _id: { $ne: notIncludeProductId },
//     })
//       .populate("writer")
//       .populate("category");
//     // if (!products || products.length === 0) {
//     //   res.status(404).json({ message: "No products found for this category" });
//     //   return;
//     // }
//     res.status(200).json(products);
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// };
// export const getProductsByCategory2 = async (req: Request, res: Response) => {
//   const categoryId = req.params.categoryId;
//   try {
//     const products = await Product.find({
//       category: categoryId,
//     })
//       .populate("writer")
//       .populate("category");
//     res.status(200).json(products.reverse());
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// };
// export const getProductsByCategorySlug = async (
//   req: Request,
//   res: Response
// ) => {
//   const slug = req.params.slug;
//   try {
//     const products = await Product.find({
//       slug: slug,
//     })
//       .populate("writer")
//       .populate("category");
//     res.status(200).json(products.reverse());
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// };
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
