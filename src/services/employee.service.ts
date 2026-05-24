import employeeRepository from "../repositories/employee.repository.js";
import type {
  EmployeePayload,
  EmployeeUpdatePayload,
} from "../types/employee.types.js";

export class EmployeeService {
  constructor(private repository = employeeRepository) {}
  async list(page = 1, limit = 10) {
    const pageNumber = Math.max(1, page);
    const pageSize = Math.max(1, limit);
    const skip = (pageNumber - 1) * pageSize;

    const [data, total] = await Promise.all([
      this.repository.findMany({ skip, take: pageSize }),
      this.repository.count(),
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
    return this.repository.findById(id);
  }

  async create(employee: EmployeePayload) {
    return this.repository.create(employee);
  }

  async update(
    id: number,
    updates: EmployeeUpdatePayload,
  ) {
    return this.repository.update(id, updates);
  }

  async delete(id: number) {
    return this.repository.delete(id);
  }
}

export default new EmployeeService();
