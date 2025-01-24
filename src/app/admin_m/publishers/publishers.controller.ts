import { Request, Response } from "express";
import Product from "../../product/product.model";
import { cloudinaryUpload } from "../../shared/uploadSingleFileToCloudinary";
import Publisher from "./publishers.model";
export const createPublisher = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const files = req.files;
    const obj = req.body;
    let imgFile;
    let metaImgFile;

    if (files instanceof Array) {
      imgFile = files?.find((f: any) => f.fieldname === "img");
      metaImgFile = files?.find((f: any) => f.fieldname === "metaImg");
    }
    const imgUrl = await cloudinaryUpload(imgFile);
    const metaImgUrl = await cloudinaryUpload(metaImgFile);
    const keywords = req.body.keywords
      .split(",")
      .map((tag: string) => tag.trim());

    const updatePublisher = {
      ...obj,
      img: imgUrl ? imgUrl : obj.img,
      metaImg: metaImgUrl ? metaImgUrl : obj.metaImg,
      keywords: keywords,
    };
    if (obj._id) {
      const respondedPublisher = await Publisher.findOneAndUpdate(
        { _id: obj._id }, // Condition to find the document (e.g., unique `pageName`)
        updatePublisher,
        {
          new: true, // Return the updated document
          upsert: true, // Create the document if it doesn't exist
        }
      );
      res.status(200).send({
        respondedPublisher,
        message: "Updated successfully",
      });
    } else {
      const { _id, ...elsePublisher } = updatePublisher;
      const respondedPublisher = await Publisher.create(elsePublisher);
      res.status(200).send({
        respondedPublisher,
        message: "Created successfully",
      });
    }
  } catch (err) {
    console.log(err);
    console.log(err);
    res.status(500).send({ error: "Internal Server Error" });
  }
};
export const getPublisherById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const publisher = await Publisher.findById(req.params.id);
    if (!publisher) {
      res.status(404).send({ error: "Not found" });
      return;
    }
    res.status(200).send({ publisher });
  } catch (err) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const getAllPublishers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Fetch all publishers
    const previousPublishers = await Publisher.find();

    // Fetch products and count products per publisher
    const publishers = await Promise.all(
      previousPublishers.map(async (publisher) => {
        const productCount = await Product.countDocuments({
          publisher: publisher._id,
        });
        return {
          ...publisher.toJSON(),
          publisherProducts: productCount,
        };
      })
    );

    const sortedPublishers = publishers.sort((a, b) => a.position - b.position);

    res.status(200).json({ publishers: sortedPublishers });
  } catch (error: any) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const allForProductUploadPage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Fetch all publishers
    const previousPublishers = await Publisher.find().select("title slug");

    // Fetch products and count products per publisher

    const sortedPublishers = previousPublishers.sort(
      (a, b) => a.position - b.position
    );

    res.status(200).json({ publishers: sortedPublishers });
  } catch (error: any) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// export const getAllPublishersForNavbar = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     console.log("first");
//     const previousPublishers = await Publisher.find()
//       .select("_id title slug  position  attachedSubCategories")
//       .lean();

//     // Product counting part end

//     const categories = await Category.find()
//       .select("subCategories categoryName")
//       .lean();

//     // Flatten all subcategories into a single lookup map
//     const subcategoryLookup: { [key: string]: Subcategory } = categories.reduce(
//       (map, category) => {
//         category.subCategories?.forEach((subCategory) => {
//           map[subCategory._id.toString()] = subCategory;
//         });
//         return map;
//       },
//       {} as { [key: string]: Subcategory }
//     );

//     const enrichedPublishers = previousPublishers.map((publisher) => {
//       const enrichedSubcategories = publisher.attachedSubCategories
//         ?.map(
//           (subCategoryId) => subcategoryLookup[subCategoryId.toString()] || null
//         )
//         .filter(Boolean); // Remove null values for invalid IDs

//       return {
//         ...publisher, // Convert Mongoose document to plain JavaScript object
//         attachedSubCategories: enrichedSubcategories, // Replace IDs with details
//       };
//     });

//     const transformedobj = enrichedPublishers.map((parentCategory) => ({
//       _id: parentCategory._id,
//       title: parentCategory.title,
//       slug: parentCategory.slug,
//       position: parentCategory.position,
//       attachedSubCategories: parentCategory.attachedSubCategories?.map(
//         (subCategory: any) => ({
//           _id: subCategory._id,
//           title: subCategory.title,
//           slug: subCategory.slug,

//           position: subCategory.position,
//         })
//       ),
//     }));
//     const sortedPublishers = transformedobj.sort(
//       (a, b) => a.position - b.position
//     );
//     res.status(200).json({ enrichedPublishers: sortedPublishers });
//   } catch (error: any) {
//     console.log(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

// export const getAllPublishersForPublisherPage = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     const previousPublishers = await Publisher.find().select(
//       "_id title slug photo position rating attachedSubCategories"
//     );

//     // Product counting part start
//     const publishers = await Promise.all(
//       previousPublishers.map(async (publisher) => {
//         const productCount = await Product.countDocuments({ publisher: publisher._id });
//         return {
//           ...publisher.toJSON(),
//           publisherProducts: productCount,
//         };
//       })
//     );
//     // Product counting part end

//     const categories = await Category.find()
//       .select("subCategories categoryName")
//       .lean();

//     // Flatten all subcategories into a single lookup map
//     const subcategoryLookup: { [key: string]: Subcategory } = categories.reduce(
//       (map, category) => {
//         category.subCategories?.forEach((subCategory) => {
//           map[subCategory._id.toString()] = subCategory;
//         });
//         return map;
//       },
//       {} as { [key: string]: Subcategory }
//     );

//     const enrichedPublishers = publishers.map((publisher) => {
//       const enrichedSubcategories = publisher.attachedSubCategories
//         .map(
//           (subCategoryId) => subcategoryLookup[subCategoryId.toString()] || null
//         )
//         .filter(Boolean); // Remove null values for invalid IDs

//       return {
//         ...publisher, // Convert Mongoose document to plain JavaScript object
//         attachedSubCategories: enrichedSubcategories, // Replace IDs with details
//       };
//     });

//     const transformedobj = enrichedPublishers.map((parentCategory) => ({
//       _id: parentCategory._id,
//       title: parentCategory.title,
//       slug: parentCategory.slug,
//       photo: parentCategory.photo,
//       position: parentCategory.position,
//       publisherProducts: parentCategory.publisherProducts,
//       rating: parentCategory.rating,

//       attachedSubCategories: parentCategory.attachedSubCategories.map(
//         (subCategory: any) => ({
//           _id: subCategory._id,
//           title: subCategory.title,
//           slug: subCategory.slug,
//           photo: subCategory.photo,
//           position: subCategory.position,
//         })
//       ),
//     }));
//     const sortedPublishers = transformedobj.sort(
//       (a, b) => a.position - b.position
//     );
//     res.status(200).json({ enrichedPublishers: sortedPublishers });
//   } catch (error: any) {
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
export const getPublisherBySlug = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const publisher = await Publisher.findOne({ slug: req.params.slug });
    if (!publisher) {
      res.status(404).send({ error: "Publisher not found" });
      return;
    }
    res.status(200).send({ publisher });
  } catch (err) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const allForIndexPage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const publishers = await Publisher.find()
      .select("_id title slug img link")
      .lean();
    res.status(200).send(publishers);
  } catch (err) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};

export const deletePublisher = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const publisher = await Publisher.findByIdAndDelete(req.params.id);
    if (!publisher) {
      res.status(404).send({ error: "Publisher not found" });
      return;
    }
    res.status(200).send({ message: "Publisher deleted successfully" });
  } catch (err) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};
// Function to get all publisher IDs
export const getAllPublisherIds = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const publisherIds = await Publisher.find().select("slug").lean();
    // Extract the _id field from each publisher and return an array of IDs
    const ids = publisherIds.map((publisher) => publisher.slug);
    res.status(200).json(ids);
  } catch (err) {
    res.status(500).send({ error: "Internal Server Error" });
  }
};
