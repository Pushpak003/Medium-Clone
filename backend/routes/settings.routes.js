import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { changePassword, updateProfile, updateProfileImg } from "../controllers/settings.controller.js";
import { changePasswordSchema } from "../schemas/auth.schema.js";
import { updateProfileSchema, updateProfileImageSchema } from "../schemas/user.schema.js";

const settingRouter = express.Router();

settingRouter.post("/change-password", protect, validate(changePasswordSchema), changePassword);
settingRouter.post("/update-profile-img", protect, validate(updateProfileImageSchema), updateProfileImg);
settingRouter.post("/update-profile", protect, validate(updateProfileSchema), updateProfile);

export default settingRouter;