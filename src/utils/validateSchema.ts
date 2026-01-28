import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validateSchema =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const formatted = result.error.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      }));

      return res.status(400).json({
        message: "Validation error",
        errors: formatted,
      });
    }
    req.body = result.data;
    next();
  };
