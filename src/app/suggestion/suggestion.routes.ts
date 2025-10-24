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
import { deleteById } from "../shared/reusableControllers";
import Suggestion from "./suggestion.model";

const router = express.Router();
router.get("/", getAllSuggestions);
router.get("/allForAdminIndexPage", allForAdminIndexPage);
router.get("/singleForEditPage/:id", verifyAdminToken, singleForEditPage);

router.get("/getSingleSuggestion/:id", getSuggestionById);
router.post("/create", create);
router.delete("/:id", deleteSuggestion);
router.put("/update/:id", update);
router.delete("/delete/:id", verifyAdminToken, deleteById(Suggestion));

export default router;
