import express from "express";
import { getBannerUrl } from "../controllers/blogEditor.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const blogEditorRouter = express.Router();

// POST — body mein base64 image aata hai, GET mein body nahi hoti
blogEditorRouter.post("/get-banner-url", protect, getBannerUrl);

export default blogEditorRouter;