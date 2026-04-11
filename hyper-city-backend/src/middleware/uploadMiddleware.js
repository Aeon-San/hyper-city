import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
    if (file.mimetype?.startsWith("image/")) {
        cb(null, true);
        return;
    }

    cb(new Error("Only image files are allowed"));
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});

const uploadServiceImages = upload.array("images", 6);
const uploadReviewImages = upload.array("images", 4);

export { uploadServiceImages, uploadReviewImages };
