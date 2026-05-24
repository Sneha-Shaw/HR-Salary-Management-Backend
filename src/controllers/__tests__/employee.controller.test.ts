import type { Request, Response, NextFunction } from "express";

// Mock service BEFORE any imports
jest.mock("../../services/employee.service");

import {
  listEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../employee.controller";
import employeeService from "../../services/employee.service";

const mockService = employeeService as jest.Mocked<typeof employeeService>;

describe("EmployeeController", () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;
  let mockNext: NextFunction;

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

  beforeEach(() => {
    jest.clearAllMocks();

    mockReq = {
      query: {},
      params: {},
      body: {},
    };

    mockRes = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn();
  });

  describe("listEmployees", () => {
    it("should return paginated employees", async () => {
      mockReq.query = { page: "1", limit: "10" };
      mockService.list.mockResolvedValue({
        data: [mockEmployee],
        pagination: { page: 1, limit: 10, total: 1, pages: 1 },
      });

      await listEmployees(mockReq as Request, mockRes as Response, mockNext);

      expect(mockService.list).toHaveBeenCalledWith(1, 10);
      expect(mockRes.json).toHaveBeenCalledWith({
        data: [mockEmployee],
        pagination: { page: 1, limit: 10, total: 1, pages: 1 },
      });
    });

    it("should use default pagination", async () => {
      mockReq.query = {};
      (mockService.list as jest.Mock).mockResolvedValue({
        data: [],
        pagination: { page: 1, limit: 10, total: 0, pages: 0 },
      });

      await listEmployees(mockReq as Request, mockRes as Response, mockNext);

      expect(mockService.list).toHaveBeenCalledWith(1, 10);
    });

    it("should handle validation error", async () => {
      mockReq.query = { page: "-1" };

      await listEmployees(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ errors: expect.any(Array) }),
      );
    });

    it("should call next on error", async () => {
      mockReq.query = { page: "1", limit: "10" };
      const error = new Error("Service error");
      (mockService.list as jest.Mock).mockRejectedValue(error);

      await listEmployees(mockReq as Request, mockRes as Response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe("getEmployeeById", () => {
    it("should return employee by id", async () => {
      mockReq.params = { id: "1" };
      mockService.getById.mockResolvedValue(mockEmployee);

      await getEmployeeById(mockReq as Request, mockRes as Response, mockNext);

      expect(mockService.getById).toHaveBeenCalledWith(1);
      expect(mockRes.json).toHaveBeenCalledWith(mockEmployee);
    });

    it("should return 404 when employee not found", async () => {
      mockReq.params = { id: "999" };
      (mockService.getById as jest.Mock).mockResolvedValue(null);

      await getEmployeeById(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Employee not found.",
      });
    });

    it("should return 400 for invalid id", async () => {
      mockReq.params = { id: "invalid" };

      await getEmployeeById(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });

  describe("createEmployee", () => {
    it("should create and return new employee", async () => {
      mockReq.body = {
        fullName: "Jane Doe",
        email: "jane@example.com",
        jobTitle: "Engineer",
        country: "US",
        department: "Engineering",
        salary: 95000,
        joiningDate: "2022-01-15T00:00:00Z",
        employmentType: "FULL_TIME",
      };
      mockService.create.mockResolvedValue(mockEmployee);

      await createEmployee(mockReq as Request, mockRes as Response, mockNext);

      expect(mockService.create).toHaveBeenCalledWith(
        expect.objectContaining({ fullName: "Jane Doe" }),
      );
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith(mockEmployee);
    });

    it("should return 400 for validation error", async () => {
      mockReq.body = { fullName: "Jane Doe" }; // Missing required fields

      await createEmployee(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ errors: expect.any(Array) }),
      );
    });
  });

  describe("updateEmployee", () => {
    it("should update and return employee", async () => {
      mockReq.params = { id: "1" };
      mockReq.body = {
        fullName: "Jane Doe Updated",
        email: "jane@example.com",
        jobTitle: "Senior Engineer",
        country: "US",
        department: "Engineering",
        salary: 105000,
        joiningDate: "2022-01-15T00:00:00Z",
        employmentType: "FULL_TIME",
      };
      const updated = { ...mockEmployee, salary: 105000 };
      (mockService.update as jest.Mock).mockResolvedValue(updated);

      await updateEmployee(mockReq as Request, mockRes as Response, mockNext);

      expect(mockService.update).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ salary: 105000 }),
      );
      expect(mockRes.json).toHaveBeenCalledWith(updated);
    });

    it("should return 404 when employee not found", async () => {
      mockReq.params = { id: "999" };
      mockReq.body = {
        fullName: "Jane Doe",
        email: "jane@example.com",
        jobTitle: "Engineer",
        country: "US",
        department: "Engineering",
        salary: 95000,
        joiningDate: "2022-01-15T00:00:00Z",
        employmentType: "FULL_TIME",
      };
      (mockService.update as jest.Mock).mockResolvedValue(null);

      await updateEmployee(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });
  });

  describe("deleteEmployee", () => {
    it("should delete employee and return 204", async () => {
      mockReq.params = { id: "1" };
      (mockService.delete as jest.Mock).mockResolvedValue(mockEmployee);

      await deleteEmployee(mockReq as Request, mockRes as Response, mockNext);

      expect(mockService.delete).toHaveBeenCalledWith(1);
      expect(mockRes.status).toHaveBeenCalledWith(204);
      expect(mockRes.send).toHaveBeenCalled();
    });

    it("should return 404 when employee not found", async () => {
      mockReq.params = { id: "999" };
      (mockService.delete as jest.Mock).mockResolvedValue(null);

      await deleteEmployee(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
    });

    it("should return 400 for invalid id", async () => {
      mockReq.params = { id: "invalid" };

      await deleteEmployee(mockReq as Request, mockRes as Response, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });
});
