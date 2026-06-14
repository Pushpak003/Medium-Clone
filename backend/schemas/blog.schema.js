import { z } from "zod";

// EditorJS content block structure
const editorBlockSchema = z.object({
  id: z.string().optional(),
  type: z.string(),
  data: z.record(z.unknown()),
});

const editorContentSchema = z.object({
  time: z.number().optional(),
  blocks: z
    .array(editorBlockSchema)
    .min(1, "Blog content cannot be empty"),
  version: z.string().optional(),
});

// Draft save — sirf title zaroori hai
export const saveDraftSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .trim()
    .min(1, "Title cannot be empty")
    .max(200, "Title cannot exceed 200 characters"),

  des: z.string().trim().max(200, "Description cannot exceed 200 characters").optional().default(""),
  banner: z.string().trim().url("Banner must be a valid URL").optional().default(""),
  content: editorContentSchema.optional().default({ blocks: [] }),
  tags: z.array(z.string().trim().toLowerCase()).max(10, "Maximum 10 tags allowed").optional().default([]),
  draft: z.literal(true),
  id: z.string().optional(),
});

// Publish — sab fields zaroori hain
export const publishBlogSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .trim()
    .min(1, "Title cannot be empty")
    .max(200, "Title cannot exceed 200 characters"),

  des: z
    .string({ required_error: "Description is required" })
    .trim()
    .min(1, "Description cannot be empty")
    .max(200, "Description cannot exceed 200 characters"),

  banner: z
    .string({ required_error: "Banner image is required" })
    .trim()
    .url("Banner must be a valid URL"),

  content: editorContentSchema,

  tags: z
    .array(z.string().trim().toLowerCase())
    .min(1, "At least one tag is required")
    .max(10, "Maximum 10 tags allowed"),

  draft: z.literal(false).optional().default(false),
  id: z.string().optional(),
});

// Union — draft true ya false ke hisaab se alag schema apply hoga
export const createBlogSchema = z.discriminatedUnion("draft", [
  saveDraftSchema,
  publishBlogSchema,
]);

export const searchBlogsSchema = z.object({
  tag: z.string().trim().toLowerCase().optional(),
  query: z.string().trim().optional(),
  author: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(20).optional(),
  eliminate_blog: z.string().optional(),
});

export const getBlogSchema = z.object({
  blog_id: z.string({ required_error: "Blog ID is required" }).min(1),
  draft: z.boolean().optional(),
  mode: z.enum(["edit", "view"]).optional().default("view"),
});