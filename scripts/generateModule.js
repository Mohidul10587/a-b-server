const fs = require("fs");
const path = require("path");

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Get module names from command line arguments
const moduleNames = process.argv.slice(2);

if (moduleNames.length === 0) {
  console.error("❌ Please provide at least one module name.");
  process.exit(1);
}

const baseDir = path.join(__dirname, "../src/app");
const indexFilePath = path.join(__dirname, "../src/index.ts");

moduleNames.forEach((moduleName) => {
  const capitalizedModuleName = capitalize(moduleName);
  const moduleLower = moduleName.charAt(0).toLowerCase() + moduleName.slice(1);

  const moduleDir = path.join(baseDir, moduleLower);

  if (!fs.existsSync(moduleDir)) {
    fs.mkdirSync(moduleDir, { recursive: true });
  }

  //================ model.ts ======================
  const modelContent = `
import mongoose, { Schema, model, Document } from "mongoose";

interface I${capitalizedModuleName} extends Document {
  titleEn: string;
  // slug: string;
  description: string;
  shortDescription: string;
  display: boolean;
  img: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  metaImg: string;
  youtubeVideos: string[];
}

const ${capitalizedModuleName}Schema = new Schema<I${capitalizedModuleName}>({
  titleEn: { type: String, required: true },
  // slug: { type: String, required: true, unique: true },
  description: { type: String },
  shortDescription: { type: String },
  display: { type: Boolean },
  img: { type: String },
  metaTitle: { type: String },
  metaDescription: { type: String },
  keywords: { type: [String] },
  metaImg: { type: String },
  youtubeVideos: { type: [String], default: [] },
}, { timestamps: true });

${capitalizedModuleName}Schema.index({ titleEn: "text" });
// ${capitalizedModuleName}Schema.index({ slug: 1 });

// ${capitalizedModuleName}Schema.pre("save", async function (next) {
//  const doc = this as unknown as I${capitalizedModuleName};
// if (!doc.isModified("slug")) return next();
// let slug = doc.slug;
// let counter = 1;
// while (await mongoose.models.${capitalizedModuleName}.exists({ slug })) {
// slug = \`\${doc.slug}-\${counter++}\`;
// }
// doc.slug = slug;
// next();
// });

export const ${capitalizedModuleName} = model<I${capitalizedModuleName}>("${capitalizedModuleName}", ${capitalizedModuleName}Schema);
`;

  fs.writeFileSync(path.join(moduleDir, `model.ts`), modelContent);

  const controllerContent = `
import { Request, Response } from "express";
import { ${capitalizedModuleName} as Model } from "./model";

//===================== Admin Controllers =====================

export const create = async (req: Request, res: Response) => {
  try {
    const item = await Model.create(req.body);
    res.status(201).json({ message: "${capitalizedModuleName} created successfully!", item });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Failed to create ${capitalizedModuleName}.", error: error.message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await Model.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: "${capitalizedModuleName} not found." });
    res.status(200).json({ message: "${capitalizedModuleName} updated successfully!", item });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Failed to update ${capitalizedModuleName}.", error: error.message });
  }
};

export const allForAdminIndexPage = async (req: Request, res: Response) => {
  try {
    const items = await Model.find().select("title").sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch ${capitalizedModuleName}s.", error: error.message });
  }
};

export const singleForEditPage = async (req: Request, res: Response) => {
  try {
    const item = await Model.findOne({ _id: req.params.id });
    res.status(200).json(item);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch ${capitalizedModuleName}.", error: error.message });
  }
};

// ================== User Controllers ======================

export const allForUserIndexPage = async (req: Request, res: Response) => {
  try {
    const items = await Model.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch ${capitalizedModuleName}s.", error: error.message });
  }
};

export const allSlugsForUserIndexPage = async (req: Request, res: Response) => {
  try {
    const items = await Model.find({ display: true }, "slug -_id");
    res.status(200).json({ message: "${capitalizedModuleName} slugs fetched successfully!", items });
  } catch (error) {
    console.error("Failed to fetch slugs:", error);
    res.status(500).json({ message: "Failed to fetch ${capitalizedModuleName} slugs." });
  }
};

export const singleForUserForDetailsPageBySlug = async (req: Request, res: Response) => {
  try {
    const item = await Model.findOne({ slug: req.params.slug });
    if (!item) {
      return res.status(404).json({ message: "Oops! ${capitalizedModuleName} not found.", item: null });
    }
    res.status(200).json(item);
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch ${capitalizedModuleName}.", error: error.message });
  }
};
`;

  fs.writeFileSync(path.join(moduleDir, `controller.ts`), controllerContent);

  //=================== routes.ts =======================
  const routesContent = `
import { Router } from "express";
import {
  allForAdminIndexPage,
  create,
  singleForEditPage,
  update,
  allForUserIndexPage,
  singleForUserForDetailsPageBySlug,
  allSlugsForUserIndexPage
} from "./controller";
import { verifyAdminToken, verifyUserToken } from "../user/middlewares";
import { deleteById } from "../shared/reusableControllers";
import { ${capitalizedModuleName} } from "./model";

const router = Router();

//====================== For User ======================
// router.get("/allForUserIndexPage", allForUserIndexPage);
// router.get("/allSlugsForUserIndexPage", allSlugsForUserIndexPage);
// router.get("/singleForUserForDetailsPageBySlug/:slug", singleForUserForDetailsPageBySlug);

//====================== For Admin =====================
router.post("/create", verifyAdminToken, create);
// router.get("/allForAdminIndexPage", verifyAdminToken, allForAdminIndexPage);
// router.get("/singleForEditPage/:id", verifyAdminToken, singleForEditPage);
// router.put("/update/:id", verifyAdminToken, update);
// router.delete("/delete/:id", verifyAdminToken, deleteById(${capitalizedModuleName}));

export default router;
`;

  fs.writeFileSync(path.join(moduleDir, `routes.ts`), routesContent);

  //================== update index.ts ===================
  const routeImportStatement = `import ${moduleLower}Routes from "./app/${moduleLower}/routes";`;
  const routeUsageStatement = `app.use("/${moduleLower}", ${moduleLower}Routes);`;

  let indexFileContent = fs.readFileSync(indexFilePath, "utf-8");

  if (!indexFileContent.includes(routeImportStatement)) {
    const importInsertPos = indexFileContent.indexOf("// ImportRoutes");
    if (importInsertPos !== -1) {
      indexFileContent =
        indexFileContent.slice(0, importInsertPos + 15) +
        `\n${routeImportStatement}` +
        indexFileContent.slice(importInsertPos + 15);
    }

    const useRoutesInsertPos = indexFileContent.indexOf("// UseRoutes");
    if (useRoutesInsertPos !== -1) {
      indexFileContent =
        indexFileContent.slice(0, useRoutesInsertPos + 12) +
        `\n${routeUsageStatement}` +
        indexFileContent.slice(useRoutesInsertPos + 12);
    }

    indexFileContent = indexFileContent.replace(/\n{2,}/g, "\n");
    fs.writeFileSync(indexFilePath, indexFileContent);
    console.log(`✅ Added route for "${moduleName}" in index.ts`);
  } else {
    console.log(`⚠️ Route for "${moduleName}" already exists in index.ts`);
  }

  console.log(`✅ Module "${moduleName}" created successfully!`);
});

console.log("✅ All modules have been created successfully.");
