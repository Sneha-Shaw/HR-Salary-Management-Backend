import { PrismaClient, Employee } from "@prisma/client";

const prisma = new PrismaClient();

export class EmployeeRepository {
  async create(data: Omit<Employee, "id" | "createdAt" | "updatedAt">) {
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
    data: Partial<Omit<Employee, "id" | "createdAt" | "updatedAt">>,
  ) {
    try {
      return prisma.employee.update({ where: { id }, data });
    } catch (error) {
      return null;
    }
  }

  async delete(id: number) {
    try {
      return prisma.employee.delete({ where: { id } });
    } catch (error) {
      return null;
    }
  }
}

export default new EmployeeRepository();
