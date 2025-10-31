import { Request, Response } from "express";
import Product from "./model";
import Category from "../category/category.model";
import Subcategory from "../subcategory/subcategory.model";
import mongoose from "mongoose";

export const filter = async (req: Request, res: Response) => {
  try {
    const {
      categories = "",
      subcategories = "",

      page = 1,
      limit = 9,
    } = req.query as any;

    const filter: any = {};

    const parseIds = (str: string | string[]) =>
      (Array.isArray(str) ? str[0] : str)?.split("--").filter(Boolean) || [];
    // Convert to ObjectId arrays (safe)
    const categoryIds = parseIds(categories as string).map(
      (id) => new mongoose.Types.ObjectId(id)
    );
    const subcategoryIds = parseIds(subcategories as string).map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    if (categoryIds.length) filter.category = { $in: categoryIds };
    if (subcategoryIds.length) filter.subcategory = { $in: subcategoryIds };

    const skip = (Number(page) - 1) * Number(limit);

    // --- Aggregation filters ---
    const categoryCountFilter = { ...filter };
    delete categoryCountFilter.category;
    delete categoryCountFilter.subcategory;

    const subcategoryCountFilter = { ...filter };
    delete subcategoryCountFilter.subcategory;

    // --- Fetch products, counts, categories & subcategories ---
    const [
      products,
      totalCount,
      categoryCounts,
      subcategoryCounts,
      allCategories,
      allSubcategories,
    ] = await Promise.all([
      Product.find(filter)
        .skip(skip)
        .limit(Number(limit))
        .populate([
          { path: "category", select: "title slug img" },
          { path: "subcategory", select: "title slug parentCategory" },
        ])
        .select("title slug img sellingPrice regularPrice"),

      Product.countDocuments(filter),

      Product.aggregate([
        { $match: categoryCountFilter },
        { $group: { _id: "$category", count: { $sum: 1 } } },
      ]),

      Product.aggregate([
        { $match: subcategoryCountFilter },
        { $group: { _id: "$subcategory", count: { $sum: 1 } } },
      ]),

      Category.find().select("title slug img"),

      categoryIds.length
        ? Subcategory.find({ parentCategory: { $in: categoryIds } })
            .select("title slug parentCategory")
            .lean()
        : Promise.resolve([]),
    ]);

    const totalPages = Math.ceil(totalCount / Number(limit));

    // --- Prepare valid categories with counts and selected flags ---
    const validCategories = allCategories
      .map((cat) => {
        const found = categoryCounts.find(
          (c) => String(c._id) === String(cat._id)
        );
        if (!found) return null;
        return {
          ...cat.toObject(),
          count: found.count,
          selected: categories.includes(
            new mongoose.Types.ObjectId(cat._id as string)
          ),
        };
      })
      .filter(Boolean);

    // --- Prepare valid subcategories with counts and selected flags ---
    const validSubcategories = allSubcategories
      .map((sub) => {
        const found = subcategoryCounts.find(
          (c) => String(c._id) === String(sub._id)
        );
        if (!found) return null;
        return {
          ...sub,
          count: found.count,
          selected: subcategoryIds.includes(
            new mongoose.Types.ObjectId(sub._id as string)
          ),
        };
      })
      .filter(Boolean);

    res.status(200).json({
      products,
      totalPages,
      currentPage: Number(page),
      categories: validCategories,
      subcategories: validSubcategories,
    });
  } catch (error) {
    console.error("Filter Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
