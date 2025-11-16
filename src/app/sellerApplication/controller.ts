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
    const items = await Model.find()
      .populate("user", "name username email phone image")
      .sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({
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

export const updateSellerApplicationStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // Find application
    const application = await Model.findById(id).populate("user");
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;
    await application.save();

    // ✅ If approved, update user with application details
    if (status === "approved" && application.user) {
      // @ts-ignore
      await User.findByIdAndUpdate(application.user._id, {
        role: "seller",
        isEnabledByAdmin: true,
        companyName: application.companyName,
        companyEmail: application.companyEmail,
        companyPhone: application.companyPhone,
        whatsapp: application.whatsapp,
        coverImg: application.coverImg,
        image: application.image,
        firstContactPersonName: application.firstContactPersonName,
        firstContactPersonPhone: application.firstContactPersonPhone,
        secondContactPersonName: application.secondContactPersonName,
        secondContactPersonPhone: application.secondContactPersonPhone,
      });
    }

    return res.json({
      message: `Application ${status} successfully`,
      application,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
