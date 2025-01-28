"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSubcategory =
  exports.getSubcategoryById =
  exports.updateSubcategory =
  exports.addSubcategory =
  exports.getAllCategoryIds =
  exports.deleteCategory =
  exports.findSubcategoryById =
  exports.getCategoryById =
  exports.getAllCategories =
  exports.updateCategory =
  exports.createCategory =
    void 0;
const category_model_1 = __importDefault(require("./category.model"));
const cloudinary_config_1 = __importDefault(
  require("../shared/cloudinary.config")
);
const product_model_1 = __importDefault(require("../product/product.model"));
const nergeInfoSection_1 = require("../utils/nergeInfoSection");
const mongoose_1 = __importDefault(require("mongoose"));
const createCategory = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
      const {
        title,
        description,
        infoSections,
        display,
        displayPositionOfHomePage,
        subCategories,
      } = req.body;
      const files = req.files;
      // Check for the single file (photo)
      const photo =
        (_a = files === null || files === void 0 ? void 0 : files.photo) ===
          null || _a === void 0
          ? void 0
          : _a[0];
      if (!photo) {
        return res.status(400).json({ error: "Photo is required" });
      }
      // Upload the single file (photo)
      const photoResult = yield new Promise((resolve, reject) => {
        const uploadStream = cloudinary_config_1.default.uploader.upload_stream(
          { folder: "categories" },
          (error, result) => {
            if (error || !result) {
              return reject(
                error || new Error("Upload failed, result is undefined")
              );
            }
            resolve(result);
          }
        );
        uploadStream.end(photo.buffer);
      });
      // Upload fieldIcons and sectionIcons concurrently
      const fieldIcons =
        (files === null || files === void 0 ? void 0 : files.fieldIcons) || [];
      const sectionIcons =
        (files === null || files === void 0 ? void 0 : files.sectionIcons) ||
        [];
      // Parallel upload for field icons
      const fieldIconsUploads = fieldIcons.map(
        (file) =>
          new Promise((resolve, reject) => {
            const uploadStream =
              cloudinary_config_1.default.uploader.upload_stream(
                { folder: "categories/fields" },
                (error, result) => {
                  if (error || !result) {
                    return reject(
                      error || new Error("Upload failed, result is undefined")
                    );
                  }
                  resolve(result.secure_url);
                }
              );
            uploadStream.end(file.buffer);
          })
      );
      // Parallel upload for section icons
      const sectionIconsUploads = sectionIcons.map(
        (file) =>
          new Promise((resolve, reject) => {
            const uploadStream =
              cloudinary_config_1.default.uploader.upload_stream(
                { folder: "categories/sections" },
                (error, result) => {
                  if (error || !result) {
                    return reject(
                      error || new Error("Upload failed, result is undefined")
                    );
                  }
                  resolve(result.secure_url);
                }
              );
            uploadStream.end(file.buffer);
          })
      );
      // Wait for all uploads to finish
      const [fieldIconsUrls, sectionIconsUrls] = yield Promise.all([
        Promise.all(fieldIconsUploads),
        Promise.all(sectionIconsUploads),
      ]);
      // Parse and assign the uploaded URLs to the respective sections and fields
      const parsedInfoSections = JSON.parse(infoSections);
      parsedInfoSections.forEach((section, sectionIndex) => {
        if (sectionIconsUrls[sectionIndex]) {
          section.sectionIcon = sectionIconsUrls[sectionIndex];
        }
        section.fields.forEach((field, fieldIndex) => {
          if (fieldIconsUrls[fieldIndex]) {
            field.fieldIcon = fieldIconsUrls[fieldIndex];
          }
        });
      });
      // Create and save the new category
      const newCategory = new category_model_1.default({
        title,
        description,
        display,
        displayPositionOfHomePage,
        infoSections: parsedInfoSections,
        photoUrl: photoResult.secure_url,
        subCategories,
      });
      yield newCategory.save();
      res.status(201).json(newCategory);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
exports.createCategory = createCategory;
const updateCategory = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
      const {
        title,
        description,
        display,
        displayPositionOfHomePage,
        infoSections,
      } = req.body;
      const categoryId = req.params.id;
      const category = yield category_model_1.default.findById(categoryId);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      const files = req.files;
      const photo =
        (_b = files === null || files === void 0 ? void 0 : files.photo) ===
          null || _b === void 0
          ? void 0
          : _b[0];
      let photoResult;
      if (photo) {
        photoResult = yield new Promise((resolve, reject) => {
          const uploadStream =
            cloudinary_config_1.default.uploader.upload_stream(
              { folder: "categories" },
              (error, result) => {
                if (error || !result) {
                  return reject(
                    error || new Error("Upload failed, result is undefined")
                  );
                }
                resolve(result);
              }
            );
          uploadStream.end(photo.buffer);
        });
      }
      // Upload fieldIcons and sectionIcons concurrently
      const fieldIcons =
        (files === null || files === void 0 ? void 0 : files.fieldIcons) || [];
      const sectionIcons =
        (files === null || files === void 0 ? void 0 : files.sectionIcons) ||
        [];
      // Parallel upload for field icons
      const fieldIconsUploads = fieldIcons.map(
        (file) =>
          new Promise((resolve, reject) => {
            const uploadStream =
              cloudinary_config_1.default.uploader.upload_stream(
                { folder: "categories/fields" },
                (error, result) => {
                  if (error || !result) {
                    return reject(
                      error || new Error("Upload failed, result is undefined")
                    );
                  }
                  resolve(result.secure_url);
                }
              );
            uploadStream.end(file.buffer);
          })
      );
      // Parallel upload for section icons
      const sectionIconsUploads = sectionIcons.map(
        (file) =>
          new Promise((resolve, reject) => {
            const uploadStream =
              cloudinary_config_1.default.uploader.upload_stream(
                { folder: "categories/sections" },
                (error, result) => {
                  if (error || !result) {
                    return reject(
                      error || new Error("Upload failed, result is undefined")
                    );
                  }
                  resolve(result.secure_url);
                }
              );
            uploadStream.end(file.buffer);
          })
      );
      // Wait for all uploads to finish while maintaining the order of URLs
      const [fieldIconsUrls, sectionIconsUrls] = yield Promise.all([
        Promise.all(fieldIconsUploads), // Field icons URLs in order
        Promise.all(sectionIconsUploads), // Section icons URLs in order
      ]);
      console.log("Field icons url", fieldIconsUrls);
      console.log("Section icons url", sectionIconsUrls);
      console.log("Info Sections", infoSections);
      let fieldIconIndex = 0;
      let sectionIconIndex = 0;
      // Update the infoSections with new URLs where isNew is true
      const updatedInfoSections = JSON.parse(infoSections).map((section) => {
        // Replace section icon if the section is new
        if (section.sectionIcon != null) {
          if (
            section.sectionIcon.includes("blob:") &&
            sectionIconIndex < sectionIconsUrls.length
          ) {
            section.sectionIcon = sectionIconsUrls[sectionIconIndex];
            sectionIconIndex++;
          }
        }
        // Replace field icons if the field is new
        section.fields = section.fields.map((field) => {
          if (field.fieldIcon != null) {
            if (
              field.fieldIcon.includes("blob:") &&
              fieldIconIndex < fieldIconsUrls.length
            ) {
              field.fieldIcon = fieldIconsUrls[fieldIconIndex];
              fieldIconIndex++;
            }
          }
          return field;
        });
        return section;
      });
      // Update the category with new values
      category.title = title;
      category.description = description;
      category.display = display;
      category.displayPositionOfHomePage = displayPositionOfHomePage;
      category.infoSections = updatedInfoSections;
      category.subCategories;
      // Set photo URL, keeping the old one if no new photo was uploaded
      if (photoResult && photoResult.secure_url) {
        category.photoUrl = photoResult.secure_url;
      }
      // Fetch all products by category ID
      const products = yield product_model_1.default.find({
        category: category._id,
      });
      // Merge info sections and update products individually
      for (const product of products) {
        const mergedInfoSections = (0, nergeInfoSection_1.mergeInfoSections)(
          updatedInfoSections,
          product.infoSectionsData
        );
        yield product_model_1.default.updateOne(
          { _id: product._id },
          { $set: { infoSectionsData: mergedInfoSections } }
        );
      }
      const updatedCategory = yield category.save(); // Ensure the updated category is saved
      res.status(200).json(updatedCategory); // Return the updated category
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
exports.updateCategory = updateCategory;
const getAllCategories = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      // Fetch all categories
      const previousCategories = yield category_model_1.default.find();
      // Fetch products and count products per category
      const categories = yield Promise.all(
        previousCategories.map((category) =>
          __awaiter(void 0, void 0, void 0, function* () {
            const productCount = yield product_model_1.default.countDocuments({
              category: category._id,
            });
            return Object.assign(Object.assign({}, category.toJSON()), {
              categoryProducts: productCount,
            });
          })
        )
      );
      res.status(200).json({ categories });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
exports.getAllCategories = getAllCategories;
const getCategoryById = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const category = yield category_model_1.default.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.status(200).json(category);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
exports.getCategoryById = getCategoryById;
const findSubcategoryById = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const subcategoryId = req.params.subCategoryId;
    console.log(subcategoryId);
    try {
      // Find the category containing the subcategory by its ID
      const category = yield category_model_1.default.findOne(
        { "subCategories._id": subcategoryId },
        { "subCategories.$": 1 } // Only return the matching subcategory
      );
      if (
        !category ||
        ((_c = category.subCategories) === null || _c === void 0
          ? void 0
          : _c.length) === 0
      ) {
        return res.status(404).json({ message: "Subcategory not found" });
      }
      // Return the found subcategory
      if (category.subCategories) {
        console.log(category.subCategories[0]);
        return res.status(200).json({ subcategory: category.subCategories[0] });
      }
    } catch (error) {
      console.error("Error finding subcategory:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
exports.findSubcategoryById = findSubcategoryById;
// Add this function  to your existing controller file
const deleteCategory = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      const categoryId = req.params.id;
      const category = yield category_model_1.default.findByIdAndDelete(
        categoryId
      );
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
exports.deleteCategory = deleteCategory;
const getAllCategoryIds = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    try {
      // Fetch all categories and return only their  IDs
      const categories = yield category_model_1.default
        .find()
        .select("_id")
        .lean();
      // Extract only the IDs from the categories
      const categoryIds = categories.map((category) => category._id);
      res.status(200).json(categoryIds);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
exports.getAllCategoryIds = getAllCategoryIds;
const addSubcategory = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e;
    try {
      // Extract 'id' instead of 'categoryId'
      const { id } = req.params;
      const { title, description } = req.body;
      const files = req.files;
      const subcategoryPhoto =
        (_d = files === null || files === void 0 ? void 0 : files.photo) ===
          null || _d === void 0
          ? void 0
          : _d[0];
      if (!subcategoryPhoto) {
        return res.status(400).json({ error: "Subcategory photo is required" });
      }
      // Upload the subcategory photo to Cloudinary
      const photoResult = yield new Promise((resolve, reject) => {
        const uploadStream = cloudinary_config_1.default.uploader.upload_stream(
          { folder: "subcategories" },
          (error, result) => {
            if (error || !result) {
              return reject(
                error || new Error("Upload failed, result is undefined")
              );
            }
            resolve(result);
          }
        );
        uploadStream.end(subcategoryPhoto.buffer);
      });
      // Find the category by ID (using 'id')
      const category = yield category_model_1.default.findById(id);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      // Create the subcategory object
      const newSubcategory = {
        _id: new mongoose_1.default.Types.ObjectId(), // Create a new ObjectId for the subcategory
        title,
        description,
        photo: photoResult.secure_url,
      };
      // Add the new subcategory to the category's subCategories array
      (_e = category.subCategories) === null || _e === void 0
        ? void 0
        : _e.push(newSubcategory);
      // Save the updated category
      yield category.save();
      res.status(200).json({
        success: true,
        message: "Subcategory added successfully",
        category,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: error.message });
    }
  });
exports.addSubcategory = addSubcategory;
const updateSubcategory = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _f, _g;
    try {
      const { categoryId, subcategoryId } = req.params; // Extract categoryId and subcategoryId from request parameters
      const { title, description } = req.body; // New values for the subcategory
      console.log(categoryId);
      console.log(subcategoryId);
      const files = req.files;
      const subcategoryPhoto =
        (_f = files === null || files === void 0 ? void 0 : files.photo) ===
          null || _f === void 0
          ? void 0
          : _f[0];
      // Find the category by its ID
      const category = yield category_model_1.default.findById(categoryId);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      // Find the specific subcategory within the category
      const subcategory =
        (_g = category.subCategories) === null || _g === void 0
          ? void 0
          : _g.find((sub) => sub._id.toString() === subcategoryId);
      if (!subcategory) {
        return res.status(404).json({ error: "Subcategory not found" });
      }
      console.log("This is title", title);
      console.log("THis is description", description);
      console.log("This is sub category", subcategory);
      // Upload new photo if a new one is provided
      if (subcategoryPhoto) {
        const photoResult = yield new Promise((resolve, reject) => {
          const uploadStream =
            cloudinary_config_1.default.uploader.upload_stream(
              { folder: "subcategories" },
              (error, result) => {
                if (error || !result) {
                  return reject(
                    error || new Error("Upload failed, result is undefined")
                  );
                }
                resolve(result);
              }
            );
          uploadStream.end(subcategoryPhoto.buffer);
        });
        // Set the new photo URL
        subcategory.photo = photoResult.secure_url;
      }
      // Update the title and description if provided
      if (title) subcategory.title = title;
      if (description) subcategory.description = description;
      // Save the updated category document
      yield category.save();
      res.status(200).json({
        message: "Subcategory updated successfully",
        subcategory,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
exports.updateSubcategory = updateSubcategory;
// Get a specific subcategory of a specific category
const getSubcategoryById = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _h;
    try {
      const { categoryId, subcategoryId } = req.params;
      // Find the category by ID
      const category = yield category_model_1.default.findById(categoryId);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      // Find the subcategory by ID within the category's subCategories array
      const subcategory =
        (_h = category.subCategories) === null || _h === void 0
          ? void 0
          : _h.find((sub) => sub._id.toString() === subcategoryId);
      if (!subcategory) {
        return res.status(404).json({ error: "Subcategory not found" });
      }
      res.status(200).json(subcategory);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
exports.getSubcategoryById = getSubcategoryById;
const deleteSubcategory = (req, res) =>
  __awaiter(void 0, void 0, void 0, function* () {
    var _j, _k;
    try {
      const { categoryId, subcategoryId } = req.params; // Extract categoryId and subcategoryId from params
      // Find the category by ID
      const category = yield category_model_1.default.findById(categoryId);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      // Check if the subcategory exists in the category
      const subcategoryIndex =
        (_j = category.subCategories) === null || _j === void 0
          ? void 0
          : _j.findIndex(
              (subcategory) => subcategory._id.toString() === subcategoryId
            );
      if (subcategoryIndex === -1 || subcategoryIndex === undefined) {
        return res.status(404).json({ error: "Subcategory not found" });
      }
      // Remove the subcategory from the subCategories array
      (_k = category.subCategories) === null || _k === void 0
        ? void 0
        : _k.splice(subcategoryIndex, 1);
      // Save the updated category
      yield category.save();
      res.status(200).json({
        success: true,
        message: "Subcategory deleted successfully",
        category,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
exports.deleteSubcategory = deleteSubcategory;
