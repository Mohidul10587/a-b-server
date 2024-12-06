import { Request, Response } from "express";

import Writer from "./writer.model";
import { cloudinaryUpload } from "../../shared/uploadSingleFileToCloudinary";

export const createBrand = async (
  req: Request,
  res: Response
): Promise<void> => {
  const files = req.files as {
    photo?: Express.Multer.File[];
    metaImage?: Express.Multer.File[];
  };

  try {
    const photoFile = files?.photo?.[0];
    const metaImageFile = files?.metaImage?.[0];
    const photoUrl = await cloudinaryUpload(photoFile);
    const metaImage = await cloudinaryUpload(metaImageFile);

    const tagsArray = req.body.tags.split(",").map((tag: string) => tag.trim());
    const writer = new Writer({
      title: req.body.title,
      slug: req.body.slug,
      description: req.body.description,

      photo: photoUrl,
      metaTitle: req.body.metaTitle,
      metaDescription: req.body.metaDescription,
      tags: tagsArray,
      metaImage: metaImage,
    });

    await writer.save();

    res.status(200).send({ writer });
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Internal Server Error" });
  }
};

// export const updateBrand = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   const files = req.files as {
//     photo?: Express.Multer.File[];
//     metaImage?: Express.Multer.File[];
//   };
//   console.log(req.body.previousPhoto);
//   try {
//     const writer = await Writer.findById(req.params.id);
//     if (!writer) {
//       res.status(404).send({ error: "writer not found" });
//       return;
//     }

//     const photoFile = files?.photo?.[0];
//     const metaImageFile = files?.metaImage?.[0];

//     const photoUrl = await cloudinaryUpload(photoFile);
//     const metaImage = await cloudinaryUpload(metaImageFile);

//     // Update writer fields with data from the request body
//     writer.title = req.body.title || writer.title;
//     writer.slug = req.body.slug || writer.slug;

//     writer.description = req.body.description || writer.description;
//     writer.rating = req.body.rating || writer.rating;
//     writer.metaTitle = req.body.metaTitle || writer.metaTitle;
//     writer.metaDescription = req.body.metaDescription || writer.metaDescription;

//     // Convert tags to an array if they are comma-separated
//     writer.tags = req.body.tags
//       ? req.body.tags.split(",").map((tag: string) => tag.trim())
//       : writer.tags;

//     // Update images if provided
//     if (photoUrl) {
//       writer.photo = photoUrl;
//       const publicKey = req.body.previousPhoto;
//       cloudinary.uploader
//         .destroy(publicKey, { invalidate: true })
//         .then((result) => console.log(result))
//         .catch((error) => console.error(error));
//     }
//     if (metaImage) {
//       writer.metaImage = metaImage;
//       const publicKey = req.body.previousMetaImage;
//       cloudinary.uploader
//         .destroy(publicKey, { invalidate: true })
//         .then((result) => console.log(result))
//         .catch((error) => console.error(error));
//     }

//     await writer.save();
//     res.status(200).send({ writer });
//   } catch (err) {
//     res.status(500).send({ error: "Internal Server Error" });
//   }
// };

export const getAllBrands = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Fetch all brands
    const writers = await Writer.find();

    // // Fetch products and count products per writer
    // const brands = await Promise.all(
    //   previousBrands.map(async (writer) => {
    //     const productCount = await Product.countDocuments({
    //       writer: writer._id,
    //     });
    //     return {
    //       ...writer.toJSON(),
    //       brandProducts: productCount,
    //     };
    //   })
    // );

    res.status(200).json({ writers });
  } catch (error: any) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// export const getBrandBySlug = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const writer = await writer.findOne({ slug: req.params.slug });
//     if (!writer) {
//       res.status(404).send({ error: "writer not found" });
//       return;
//     }
//     res.status(200).send({ writer });
//   } catch (err) {
//     res.status(500).send({ error: "Internal Server Error" });
//   }
// };

// export const getBrandById = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const writer = await writer.findById(req.params.id);
//     if (!writer) {
//       res.status(404).send({ error: "writer not found" });
//       return;
//     }
//     res.status(200).send({ writer });
//   } catch (err) {
//     res.status(500).send({ error: "Internal Server Error" });
//   }
// };

// export const getAllBrands2 = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const brands = await writer.find().select("_id title").lean();
//     res.status(200).send(brands);
//   } catch (err) {
//     res.status(500).send({ error: "Internal Server Error" });
//   }
// };

// export const deleteBrand = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const writer = await writer.findByIdAndDelete(req.params.id);
//     if (!writer) {
//       res.status(404).send({ error: "writer not found" });
//       return;
//     }
//     res.status(200).send({ message: "writer deleted successfully" });
//   } catch (err) {
//     res.status(500).send({ error: "Internal Server Error" });
//   }
// };
// // Function to get all writer IDs
// export const getAllBrandIds = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const brandIds = await writer.find().select("_id").lean();
//     // Extract the _id field from each writer and return an array of IDs
//     const ids = brandIds.map((writer) => writer._id);
//     res.status(200).json(ids);
//   } catch (err) {
//     res.status(500).send({ error: "Internal Server Error" });
//   }
// };
