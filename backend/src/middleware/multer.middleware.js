import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    // cb(null, `${Date.now()}-${file.originalname}`);
    const ext = path.extname(file.originalname || "").toLowerCase();
    const safeExt = [".jpeg", ".jpg", ".png", ".gif", ".webp"].includes(ext)
      ? ext
      : "";
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${safeExt}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only images are allowed (jpeg, jpg, png, gif, webp)"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB limit
});
