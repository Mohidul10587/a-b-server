import { Request, Response } from "express";
import Product from "./product.model";
import { cloudinaryUpload } from "../shared/uploadSingleFileToCloudinary";
import Writer from "../admin_m/writer/writer.model";
import Category from "../admin_m/category/category.model";
import Publisher from "../admin_m/publishers/publishers.model";
import { generateSlug } from "../shared/generateSLug";

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body;
    const newProduct = await Product.create({
      ...data,
      slug: generateSlug(data.title),
    });

    // Send success message along with the created product data
    res.status(201).json({
      message: "Created successfully!",
      respondedData: newProduct, // Optionally, include the created product in the response
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

    const updatedItem = await Product.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Run validation on the updated data
    });

    if (!updatedItem) {
      return res.status(404).json({
        message: "Not found.",
      });
    }

    res.status(200).json({
      message: "Updated successfully!",
      respondedData: updatedItem,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Failed to update.",
      error: error,
    });
  }
};
export const getProductDetails = async (
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
          select: "title img slug price  rating",
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
          price: 1,
          rating: 1,
          unprice: 1,
          img: 1,
          slug: 1,
          stockStatus: 1,
        },
      },
    ]);

    // Step 3: Respond with the product and suggestion data
    res.status(200).json({
      ...product.toObject(),
      // subcategory: subcategory || {},
      // suggestion: suggestionData,
      productsOfSameCategory: categoryProducts,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await Product.find()
      .select("_id img title featured sele price")
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
    const result = await Product.find()
      .select("_id img title price slug")
      .populate("writer", "title");

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
      .select("_id img title price slug subcategory ")
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
    const result = await Product.find({ writer })
      .select("_id img title featured sele price slug category")
      .populate("writer");

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
      .select("_id img title featured sele price slug")
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
        "_id title slug imgUrl metaTitle metaDescription description shortDescription tags"
      )
      .lean();

    const categoryId = category?._id;
    const products = await Product.find({
      category: categoryId,
    })
      .select("_id img title featured sele price slug stockStatus")
      .populate({
        path: "writer",
        model: "Writer",
        select: "title  slug", // Include only the 'name' field of the brand
      })
      .populate({
        path: "category",
        model: "Category",
        select: "title slug", // Include only the 'title' field of the category
      });
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
        "_id title slug imgUrl keywords metaTitle metaDescription description shortDescription tags"
      )
      .lean();

    const publisherId = publisher?._id;
    const products = await Product.find({
      publisher: publisherId,
    })
      .select("_id img title featured sele price slug stockStatus")
      .populate({
        path: "writer",
        model: "Writer",
        select: "title  slug", // Include only the 'name' field of the brand
      })
      .populate({
        path: "publisher",
        model: "Publisher",
        select: "title slug img", // Include only the 'title' field of the category
      });
    const writers = await Writer.find().select("_id title slug img").lean();

    const reverseProducts = products.reverse();

    res.status(200).json({ products: reverseProducts, writers, publisher });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
