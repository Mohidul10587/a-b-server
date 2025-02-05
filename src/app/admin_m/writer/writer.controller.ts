import { Request, Response } from "express";

import Writer from "./writer.model";
import { generateSlug } from "../../shared/generateSLug";

export const create = async (req: Request, res: Response) => {
  try {
    const newCategory = await Writer.create({
      ...req.body,
      slug: generateSlug(req.body.title),
    });

    // Send success message along with the created category data
    res.status(201).json({
      message: "Created successfully!",
      respondedData: newCategory, // Optionally, include the created category in the response
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

// Get single
export const singleWriterForWriterEditPage = async (
  req: Request,
  res: Response
) => {
  try {
    const item = await Writer.findOne({ _id: req.params.id });

    res.status(200).json({
      message: "Fetched successfully!",
      respondedData: item,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch.",
      error: error.message,
    });
  }
};

export const getAllBrands = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Fetch all brands
    const writers = await Writer.find();

    res.status(200).json({ writers });
  } catch (error: any) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getWriterBySlug = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const writer = await Writer.findOne({ slug: req.params.slug });
    if (!writer) {
      res.status(404).send({ error: "writer not found" });
      return;
    }
    res.status(200).send({ writer });
  } catch (err) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const getWriteById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const writer = await Writer.findById(req.params.id);
    if (!writer) {
      res.status(404).send({ error: "writer not found" });
      return;
    }
    res.status(200).send({ writer });
  } catch (err) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// Update
export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updatedItem = await Writer.findByIdAndUpdate(
      id,
      { ...req.body, slug: generateSlug(req.body.title) },
      {
        new: true, // Return the updated document
        runValidators: true, // Run validation on the updated data
      }
    );

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
