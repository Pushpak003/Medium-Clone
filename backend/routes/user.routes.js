import express from "express";
import {
  getProfileOfUser,
  searchUser,
  writtenBlogsOfUser,
  writtenBlogsOfUserCount,
} from "../controllers/user.controller.js";
import  {protect , optionalAuth } from "../middleware/auth.middleware.js";

const userRouter = express.Router();

userRouter.post("/search", searchUser);
userRouter.post("/profile", getProfileOfUser);

userRouter.post("/written-blogs", protect, writtenBlogsOfUser);
userRouter.post("/written-blogs-count", protect, writtenBlogsOfUserCount);

export default userRouter;
