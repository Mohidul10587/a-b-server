import { Request, Response } from "express";
import Product from "./model";
import Writer from "../writer/writer.model";
import Category from "../category/category.model";
import Publisher from "../publishers/publishers.model";
import { generateSlug } from "../shared/generateSLug";

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body;
    const item = await Product.create({
      ...data,
      slug: generateSlug(data.titleEn),
    });

    // Send success message along with the created product data
    res.status(201).json({
      message: "Created successfully!",
      item, // Optionally, include the created product in the response
    });
  } catch (error: any) {
    console.log(error);
    // Send error message if there was an issue
    res.status(500).json({
      message: "Failed to create.",
      error: error.message,
    });
  }
};
// Update
export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log("This is id from update", req.params.id);
    const item = await Product.findByIdAndUpdate(id, req.body, {
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
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      message: "Failed to update.",
      error: error,
    });
  }
};
export const singleForUserFoDetailsPageBySlug = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Step 1: Find the product by slug
    const product = await Product.findOne({ slug: req.params.slug })
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

    const categoryProducts = await Product.aggregate([
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
      resData: {
        ...product.toObject(),
        productsOfSameCategory: categoryProducts,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
export const singleForEditPage = async (req: Request, res: Response) => {
  try {
    const item = await Product.findOne({ _id: req.params.id });
    res.status(200).json({ message: "Product fetched successfully!", item });
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch Product.", error: error.message });
  }
};

export const getAllProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await Product.find()
      .select("_id img title featured  sellingPrice")
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

export const allForAdminIndexPage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await Product.find()
      .select("_id img titleEn sellingPrice slug")
      .populate("writer", "title");

    const products = result.reverse();

    res.status(200).json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
// Get all data with optional filtering
export const getAllForSeriesAddPage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { category, subcategory } = req.query;

    // Build filter dynamically
    const filter: any = {
      display: true,
    };

    if (category) filter.category = category;
    if (subcategory) filter.subcategory = subcategory;

    if (req.user?.role === "seller") {
      filter.seller = req.user._id;
    }

    const items = await Product.find(filter).select(
      "titleEn sellingPrice img slug display seller"
    );

    res.status(200).json({
      message: "Fetched successfully!",
      resData: items.reverse(),
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch.",
      error: error.message,
    });
  }
};
export const getAllProductsForOfferPage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await Product.find()
      .select("_id img title sellingPrice slug subcategory ")
      .populate("writer", "title")
      .populate("category", "title");
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

export const getProductsByWriterSlug = async (
  req: Request,
  res: Response
): Promise<void> => {
  const slug = req.params.slug;

  try {
    const writer = await Writer.find({ slug });
    const result = await Product.find({ writer }).select(
      "_id img title featured  sellingPrice slug category subcategory publisher language"
    );

    const products = result.reverse();
    res.status(200).json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductsByWriter = async (
  req: Request,
  res: Response
): Promise<void> => {
  const writerId = req.params.writerId;

  try {
    const result = await Product.find({ writer: writerId })
      .select("_id img title featured  sellingPrice slug")
      .populate("writer")
      .populate("category");
    const products = result.reverse();
    res.status(200).json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductsByCategory = async (
  req: Request,
  res: Response
): Promise<void> => {
  const categoryId = req.params.categoryId;
  const notIncludeProductId = req.params.notIncludeProductId;

  try {
    const products = await Product.find({
      category: categoryId,
      _id: { $ne: notIncludeProductId },
    })
      .populate("writer")
      .populate("category");

    res.status(200).json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductsByCategory2 = async (req: Request, res: Response) => {
  const categoryId = req.params.categoryId;

  try {
    const products = await Product.find({
      category: categoryId,
    })
      .populate("writer")
      .populate("category");

    res.status(200).json(products.reverse());
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductsByCategorySlug = async (
  req: Request,
  res: Response
) => {
  const slug = req.params.slug;

  try {
    const category = await Category.findOne({ slug: slug })
      .select(
        "_id title slug img metaTitle metaDescription description shortDescription keywords"
      )
      .populate({
        path: "subcategories",
        select: "title",
      })
      .lean();

    const categoryId = category?._id;
    const products = await Product.find({
      category: categoryId,
    }).select(
      "_id img title featured sele sellingPrice slug stockStatus writer publisher  subcategory language"
    );

    const writers = await Writer.find().select("_id title slug img").lean();

    const reverseProducts = products.reverse();

    res.status(200).json({ products: reverseProducts, writers, category });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getProductsByPublishersSlug = async (
  req: Request,
  res: Response
) => {
  const slug = req.params.slug;

  try {
    const publisher = await Publisher.findOne({ slug: slug })
      .select(
        "_id title slug imgUrl keywords metaTitle metaDescription description shortDescription keywords "
      )
      .lean();

    const publisherId = publisher?._id;
    const products = await Product.find({
      publisher: publisherId,
    }).select(
      "_id img title category subcategory writer  featured  sellingPrice slug stockStatus language "
    );

    const writers = await Writer.find().select("title").lean();
    const categories = await Category.find()
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
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getExistingQuantity = async (req: Request, res: Response) => {
  try {
    const { type, mainId, variantId } = req.query;

    if (type == "main") {
      const product = await Product.findOne({ _id: mainId });

      res.status(200).json({
        message: "Fetched successfully!",
        respondedData: product?.existingQnt, // Optionally, include the created category in the response
      });
      return;
    }
    // if (type == "variant") {
    //   const product = await Product.findOne(
    //     {
    //       _id: mainId,
    //       "variantSectionInfo._id": variantId,
    //     },
    //     { "variantSectionInfo.$": 1 } // Returns only the matching variant section
    //   );

    //   res.status(200).json({
    //     message: "Fetched successfully!",
    //     respondedData: product?.variantSectionInfo[0].variantExistingQnt, // Optionally, include the created category in the response
    //   });
    //   return;
    // }
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to Fetch.",
      error: error.message,
    });
  }
};
//new
