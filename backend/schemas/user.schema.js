import { z } from "zod";

const urlOrEmpty = z
  .string()
  .trim()
  .refine((val) => val === "" || z.string().url().safeParse(val).success, {
    message: "Must be a valid URL or empty",
  })
  .optional()
  .default("");

export const updateProfileSchema = z.object({
  username: z
    .string({ required_error: "Username is required" })
    .trim()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username cannot exceed 30 characters")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers and underscores"
    ),

  bio: z
    .string()
    .trim()
    .max(200, "Bio cannot exceed 200 characters")
    .optional()
    .default(""),

  social_links: z
    .object({
      youtube: urlOrEmpty,
      instagram: urlOrEmpty,
      facebook: urlOrEmpty,
      twitter: urlOrEmpty,
      github: urlOrEmpty,
      website: urlOrEmpty,
    })
    .optional()
    .default({}),
});

export const updateProfileImageSchema = z.object({
  url: z
    .string({ required_error: "Image URL is required" })
    .trim()
    .url("Must be a valid URL"),
});