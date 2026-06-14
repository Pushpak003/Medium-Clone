import express from "express";
import {
  addComment,
  deleteBlog,
  getComments,
  getReplies,
  isLikedByUser,
  likeBlog,
} from "../controllers/blogInteractions.controller.js";
import  {protect , optionalAuth } from "../middleware/auth.middleware.js";

const blogInteractionRouter = express.Router();

blogInteractionRouter.post("/like", protect, likeBlog);
blogInteractionRouter.post("/isLiked", protect, isLikedByUser);

blogInteractionRouter.post("/comment", protect, addComment);
blogInteractionRouter.post("/comment/get", getComments);

blogInteractionRouter.post("/reply", getReplies);

blogInteractionRouter.post("/delete", protect, deleteBlog);

export default blogInteractionRouter;

// Like the blog `${import.meta.env.VITE_BASE_URL}/blog/like`
// Checking if the user has liked that blog - /isLiked
// `${import.meta.env.VITE_BASE_URL}/blog/comment`
