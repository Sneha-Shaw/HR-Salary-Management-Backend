import { EmployeeService } from "../employee.service";

// Mock repository
jest.mock("../../repositories/employee.repository", () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
    findById: jest.fn(),
    findMany: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

const mockRepository = jest.requireMock(
  "../../repositories/employee.repository",
).default as jest.Mocked<any>;

describe("EmployeeService", () => {
  let service: EmployeeService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new EmployeeService();
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

  describe("list", () => {
    it("should return paginated employees with metadata", async () => {
      mockRepository.findMany.mockResolvedValue([mockEmployee]);
      mockRepository.count.mockResolvedValue(1);

      const result = await service.list(1, 10);

      expect(result.data).toEqual([mockEmployee]);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(10);
      expect(result.pagination.total).toBe(1);
      expect(result.pagination.pages).toBe(1);
    });

    it("should use default pagination values", async () => {
      mockRepository.findMany.mockResolvedValue([mockEmployee]);
      mockRepository.count.mockResolvedValue(1);

      await service.list();

      expect(mockRepository.findMany).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
      });
    });

    it("should calculate correct pages", async () => {
      mockRepository.findMany.mockResolvedValue(Array(10).fill(mockEmployee));
      mockRepository.count.mockResolvedValue(35);

      const result = await service.list(2, 10);

      expect(result.pagination.total).toBe(35);
      expect(result.pagination.pages).toBe(4);
    });

    it("should handle zero total employees", async () => {
      mockRepository.findMany.mockResolvedValue([]);
      mockRepository.count.mockResolvedValue(0);

      const result = await service.list(1, 10);

      expect(result.data).toEqual([]);
      expect(result.pagination.pages).toBe(0);
    });
  });

  describe("getById", () => {
    it("should return employee by id", async () => {
      mockRepository.findById.mockResolvedValue(mockEmployee);

      const result = await service.getById(1);

      expect(mockRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockEmployee);
    });

    it("should return null if employee not found", async () => {
      mockRepository.findById.mockResolvedValue(null);

      const result = await service.getById(999);

      expect(result).toBeNull();
    });
  });

  describe("create", () => {
    it("should create and return new employee", async () => {
      mockRepository.create.mockResolvedValue(mockEmployee);

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

      const result = await service.create(data);

      expect(mockRepository.create).toHaveBeenCalledWith(data);
      expect(result).toEqual(mockEmployee);
    });
  });

  describe("update", () => {
    it("should update employee and return updated data", async () => {
      const updated = { ...mockEmployee, salary: 105000 };
      mockRepository.update.mockResolvedValue(updated);

      const result = await service.update(1, { salary: 105000 });

      expect(mockRepository.update).toHaveBeenCalledWith(1, { salary: 105000 });
      expect(result).toEqual(updated);
    });

    it("should return null if update fails", async () => {
      mockRepository.update.mockResolvedValue(null);

      const result = await service.update(999, { salary: 105000 });

      expect(result).toBeNull();
    });
  });

  describe("delete", () => {
    it("should delete employee and return it", async () => {
      mockRepository.delete.mockResolvedValue(mockEmployee);

      const result = await service.delete(1);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockEmployee);
    });

    it("should return null if delete fails", async () => {
      mockRepository.delete.mockResolvedValue(null);

      const result = await service.delete(999);

      expect(result).toBeNull();
    });
  });
});
