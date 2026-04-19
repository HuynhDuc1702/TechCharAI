import cloudinary from "../lib/cloudinary";


export const uploadImageBuffer = (
    buffer: Buffer,
    mimeType: string
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "techchar",
                resource_type: "image",
                format: mimeType.split("/")[1],
            },
            (error, result) => {
                if (error || !result) {
                    return reject(error ?? new Error("Cloudinary upload failed"));
                }
                resolve(result.secure_url);
            }
        );
        stream.end(buffer);
    });
};


export const deleteImage = async (publicId: string): Promise<void> => {
    await cloudinary.uploader.destroy(publicId);
};
