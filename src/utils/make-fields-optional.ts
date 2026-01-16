import { z, ZodRawShape, ZodTypeAny } from "zod";

export const makeFieldsOptional = (fields: ZodRawShape): ZodRawShape => {
  return Object.fromEntries(
    Object.entries(fields).map(([key, schema]) => [
      key,
      (schema as ZodTypeAny).optional(),
    ])
  );
};
