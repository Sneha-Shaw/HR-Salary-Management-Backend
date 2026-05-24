import employeeRepository from "./../repositories/employee.repository.js";
import type { Employee } from "@prisma/client";

export class EmployeeService {
  async list(page = 1, limit = 10) {
    const pageNumber = Math.max(1, page);
    const pageSize = Math.max(1, limit);
    const skip = (pageNumber - 1) * pageSize;

    const [data, total] = await Promise.all([
      employeeRepository.findMany({ skip, take: pageSize }),
      employeeRepository.count(),
    ]);

    return {
      data,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        total,
        pages: Math.ceil(total / pageSize),
      },
    };
  }

  async getById(id: number) {
    return employeeRepository.findById(id);
  }

  async create(employee: Omit<Employee, "id" | "createdAt" | "updatedAt">) {
    return employeeRepository.create(employee);
  }

  async update(
    id: number,
    updates: Partial<Omit<Employee, "id" | "createdAt" | "updatedAt">>,
  ) {
    return employeeRepository.update(id, updates);
  }

  async delete(id: number) {
    return employeeRepository.delete(id);
  }
}

export default new EmployeeService();
