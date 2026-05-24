import { PrismaClient, Employee } from '@prisma/client';

const prisma = new PrismaClient();

export class EmployeeRepository {
  async create(data: Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>) {
    return prisma.employee.create({ data });
  }

  async findById(id: number) {
    return prisma.employee.findUnique({ where: { id } });
  }

  async listAll() {
    return prisma.employee.findMany();
  }

  // Additional repository methods to be added later.
}

export default new EmployeeRepository();
