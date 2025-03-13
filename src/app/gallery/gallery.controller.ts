import { Request, Response } from "express";
import Gallery from "./gallery.model";

export const create = async (req: Request, res: Response) => {
  try {
    const obj = req.body;
    const result = await Gallery.create(obj);
    res.status(200).send({ result, message: "Created successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error creating/updating", error });
  }
};
export const getAll = async (req: Request, res: Response) => {
  try {
    const result = await Gallery.find();
    res.status(200).send({ result: result.reverse() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching", error });
  }
};
export const getOne = async (req: Request, res: Response) => {
  try {
    const result = await Gallery.findById(req.params.id);
    res.status(200).send({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching", error });
  }
};
export const update = async (req: Request, res: Response) => {
  try {
    const result = await Gallery.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).send({ result, message: "Updated successfully" });
  } catch (error) {
    console.error(error);

    res.status(500).json({ success: false, message: "Error updating", error });
  }
};
export const remove = async (req: Request, res: Response) => {
  try {
    const result = await Gallery.findByIdAndDelete(req.params.id);
    res.status(200).send({ result, message: "Deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error deleting", error });
  }
};

// // Search Controller
// export const searchGallery = async (req: Request, res: Response) => {
//   try {
//     const {
//       title,
//       useCase,
//       page = 1,
//       limit = 10,
//       sortBy = "createdAt",
//       order = "desc",
//     } = req.query;

//     // Create the filter object
//     const filters: { [key: string]: any } = {};
//     if (title) {
//       filters.title = { $regex: title, $options: "i" }; // Case-insensitive regex search
//     }
//     if (useCase) {
//       filters.useCase = useCase;
//     }

//     // Calculate pagination values
//     const pageNumber = parseInt(page as string, 10);
//     const pageSize = parseInt(limit as string, 10);
//     const skip = (pageNumber - 1) * pageSize;

//     // Fetch data with filters, pagination, and sorting
//     const data = await Gallery.find(filters)
//       .sort({ [sortBy as string]: order === "asc" ? 1 : -1 })
//       .skip(skip)
//       .limit(pageSize);

//     // Get total count for pagination metadata
//     const totalCount = await Gallery.countDocuments(filters);

//     res.status(200).json({
//       success: true,
//       data,
//       pagination: {
//         totalItems: totalCount,
//         currentPage: pageNumber,
//         totalPages: Math.ceil(totalCount / pageSize),
//         pageSize,
//       },
//     });
//   } catch (error: any) {
//     console.error("Error in searchGallery:", error);
//     res.status(500).json({
//       success: false,
//       message: "An error occurred while searching the gallery.",
//       error: error.message,
//     });
//   }
// };
