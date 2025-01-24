import express from "express";
import {
  create,
  getAll,
  getOne,
  update,
  remove,
  // searchGallery,
} from "./gallery.controller";

import verifyToken from "../admin/admin.middleware";

const router = express.Router();

// Create a new Meta a
router.post("/create", create);
router.get("/all", getAll);
// router.get("/search", searchGallery);
router.get("/:id", getOne);
router.put("/:id", update);
router.delete("/:id", remove);

export default router;
