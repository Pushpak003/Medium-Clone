import express from "express";
import {
  getNotifications,
  getNotificationsCount,
  hasNewNotifications,
} from "../controllers/notification.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const notificationRouter = express.Router();

notificationRouter.get("/", protect, getNotifications);
notificationRouter.post("/count", protect, getNotificationsCount);
notificationRouter.get("/new", protect, hasNewNotifications);

export default notificationRouter;