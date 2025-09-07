import { Request, Response } from "express";
import Product from "./model";
import Writer from "../writer/writer.model";
import Category from "../category/category.model";
import Publisher from "../publishers/publishers.model";
import { generateSlug } from "../shared/generateSLug";
import User from "../user/user.model";

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body;

    const item = await Product.create({
      ...data,
      slug: generateSlug(data.title),
    });

    // Send success message along with the created product data
    res.status(201).json({
      message: "Created successfully!",
      item, // Optionally, include the created product in the response
    });
  } catch (error: any) {
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
      "title sellingPrice img slug display seller"
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
        "_id title slug img metaTitle metaDescription description shortDescription keywords "
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
      "_id img title featured sele sellingPrice slug stockStatus writer publisher seller subcategory language"
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
    const { mainId } = req.query;

    const product = await Product.findOne({ _id: mainId });

    res.status(200).json({
      message: "Fetched successfully!",
      respondedData: product?.existingQnt, // Optionally, include the created category in the response
    });
    return;
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to Fetch.",
      error: error.message,
    });
  }
};
// Update the status  by ID
export const updateStatus = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { display } = req.body;

  try {
    const updateProduct = await Product.findByIdAndUpdate(
      id,
      { display }, // Ensure 'status' is the correct field
      { new: true } // Return the updated document
    );

    if (!updateProduct) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User status updated successfully",
      data: updateProduct,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error updating User status",
      error: error.message,
    });
  }
};
// Get all data with pagination and filtering
export const allForIndexPage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const searchText = req.query.search as string;
    const displayFilter = req.query.display as string; // e.g., 'true' or 'false'

    const skip = (page - 1) * limit;

    let query: any = {};
    let displayTrueQuery: any = { display: true };
    let displayFalseQuery: any = { display: false };

    if (searchText) {
      query.$or = [
        { title: { $regex: searchText, $options: "i" } },
        { SKU: { $regex: searchText, $options: "i" } },
      ];
    }

    if (displayFilter === "true") {
      query.display = true;
    } else if (displayFilter === "false") {
      query.display = false;
    }

    if (req.user?.role === "seller") {
      query.seller = req.user._id;
      displayTrueQuery.seller = req.user._id;
      displayFalseQuery.seller = req.user._id;
    }

    const [items, totalCount, totalActiveCount, totalInactiveCount] =
      await Promise.all([
        Product.find(query)
          .select(
            "title SKU sellingPrice img slug  display display_2   seller "
          )

          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Product.countDocuments(query),
        Product.countDocuments(displayTrueQuery),
        Product.countDocuments(displayFalseQuery),
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
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to fetch.",
      error: error.message,
    });
  }
};

export const getFilteredProducts = async (req: Request, res: Response) => {
  try {
    const {
      page = "1",
      limit = "10",
      search = "",
      sellers = "",
      categories = "",
      minRating,
      lang = "all",
      orderType = "all",
    } = req.query;
    console.log("THis is order type", orderType);
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const sellerSlugs = (sellers as string)?.split("--").filter(Boolean) || [];
    const categorySlugs =
      (categories as string)?.split("--").filter(Boolean) || [];
    const minRatingNum = minRating
      ? parseFloat(minRating as string)
      : undefined;
    const language = lang as string;

    const filter: any = {};

    // Search by product title
    if (search) {
      const regex = new RegExp(search as string, "i");
      filter.$or = [{ title: regex }, { titleBn: regex }];
    }

    // Filter by seller slugs
    if (sellerSlugs.length > 0) {
      const matchingSellers = await User.find(
        { slug: { $in: sellerSlugs }, role: "seller" },
        "_id"
      );
      const sellerIds = matchingSellers.map((s) => s._id);
      filter.seller = { $in: sellerIds };
    }

    // ✅ Correct: Filter by category slugs
    if (categorySlugs.length > 0) {
      const matchingCategories = await Category.find(
        { slug: { $in: categorySlugs } },
        "_id"
      );
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
    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limitNum);

    // Fetch paginated products
    const products = await Product.find(filter)
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
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
