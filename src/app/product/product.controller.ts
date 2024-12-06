import { Request, Response } from "express";
import Product from "./product.model";
import { cloudinaryUpload } from "../shared/uploadSingleFileToCloudinary";

// import cloudinary from "../shared/cloudinary.config";

// import {
//   CloudinaryUploadResult,
//   uploadToCloudinary,
// } from "../shared/uploadToCloudinary";

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    title,
    slug,
    description,
    shortDescription,
    category,
    subCategory,
    price,
    unprice,
    stockStatus,
    writer,
    youtubeVideo,
    shippingInside,
    shippingOutside,
    metaTitle,
    metaDescription,
    tags,
    publisher,
    summary,
    numberOfPage,
    ISBN,
    edition,
    binding,
    productType,
    translatorName,
    language,
    orderType,
    titleEnglish,
    subTitle,
  } = req.body;

  const files = req.files as {
    photo?: Express.Multer.File[];
    metaImage?: Express.Multer.File[];
    attachedFiles?: Express.Multer.File[];
  };

  try {
    const photoFile = files?.photo?.[0];
    const metaImageFile = files?.metaImage?.[0];

    const photoUrl = await cloudinaryUpload(photoFile);
    const metaImage = await cloudinaryUpload(metaImageFile);

    const tagsArray = tags.split(",").map((tag: string) => tag.trim());

    const newProduct = await Product.create({
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
    });
    res.status(201).json(newProduct);
  } catch (error: any) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
};

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const productId = req.params.productId;
    const {
      title,
      slug,
      description,
      shortDescription,
      category,
      subCategory,

      price,
      unprice,
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
      tags,
      metaImage,
    } = req.body;

    const files = req.files as {
      photo?: Express.Multer.File[];
      metaImage?: Express.Multer.File[];
      attachedFiles?: Express.Multer.File[];
    };

    const photoFile = files?.photo?.[0];
    const metaImageFile = files?.metaImage?.[0];

    const photoUrl = await cloudinaryUpload(photoFile);
    const metaImageX = await cloudinaryUpload(metaImageFile);

    const tagsArray = tags.split(",").map((tag: string) => tag.trim());

    const updatedData: any = {
      title,
      slug,
      description,
      shortDescription,
      price,
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
    };

    if (photoUrl) {
      updatedData.photo = photoUrl;
    }
    if (metaImageX) {
      updatedData.metaImage = metaImageX;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updatedData,
      { new: true }
    );

    if (!updatedProduct) {
      res.status(404).json({ message: "Product not found" });
    } else {
      res.status(200).json(updatedProduct);
    }
  } catch (error: any) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

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

export const getAllProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await Product.find()
      .select("_id photo title featured sele price")
      .populate("writer")
      .populate("category");
    const products = result.reverse();

    res.status(200).json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getSingleProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const product = await Product.findOne({ _id: req.params.productId })

      .populate("writer")
      .populate("category");

    res.status(200).json(product);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllProductsForAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await Product.find().select("_id photo title ");

    const products = result.reverse();

    res.status(200).json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllProductsForOfferPage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await Product.find()
      .select("_id photo title price subCategory ")
      .populate("writer", "title")
      .populate("category", "categoryName");
    const products = result.reverse();

    res.status(200).json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const productId = req.params.productId;
  try {
    const result = await Product.deleteOne({ _id: productId });
    res.status(200).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

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
