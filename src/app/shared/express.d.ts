import { Request } from "express";
import { File } from "multer";

declare module "express" {
  interface Request {
    file?: File;
  }
}
