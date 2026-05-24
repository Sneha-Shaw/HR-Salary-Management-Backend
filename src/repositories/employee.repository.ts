import { prisma } from "../lib/prisma.js";
import type {
  EmployeePayload,
  EmployeeUpdatePayload,
} from "../types/employee.types.js";

export class EmployeeRepository {
  async create(data: EmployeePayload) {
    return prisma.employee.create({ data });
  }

  async findById(id: number) {
    return prisma.employee.findUnique({ where: { id } });
  }

  async findMany(options: { skip?: number; take?: number } = {}) {
    return prisma.employee.findMany(options);
  }

  async count() {
    return prisma.employee.count();
  }

  async update(
    id: number,
    data: EmployeeUpdatePayload,
  ) {
    try {
      return await prisma.employee.update({ where: { id }, data });
    } catch (error) {
      return null;
    }
  }

  async delete(id: number) {
    try {
      return await prisma.employee.delete({ where: { id } });
    } catch (error) {
      return null;
    }
  }
}

export default new EmployeeRepository();
