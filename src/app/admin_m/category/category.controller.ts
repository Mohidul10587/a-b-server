import { Request, Response } from "express";
import Category from "./category.model";
import Product from "../../product/product.model";
import { cloudinaryUpload } from "../../shared/uploadSingleFileToCloudinary";

export const createCategory = async (req: Request, res: Response) => {
  console.log("first");
  try {
    const {
      categoryName,
      slug,
      description,
      display,
      displayPositionOfHomePage,
      subCategories,
      metaTitle,
      metaDescription,
      tags,
      position,
    } = req.body;
    console.log(req.body);
    // Create and save the new category
    const newCategory = new Category({
      categoryName,
      slug,
      description,

      photoUrl: "/default.jpg",
      subCategories,
      metaTitle,
      metaDescription,
      tags: ["sd"],
      metaImage: "/default.jpg",
      position: 0,
    });

    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};
export const getAllCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Fetch all categories
    const previousCategories = await Category.find();

    // Fetch products and count products per category
    const primaryCategories = await Promise.all(
      previousCategories.map(async (category) => {
        const productCount = await Product.countDocuments({
          category: category._id,
        });
        return {
          ...category.toJSON(),
          categoryProducts: productCount,
        };
      })
    );
    const categories = primaryCategories.sort(
      (a, b) => a.position - b.position
    );
    res.status(200).json({ categories });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
// Add this function  to your existing controller file
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findByIdAndDelete(categoryId);

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const {
      categoryName,
      slug,
      description,

      infoSections,
      metaTitle,
      metaDescription,
      tags,
      position,
    } = req.body;
    console.log("This is slug", position);
    const categoryId = req.params.id;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const photoFile = files?.photo?.[0];
    const newMetaImageFile = files?.metaImage?.[0];

    // Upload metaImage if provided
    const photoUrl = await cloudinaryUpload(photoFile);
    const newMetaImage = await cloudinaryUpload(newMetaImageFile);
    const tagsArray = tags.split(",").map((tag: string) => tag.trim());

    // Update the category with new values
    category.categoryName = categoryName;
    category.slug = slug;

    category.description = description;

    category.subCategories;
    category.metaTitle = metaTitle;
    category.metaDescription = metaDescription;
    category.tags = tagsArray;
    // category.position = parseInt(position);
    category.position = 0;

    if (photoUrl) {
      category.photoUrl = photoUrl;
    }
    if (newMetaImage) {
      category.metaImage = newMetaImage;
    }

    // Fetch all products by category ID
    const products = await Product.find({ category: category._id });

    // Merge info sections and update products individually

    const updatedCategory = await category.save(); // Ensure the updated category is saved
    res.status(200).json(updatedCategory); // Return the updated category
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
