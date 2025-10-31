import { Request, Response } from "express";
import Product from "./model";
import Category from "../category/category.model";
import Subcategory from "../subcategory/subcategory.model";
import mongoose from "mongoose";
import Writer from "../writer/writer.model";
import User from "../user/user.model";

export const filter = async (req: Request, res: Response) => {
  try {
    const {
      categories = "",
      subcategories = "",
      writers = "",
      sellers = "",

      page = 1,
      limit = 9,
    } = req.query as any;

    let filter: any = {};

    const parseIds = (str: string | string[]) =>
      (Array.isArray(str) ? str[0] : str)?.split("--").filter(Boolean) || [];
    // Convert to ObjectId arrays (safe)
    const categoryIds = parseIds(categories as string).map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    const subcategoryIds = parseIds(subcategories as string).map(
      (id) => new mongoose.Types.ObjectId(id)
    );
    const sellersIds = parseIds(sellers as string).map(
      (id) => new mongoose.Types.ObjectId(id)
    );
    const writersIds = parseIds(writers as string).map(
      (id) => new mongoose.Types.ObjectId(id)
    );
    if (categoryIds.length) filter.category = { $in: categoryIds };
    if (sellersIds.length) filter.seller = { $in: sellersIds };
    if (writersIds.length) filter.writer = { $in: writersIds };
    if (subcategoryIds.length) filter.subcategory = { $in: subcategoryIds };
    // ✅ Build dynamic filter

    if (subcategoryIds.length > 0) {
      // Find categories of selected subcategories
      const subs = await Subcategory.find({
        _id: { $in: subcategoryIds },
      }).select("parentCategory");

      const categoriesWithSub = new Set(
        subs.map((s) => String(s.parentCategory))
      );

      const categoriesWithoutSub = categoryIds.filter(
        (id) => !categoriesWithSub.has(String(id))
      );

      const orFilters: any[] = [];

      // ✅ only subcategory based data for matched categories
      orFilters.push({
        subcategory: { $in: subcategoryIds },
        ...(sellersIds.length && { seller: { $in: sellersIds } }),
        ...(writersIds.length && { writer: { $in: writersIds } }),
      });

      // ✅ full category data for others
      if (categoriesWithoutSub.length > 0) {
        orFilters.push({
          category: { $in: categoriesWithoutSub },
          ...(sellersIds.length && { seller: { $in: sellersIds } }),
          ...(writersIds.length && { writer: { $in: writersIds } }),
        });
      }

      filter = { $or: orFilters };
    } else if (categoryIds.length > 0) {
      // ✅ only categories selected, no subcategories
      filter.category = { $in: categoryIds };
    }

    const skip = (Number(page) - 1) * Number(limit);

    // --- Aggregation filters ---
    const categoryCountFilter = { ...filter };
    delete categoryCountFilter.category;
    delete categoryCountFilter.subcategory;
    delete categoryCountFilter.writer;
    delete categoryCountFilter.seller;

    const subcategoryCountFilter = { ...filter };
    delete subcategoryCountFilter.subcategory;
    delete subcategoryCountFilter.writer;
    delete subcategoryCountFilter.seller;

    const writerCountFilter = { ...filter };
    delete writerCountFilter.writer;

    const sellerCountFilter = { ...filter };
    delete sellerCountFilter.seller;
    // --- Fetch products, counts, categories & subcategories ---
    const [
      products,
      totalCount,
      categoryCounts,
      subcategoryCounts,
      writersCounts,
      sellersCounts,
      allCategories,
      allSubcategories,
      allWriters,
      allSellers,
    ] = await Promise.all([
      Product.find(filter)
        .skip(skip)
        .limit(Number(limit))
        .populate([
          { path: "category", select: "title slug img" },
          { path: "writer", select: "title slug img" },
          { path: "seller", select: "name slug img" },
          { path: "subcategory", select: "title slug parentCategory" },
        ])
        .select("title slug img sellingPrice regularPrice"),

      Product.countDocuments(filter),

      Category.aggregate([
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

      Product.aggregate([
        { $match: subcategoryCountFilter },
        { $group: { _id: "$subcategory", count: { $sum: 1 } } },
      ]),
      Product.aggregate([
        { $match: writerCountFilter },
        { $group: { _id: "$writer", count: { $sum: 1 } } },
      ]),
      Product.aggregate([
        { $match: sellerCountFilter },
        { $group: { _id: "$seller", count: { $sum: 1 } } },
      ]),
      Category.find().select("title slug img"),

      categoryIds.length
        ? Subcategory.find({ parentCategory: { $in: categoryIds } })
            .select("title slug parentCategory")
            .lean()
        : Promise.resolve([]),
      Writer.find().select("title slug img"),
      User.find({ role: "seller" }).select("name slug img"),
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
    const validWriters = allWriters
      .map((cat) => {
        const found = writersCounts.find(
          (c) => String(c._id) === String(cat._id)
        );
        if (!found) return null;
        return {
          ...cat.toObject(),
          count: found.count,
          selected: writers.includes(
            new mongoose.Types.ObjectId(cat._id as string)
          ),
        };
      })
      .filter(Boolean);
    const validSellers = allSellers
      .map((cat) => {
        const found = sellersCounts.find(
          (c) => String(c._id) === String(cat._id)
        );
        if (!found) return null;
        return {
          ...cat.toObject(),
          count: found.count,
          selected: sellers.includes(
            new mongoose.Types.ObjectId(cat._id as string)
          ),
        };
      })
      .filter(Boolean);
    // --- Prepare valid subcategories with counts and selected flags ---
    const validSubcategories = allSubcategories
      .map((sub) => {
        const found = subcategoryCounts.find((c) => c);
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
      writers: validWriters,
      sellers: validSellers,
    });
  } catch (error) {
    console.error("Filter Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
