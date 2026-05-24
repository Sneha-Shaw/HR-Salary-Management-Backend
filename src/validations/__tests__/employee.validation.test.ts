import {
  employeePayloadSchema,
  paginationSchema,
  paramsSchema,
} from "../employee.validation";

describe("Employee Validation Schemas", () => {
  describe("employeePayloadSchema", () => {
    const validPayload = {
      fullName: "John Doe",
      email: "john@example.com",
      jobTitle: "Software Engineer",
      country: "United States",
      department: "Engineering",
      salary: 95000,
      joiningDate: "2022-01-15T00:00:00Z",
      employmentType: "FULL_TIME",
    };

    it("should validate a correct payload", () => {
      const result = employeePayloadSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.fullName).toBe("John Doe");
        expect(result.data.email).toBe("john@example.com");
      }
    });

    it("should reject payload with missing fullName", () => {
      const { fullName, ...payload } = validPayload;
      const result = employeePayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    it("should reject payload with invalid email", () => {
      const result = employeePayloadSchema.safeParse({
        ...validPayload,
        email: "invalid-email",
      });
      expect(result.success).toBe(false);
    });

    it("should reject payload with non-numeric salary", () => {
      const result = employeePayloadSchema.safeParse({
        ...validPayload,
        salary: "95000",
      });
      expect(result.success).toBe(false);
    });

    it("should reject payload with invalid date format", () => {
      const result = employeePayloadSchema.safeParse({
        ...validPayload,
        joiningDate: "invalid-date",
      });
      expect(result.success).toBe(false);
    });

    it("should convert string date to Date object", () => {
      const result = employeePayloadSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.joiningDate instanceof Date).toBe(true);
      }
    });
  });

  describe("paginationSchema", () => {
    it("should validate correct pagination params", () => {
      const result = paginationSchema.safeParse({ page: 1, limit: 10 });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(10);
      }
    });

    it("should use default values when params are missing", () => {
      const result = paginationSchema.safeParse({});
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(10);
      }
    });

    it("should convert string page to number", () => {
      const result = paginationSchema.safeParse({ page: "2", limit: "20" });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(2);
        expect(result.data.limit).toBe(20);
        expect(typeof result.data.page).toBe("number");
        expect(typeof result.data.limit).toBe("number");
      }
    });

    it("should reject negative page", () => {
      const result = paginationSchema.safeParse({ page: -1, limit: 10 });
      expect(result.success).toBe(false);
    });

    it("should reject zero limit", () => {
      const result = paginationSchema.safeParse({ page: 1, limit: 0 });
      expect(result.success).toBe(false);
    });
  });

  describe("paramsSchema", () => {
    it("should validate a positive integer id", () => {
      const result = paramsSchema.safeParse({ id: 1 });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe(1);
      }
    });

    it("should convert string id to number", () => {
      const result = paramsSchema.safeParse({ id: "42" });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe(42);
        expect(typeof result.data.id).toBe("number");
      }
    });

    it("should reject negative id", () => {
      const result = paramsSchema.safeParse({ id: -1 });
      expect(result.success).toBe(false);
    });

    it("should reject zero id", () => {
      const result = paramsSchema.safeParse({ id: 0 });
      expect(result.success).toBe(false);
    });

    it("should reject non-numeric id", () => {
      const result = paramsSchema.safeParse({ id: "abc" });
      expect(result.success).toBe(false);
    });
  });
});
