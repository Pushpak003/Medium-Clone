import { cloudinary } from "../config/cloudinary.js";
import { AppError } from "../middleware/error.middleware.js";

export const getBannerUrl = async (req, res, next) => {
  try {
    const { img } = req.body;

    if (!img) {
      return next(new AppError("Image data is required", 400));
    }

    const uploadedResponse = await cloudinary.uploader.upload(img, {
      folder: "medium-clone/banners",
      resource_type: "image",
    });

    return res.status(200).json({ success: true, url: uploadedResponse.secure_url });
  } catch (err) {
    next(err);
  }
};