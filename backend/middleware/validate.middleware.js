import { ZodError } from "zod";

// ── Request Body Validation ───────────────────────────────────────────────────
// Usage: router.post("/signup", validate(signupSchema), signupController)
export const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    // Sanitized + validated data replace kar do
    req.body = result.data;
    next();
  };
};

// ── Query Params Validation ───────────────────────────────────────────────────
// Usage: router.get("/search", validateQuery(searchSchema), searchController)
export const validateQuery = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    req.query = result.data;
    next();
  };
};

// ── Params Validation ─────────────────────────────────────────────────────────
// Usage: router.get("/:id", validateParams(idSchema), getController)
export const validateParams = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    req.params = result.data;
    next();
  };
};