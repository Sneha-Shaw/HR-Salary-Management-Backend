import { z } from "zod";

export const employeePayloadSchema = z.object({
  fullName: z.string().min(1, "fullName is required."),
  email: z.string().email("email must be a valid email address."),
  jobTitle: z.string().min(1, "jobTitle is required."),
  country: z.string().min(1, "country is required."),
  department: z.string().min(1, "department is required."),
  salary: z.number({ invalid_type_error: "salary must be a number." }),
  joiningDate: z.preprocess(
    (value) => {
      if (typeof value === "string" || value instanceof String) {
        const date = new Date(value as string);
        return Number.isNaN(date.getTime()) ? value : date;
      }
      return value;
    },
    z.date({
      invalid_type_error: "joiningDate must be a valid ISO date string.",
    }),
  ),
  employmentType: z.string().min(1, "employmentType is required."),
});

export const paginationSchema = z.object({
  page: z
    .preprocess((value) => {
      if (typeof value === "string") return Number(value);
      if (typeof value === "number") return value;
      return 1;
    }, z.number().int().positive())
    .default(1),
  limit: z
    .preprocess((value) => {
      if (typeof value === "string") return Number(value);
      if (typeof value === "number") return value;
      return 10;
    }, z.number().int().positive())
    .default(10),
});

export const paramsSchema = z.object({
  id: z.preprocess((value) => {
    if (typeof value === "string") return Number(value);
    if (typeof value === "number") return value;
    return value;
  }, z.number().int().positive()),
});
