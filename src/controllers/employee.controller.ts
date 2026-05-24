import type { Request, Response, NextFunction } from "express";
import employeeService from "../services/employee.service.js";
import {
  employeePayloadSchema,
  paginationSchema,
  paramsSchema,
} from "../validations/employee.validation.js";

export async function listEmployees(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const parsed = paginationSchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.errors });
    }

    const result = await employeeService.list(
      parsed.data.page,
      parsed.data.limit,
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getEmployeeById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const parsedParams = paramsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      return res.status(400).json({ errors: parsedParams.error.errors });
    }

    const employee = await employeeService.getById(parsedParams.data.id);
    if (!employee) {
      return res.status(404).json({ error: "Employee not found." });
    }

    res.json(employee);
  } catch (error) {
    next(error);
  }
}

export async function createEmployee(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const validation = employeePayloadSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.errors });
    }

    const created = await employeeService.create(validation.data);
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
}

export async function updateEmployee(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const parsedParams = paramsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      return res.status(400).json({ errors: parsedParams.error.errors });
    }

    const validation = employeePayloadSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.errors });
    }

    const updated = await employeeService.update(
      parsedParams.data.id,
      validation.data,
    );
    if (!updated) {
      return res.status(404).json({ error: "Employee not found." });
    }

    res.json(updated);
  } catch (error) {
    next(error);
  }
}

export async function deleteEmployee(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const parsedParams = paramsSchema.safeParse(req.params);
    if (!parsedParams.success) {
      return res.status(400).json({ errors: parsedParams.error.errors });
    }

    const deleted = await employeeService.delete(parsedParams.data.id);
    if (!deleted) {
      return res.status(404).json({ error: "Employee not found." });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
