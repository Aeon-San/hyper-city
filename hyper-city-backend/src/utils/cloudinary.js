import { v2 as cloudinary } from "cloudinary";

const ensureCloudinaryConfig = () => {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
        throw new Error(
            "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME (or CLOUDINARY_NAME), CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET (or CLOUDINARY_SECRET)."
        );
    }

    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
    });
};

const uploadImageBuffer = (buffer, folder) => {
    ensureCloudinaryConfig();

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: "image",
            },
            (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve({
                    url: result.secure_url,
                    publicId: result.public_id,
                });
            }
        );

        uploadStream.end(buffer);
    });
};

const uploadManyImages = async (files = [], folder) => {
    if (!files.length) {
        return [];
    }

    const uploads = files.map((file) => uploadImageBuffer(file.buffer, folder));
    return Promise.all(uploads);
};

export { uploadManyImages };
