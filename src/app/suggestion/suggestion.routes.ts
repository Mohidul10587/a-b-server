import express from "express";
import {
  getAllSuggestions,
  getSuggestionById,
  create,
  deleteSuggestion,
  update,
  allForAdminIndexPage,
  singleForEditPage,
} from "./suggestion.controller";
import { verifyAdminToken } from "../user/middlewares";

const router = express.Router();
router.get("/", getAllSuggestions);
router.get("/allForAdminIndexPage", allForAdminIndexPage);
router.get("/singleForEditPage/:id", verifyAdminToken, singleForEditPage);

router.get("/getSingleSuggestion/:id", getSuggestionById);
router.post("/create", create);
router.delete("/:id", deleteSuggestion);
router.put("/update/:id", update);

export default router;
