import { Request, Response } from "express";
import { SellerApplication as Model } from "./model";
import User from "../user/user.model";

//===================== Admin Controllers =====================

export const create = async (req: Request, res: Response) => {
  try {
    const item = await Model.create(req.body);
    res
      .status(201)
      .json({ message: "SellerApplication created successfully!", item });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: "Failed to create SellerApplication.",
      error: error.message,
    });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item)
      return res.status(404).json({ message: "SellerApplication not found." });
    res
      .status(200)
      .json({ message: "SellerApplication updated successfully!", item });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: "Failed to update SellerApplication.",
      error: error.message,
    });
  }
};

export const allForAdminIndexPage = async (req: Request, res: Response) => {
  try {
    // Pagination params
    const {
      page = 1,
      limit = 20,
      status,
    } = req.query as {
      page?: string;
      limit?: string;
      status?: "pending" | "approved" | "rejected";
    };

    const skip = (Number(page) - 1) * Number(limit);

    // ---------- FILTER ----------
    const filter: any = {};

    if (status) {
      filter.status = status; // Filter by enum status
    }

    // ---------- QUERY ----------
    const items = await Model.find(filter)
      .populate("user", "name username email phone image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalItems = await Model.countDocuments(filter);

    return res.status(200).json({
      success: true,
      page: Number(page),
      limit: Number(limit),
      totalItems,
      totalPages: Math.ceil(totalItems / Number(limit)),
      items,
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch SellerApplications.",
      error: error.message,
    });
  }
};

export const singleForAdmin = async (req: Request, res: Response) => {
  try {
    const item = await Model.findOne({ _id: req.params.id }).populate(
      "user",
      "name username email phone image"
    );
    res.status(200).json(item);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch SellerApplication.",
      error: error.message,
    });
  }
};

// ================== User Controllers ======================

export const allForUserIndexPage = async (req: Request, res: Response) => {
  try {
    const items = await Model.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch SellerApplications.",
      error: error.message,
    });
  }
};

export const allSlugsForUserIndexPage = async (req: Request, res: Response) => {
  try {
    const items = await Model.find({ display: true }, "slug -_id");
    res.status(200).json({
      message: "SellerApplication slugs fetched successfully!",
      items,
    });
  } catch (error) {
    console.error("Failed to fetch slugs:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch SellerApplication slugs." });
  }
};

export const singleForUserForDetailsPageBySlug = async (
  req: Request,
  res: Response
) => {
  try {
    const item = await Model.findOne({ slug: req.params.slug });
    if (!item) {
      return res
        .status(404)
        .json({ message: "Oops! SellerApplication not found.", item: null });
    }
    res.status(200).json(item);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch SellerApplication.",
      error: error.message,
    });
  }
};

export const rejectByAdmin = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Find application
    const application = await Model.findById(id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    application.status = "rejected";
    await application.save();

    return res.json({
      message: `Application rejected successfully`,
      application,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
