import { Request, Response } from "express";
import { Model as MongooseModel } from "mongoose";

export const deleteById = (Model: MongooseModel<any>) => {
  return async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const deletedItem = await Model.findByIdAndDelete(id);

      if (!deletedItem) {
        return res.status(404).json({
          success: false,
          resData: null,
          message: "Oops! Item not found.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Deleted successfully!",
      });
    } catch (error: any) {
      res.status(500).json({
        message: "Failed to delete.",
      });
    }
  };
};

export const getAllSlugsForSitemap = (Model: MongooseModel<any>) => {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      const arrayOfObjectWithSlug = await Model.find()
        .select("slug -_id")
        .lean();

      // Extract the _id field from each product and return an array of IDs
      const slugs = arrayOfObjectWithSlug.map((item) => item.slug);

      res.status(200).json({
        success: true,
        message: "Fetched successfully!",
        resData: slugs,
      });
    } catch (error: any) {
      res
        .status(500)
        .json({ success: false, error: "Failed to retrieve product IDs" });
    }
  };
};
