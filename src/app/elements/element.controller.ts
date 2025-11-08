import { Request, Response } from "express";
import { PageElements } from "./element.model"; // Your Mongoose model
import Product from "../product/model";
import Banner from "../banner/banner.model";
import Writer from "../writer/writer.model";
import User from "../user/user.model";

// Helper function to upload images to Cloudinary using promises

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body;

    const item = await PageElements.create(data);

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
// Get PageElement by ID
export const getElementById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const pageElement = await PageElements.findById(id).populate("bannerId");

    if (!pageElement) {
      return res.status(404).json({ message: "PageElement not found" });
    }

    res.status(200).json({
      message: "PageElement fetched successfully",
      data: pageElement,
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching PageElement", error: error.message });
  }
};
// Get PageElement by ID
export const singleForEditPage = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const item = await PageElements.findById(id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.status(200).json(item);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error fetching PageElement", error: error.message });
  }
};

export const elementById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Fetch the page element by ID
    const pageElement = await PageElements.findById(id);

    if (!pageElement) {
      return res
        .status(404)
        .json({ message: "No Page elements found for the targeted page ID" });
    }

    // Process sections to populate banners or products
    const updatedSections = await Promise.all(
      pageElement.sections.map(async (sec) => {
        //@ts-ignore
        const sectionCopy = { ...sec.toObject() }; // create a plain object

        if (sec.selectionType === "banner" && sec.banner) {
          const banner = await Banner.findById(sec.banner);
          sectionCopy.banner = banner || null;
        }

        if (sec.selectionType === "category" && sec.category) {
          const products = await Product.find({ category: sec.category }).limit(
            sec.postLimit || 10
          );
          sectionCopy.category = products;
        }

        if (sec.selectionType === "subcategory" && sec.subcategory) {
          const products = await Product.find({
            subcategory: sec.subcategory,
          })
            .select(
              "slug img title existingQnt seller sellingPrice regularPrice category stockStatus"
            )
            .limit(sec.postLimit || 10);
          sectionCopy.subcategory = products;
        }
        if (sec.selectionType === "writer" && sec.writer) {
          const products = await Product.find({
            writer: sec.writer,
          })
            .select(
              "slug img title existingQnt seller sellingPrice regularPrice category stockStatus"
            )
            .limit(sec.postLimit || 10);
          sectionCopy.writer = products;
        }
        if (sec.selectionType === "latest") {
          const products = await Product.find()
            .sort({ createdAt: -1 })
            .select(
              "slug img title existingQnt seller sellingPrice regularPrice category stockStatus"
            )
            .limit(sec.postLimit || 10);
          sectionCopy.latest = products;
        }
        if (sec.selectionType === "preOrder") {
          const products = await Product.find({
            orderType: "Pre_Order",
          })
            .select(
              "slug img title existingQnt seller sellingPrice regularPrice category stockStatus"
            )
            .limit(sec.postLimit || 10);
          sectionCopy.preOrder = products;
        }
        if (sec.selectionType === "bestSellingBooks") {
          const products = await Product.find()
            .select(
              "slug img title existingQnt seller sellingPrice regularPrice category stockStatus"
            )
            .limit(sec.postLimit || 10);
          sectionCopy.bestSellingBooks = products;
        }
        if (sec.selectionType === "bestSellingAuthors") {
          const writers = await Writer.find().limit(sec.postLimit || 10);
          sectionCopy.bestSellingAuthors = writers;
        }
        if (sec.selectionType === "bestSellingPublications") {
          const publications = await User.find({ role: "seller" })
            .select("image name slug companyName")
            .limit(sec.postLimit || 10);
          sectionCopy.bestSellingPublications = publications;
        }
        return sectionCopy;
      })
    );

    // Return updated page element with populated sections
    res.status(200).json({
      _id: pageElement._id,
      title: pageElement.title,
      sections: updatedSections,
    });
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching PageElements", error: error.message });
  }
};

// Delete a single PageElement by ID
export const deletePageElementById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const pageElement = await PageElements.findByIdAndDelete(id);
    if (!pageElement) {
      return res.status(404).json({ message: "PageElement not found" });
    }

    res.status(200).json({
      message: "PageElement deleted successfully",
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error deleting PageElement", error: error.message });
  }
};

// Update the status of a PageElement by ID
export const updatePageElementStatus = async (req: Request, res: Response) => {
  const { id } = req.params; // Make sure the ID is being passed correctly
  const { status } = req.body;

  try {
    const updatedPageElement = await PageElements.findByIdAndUpdate(
      id,
      { status }, // Ensure 'status' is the correct field
      { new: true } // Return the updated document
    );

    if (!updatedPageElement) {
      return res.status(404).json({ message: "PageElement not found" });
    }

    res.status(200).json({
      message: "PageElement status updated successfully",
      data: updatedPageElement,
    });
  } catch (error: any) {
    res.status(500).json({
      message: "Error updating PageElement status",
      error: error.message,
    });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await PageElements.findByIdAndUpdate(id, req.body, {
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
export const allForIndexPageByTargetedPageAndId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { targetedPageId, page } = req.params;
    const items = await PageElements.find();
    res.status(200).json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
