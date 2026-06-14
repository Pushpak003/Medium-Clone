import express from "express";
import  {protect , optionalAuth } from "../middleware/auth.middleware.js";
import {
  changePassword,
  updateProfile,
  updateProfileImg,
} from "../controllers/settings.controller.js";

const settingRouter = express.Router();

settingRouter.post("/change-password", protect, changePassword);
settingRouter.post("/update-profile-img", protect, updateProfileImg);
settingRouter.post("/update-profile", protect, updateProfile);

export default settingRouter;
// {`${import.meta.env.VITE_BASE_URL}/settings/update-profile-img`}
