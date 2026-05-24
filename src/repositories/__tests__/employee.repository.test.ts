jest.mock("../../lib/prisma", () => ({
  prisma: mockPrisma,
}));

import { mockPrisma } from "../../__mocks__/prisma";

import { EmployeeRepository } from "../employee.repository";

describe("EmployeeRepository", () => {
  let repository: EmployeeRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new EmployeeRepository();
  });

  const mockEmployee = {
    id: 1,
    fullName: "Jane Doe",
    email: "jane@example.com",
    jobTitle: "Engineer",
    country: "US",
    department: "Engineering",
    salary: 95000,
    joiningDate: new Date("2022-01-15"),
    employmentType: "FULL_TIME",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe("create", () => {
    it("should create and return an employee", async () => {
      mockPrisma.employee.create.mockResolvedValue(mockEmployee);

      const data = {
        fullName: "Jane Doe",
        email: "jane@example.com",
        jobTitle: "Engineer",
        country: "US",
        department: "Engineering",
        salary: 95000,
        joiningDate: new Date("2022-01-15"),
        employmentType: "FULL_TIME",
      };

      const result = await repository.create(data);

      expect(mockPrisma.employee.create).toHaveBeenCalledWith({ data });
      expect(result).toEqual(mockEmployee);
    });
  });

  describe("findById", () => {
    it("should find and return an employee by id", async () => {
      mockPrisma.employee.findUnique.mockResolvedValue(mockEmployee);

      const result = await repository.findById(1);

      expect(mockPrisma.employee.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockEmployee);
    });

    it("should return null when employee not found", async () => {
      mockPrisma.employee.findUnique.mockResolvedValue(null);

      const result = await repository.findById(999);

      expect(result).toBeNull();
    });
  });

  describe("findMany", () => {
    it("should return all employees with pagination", async () => {
      const employees = [mockEmployee, { ...mockEmployee, id: 2 }];
      mockPrisma.employee.findMany.mockResolvedValue(employees);

      const result = await repository.findMany({ skip: 0, take: 10 });

      expect(mockPrisma.employee.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
      });
      expect(result).toEqual(employees);
    });

    it("should return all employees without options", async () => {
      const employees = [mockEmployee];
      mockPrisma.employee.findMany.mockResolvedValue(employees);

      const result = await repository.findMany();

      expect(mockPrisma.employee.findMany).toHaveBeenCalledWith({});
      expect(result).toEqual(employees);
    });
  });

  describe("count", () => {
    it("should return the total employee count", async () => {
      mockPrisma.employee.count.mockResolvedValue(42);

      const result = await repository.count();

      expect(mockPrisma.employee.count).toHaveBeenCalled();
      expect(result).toBe(42);
    });
  });

  describe("update", () => {
    it("should update and return the employee", async () => {
      const updated = { ...mockEmployee, salary: 105000 };
      mockPrisma.employee.update.mockResolvedValue(updated);

      const result = await repository.update(1, { salary: 105000 });

      expect(mockPrisma.employee.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { salary: 105000 },
      });
      expect(result).toEqual(updated);
    });

    it("should return null on update error", async () => {
      mockPrisma.employee.update.mockRejectedValue(new Error("Update failed"));

      const result = await repository.update(1, { salary: 105000 });

      expect(result).toBeNull();
    });
  });

  describe("delete", () => {
    it("should delete and return the employee", async () => {
      mockPrisma.employee.delete.mockResolvedValue(mockEmployee);

      const result = await repository.delete(1);

      expect(mockPrisma.employee.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(result).toEqual(mockEmployee);
    });

    it("should return null on delete error", async () => {
      mockPrisma.employee.delete.mockRejectedValue(new Error("Delete failed"));

      const result = await repository.delete(999);

      expect(result).toBeNull();
    });
  });
});
