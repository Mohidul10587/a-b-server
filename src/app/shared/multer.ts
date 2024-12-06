// src/config/multer.ts

import multer from "multer";
import path from "path";

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (
      ext !== ".jpg" &&
      ext !== ".jpeg" &&
      ext !== ".png" &&
      ext !== ".svg" &&
      ext !== ".webp" &&
      ext !== ".ico"
    ) {
      return cb(
        new Error(
          "images are allowed and this error comes from multer.js in shared folder"
        )
      );
    }
    cb(null, true);
  },
});

export default upload;
