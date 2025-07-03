import { Request, Response } from "express";
import Suggestion from "./suggestion.model";

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

// Create a new suggestion
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body;
    const suggestion = await Suggestion.create(data);
    res.status(201).json(suggestion);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
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

export const updateSuggestion = async (req: Request, res: Response) => {
  const suggestionId = req.params.id;
  const data = req.body; // Destructuring the updated data from the request body

  try {
    // Find the suggestion by its ID and update it
    const updatedSuggestion = await Suggestion.findByIdAndUpdate(
      suggestionId,
      { title: data.title, products: data.products }, // Fields to update
      { new: true } // Return the updated document
    );
    if (!updatedSuggestion) {
      return res
        .status(404)
        .json({ success: false, message: "Suggestion not found" });
    }

    // Return the updated suggestion as a response
    return res.status(200).json({
      success: true,
      updatedSuggestion,
      message: "Successfully updated",
    });
  } catch (error) {
    console.error("Error updating suggestion:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while updating the suggestion." });
  }
};
