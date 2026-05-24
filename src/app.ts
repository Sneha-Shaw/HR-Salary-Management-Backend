import express from "express";
import employeeRoutes from "./routes/employee.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";

const app = express();

app.use(express.json());

app.use("/api/employees", employeeRoutes);

app.get("/", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(errorHandler);

export default app;
