import { Request, Response } from "express";
import cloudinary from "../../shared/cloudinary.config";
import Settings from "./settings.model";

const uploadToCloudinary = (file: Express.Multer.File) => {
  return new Promise<{ secure_url: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((error, result) => {
      if (error) {
        return reject(error);
      }
      resolve(result as { secure_url: string });
    });
    stream.end(file.buffer);
  });
};

export const getSettings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      res.status(404).json({ message: "Settings not found" });
      return;
    }
    res.status(200).json(settings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
export const getPrivacyPoliciesOfSettings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      res.status(404).json({ message: "Settings not found" });
      return;
    }
    res.status(200).json(settings.privacyPolicies);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
export const updateSettings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const logo = files.logo ? files.logo[0] : null;
    const favicon = files.favicon ? files.favicon[0] : null;
    const loto = files.loto ? files.loto[0] : null;
    const fbImage = files.fbImage ? files.fbImage[0] : null;
    let logoUrl = "";
    let faviconUrl = "";
    let lotoUrl = "";
    let fbImageUrl = "";

    if (logo) {
      const result = await uploadToCloudinary(logo);
      logoUrl = result.secure_url;
    }

    if (favicon) {
      const result = await uploadToCloudinary(favicon);
      faviconUrl = result.secure_url;
    }

    if (loto) {
      const result = await uploadToCloudinary(loto);
      lotoUrl = result.secure_url;
    }

    if (fbImage) {
      const result = await uploadToCloudinary(fbImage);
      fbImageUrl = result.secure_url;
    }

    // Find the first document in the collection
    const settings = await Settings.findOne();

    if (settings) {
      settings.logo = logoUrl || settings.logo;
      settings.favicon = faviconUrl || settings.favicon;
      settings.loto = lotoUrl || settings.loto;
      settings.fbImage = fbImageUrl || settings.fbImage;
      settings.bgColor = req.body.bgColor || settings.bgColor;
      settings.websiteTitle = req.body.websiteTitle || settings.websiteTitle;
      settings.websiteBgColor =
        req.body.websiteBgColor || settings.websiteBgColor;
      settings.copyright = req.body.copyright || settings.copyright;
      settings.country = req.body.country || settings.country;
      settings.currencySymbol =
        req.body.currencySymbol || settings.currencySymbol;
      settings.priceZero = req.body.priceZero || settings.priceZero;
      settings.highlights = req.body.highlights || settings.highlights;
      settings.shippingInside =
        req.body.shippingInside || settings.shippingInside;
      settings.shippingOutside =
        req.body.shippingOutside || settings.shippingOutside;
      settings.deliveryMethod1 =
        req.body.deliveryMethod1 || settings.deliveryMethod1;
      settings.deliveryTime1 = req.body.deliveryTime1 || settings.deliveryTime1;
      settings.deliveryMethod2 =
        req.body.deliveryMethod2 || settings.deliveryMethod2;
      settings.deliveryTime2 = req.body.deliveryTime2 || settings.deliveryTime2;
      settings.payment = req.body.payment || settings.payment;
      settings.paymentText1 = req.body.paymentText1 || settings.paymentText1;
      settings.paymentText2 = req.body.paymentText2 || settings.paymentText2;
      settings.officeAddress = req.body.officeAddress || settings.officeAddress;
      settings.whatsapp = req.body.whatsapp;
      settings.telegram = req.body.telegram;
      settings.note = req.body.note || settings.note;
      settings.order = req.body.order || settings.order;
      settings.orderText = req.body.orderText || settings.orderText;
      settings.metaDescription =
        req.body.metaDescription || settings.metaDescription;
      settings.description = req.body.description;
      settings.privacyPolicies =
        req.body.privacyPolicies || settings.privacyPolicies;
      settings.termsAndConditions =
        req.body.termsAndConditions || settings.termsAndConditions;
      settings.otherPolicies = req.body.otherPolicies || settings.otherPolicies;
      settings.sellerDefaultStatus =
        req.body.sellerDefaultStatus || settings.sellerDefaultStatus;
      settings.phone = req.body.phone || settings.phone;
      settings.tags =
        req.body.tags.split(",").map((tag: string) => tag.trim()) ||
        settings.tags;

      const result = await settings.save();

      res.status(200).json(settings);
    } else {
      res.status(404).json({ message: "Settings not found" });
    }
  } catch (error: any) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

export const updateDefaultSellerStatus = async (
  req: Request,
  res: Response
) => {
  try {
    const { id } = req.params; // Extract the ID from request parameters
    const { status } = req.body; // Extract the status from request body

    // Validate that status is provided
    if (status === undefined) {
      return res
        .status(400)
        .json({ message: "Missing required field: status" });
    }

    console.log("Received ID:", id);
    console.log("Received Status:", status);

    // Find the document by ID and update the 'sellerDefaultStatus' field
    const result = await Settings.findByIdAndUpdate(
      id, // Match the document by ID
      { sellerDefaultStatus: status }, // Update only the 'sellerDefaultStatus' field
      { new: true, runValidators: true } // Return the updated document and validate input
    );

    if (!result) {
      return res
        .status(404)
        .json({ message: "No settings document found with the provided ID" });
    }

    res.status(200).json({
      message: "Default seller status updated successfully",
      data: result,
    });
  } catch (error: any) {
    console.log("Error during update:", error);
    res.status(500).json({
      message: "Error updating Default seller status",
      error: error.message,
    });
  }
};
