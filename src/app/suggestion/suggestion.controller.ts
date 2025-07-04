import { Request, Response } from "express";
import Suggestion from "./suggestion.model";

export const allForAdminIndexPage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const items = await Suggestion.find()
      .select("title")
      .sort({ createdAt: -1 });
    res.status(200).json({ message: "Fetched Successfully", items });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get all suggestions
export const getAllSuggestions = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const suggestions = await Suggestion.find().populate({
      path: "products",
      select: "_id title sellingPrice photo",
    });
    if (suggestions.length === 0) {
      res.status(200).json({ suggestions, message: "Suggestions not found" });
      return;
    }
    res
      .status(200)
      .json({ suggestions, message: "Suggestions Fetched successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
export const singleForEditPage = async (req: Request, res: Response) => {
  try {
    const item = await Suggestion.findOne({ _id: req.params.id });
    res.status(200).json({ message: "Suggestion fetched successfully!", item });
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to fetch Suggestion.", error: error.message });
  }
};
// Get a single suggestion by ID
export const getSuggestionById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const suggestion = await Suggestion.findById(id).populate({
      path: "products",
      select: "_id title sellingPrice photo shippingInside shippingOutside",
    });

    if (!suggestion) {
      res.status(404).json({ message: "Suggestion not found" });
      return;
    }

    res.status(200).json(suggestion);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const item = await Suggestion.create(req.body);

    // Send success message along with the created product data
    res.status(201).json({
      message: "Suggestion Created successfully!",
      item, // Optionally, include the created product in the response
    });
  } catch (error: any) {
    // Send error message if there was an issue
    res.status(500).json({
      message: "Failed to create suggestion.",
      error: error.message,
    });
  }
};
// Delete a suggestion by ID
export const deleteSuggestion = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const deletedSuggestion = await Suggestion.findByIdAndDelete(id);

    if (!deletedSuggestion) {
      res.status(404).json({ message: "Suggestion not found" });
      return;
    }

    res.status(200).json({ message: "Suggestion deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update
export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updatedItem = await Suggestion.findByIdAndUpdate(id, req.body, {
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
    console.error(error);
    res.status(500).json({
      message: "Failed to update.",
      error: error.message,
    });
  }
};
