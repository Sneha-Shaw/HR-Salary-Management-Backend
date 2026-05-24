import { PrismaClient } from "@prisma/client";
import { readFile } from "fs/promises";

const prisma = new PrismaClient();
const recordCount = 10000;

const jobTitles = [
  "Software Engineer",
  "Product Manager",
  "Data Analyst",
  "HR Specialist",
  "Sales Executive",
  "Customer Success Manager",
  "Finance Analyst",
  "Operations Coordinator",
  "Marketing Specialist",
  "Recruiter",
];

const countries = [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "Australia",
  "India",
  "Brazil",
  "Netherlands",
  "France",
  "Spain",
];

const departments = [
  "Engineering",
  "Product",
  "Sales",
  "Marketing",
  "People",
  "Finance",
  "Operations",
  "Customer Success",
  "Legal",
  "Design",
];

const employmentTypes = [
  "FULL_TIME",
  "PART_TIME",
  "CONTRACT",
  "TEMPORARY",
  "INTERN",
];

function pick<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function randomSalary() {
  return Number((40000 + Math.random() * 160000).toFixed(2));
}

function randomDate(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
}

async function loadNames(fileName: string) {
  const content = await readFile(
    new URL(`../${fileName}`, import.meta.url),
    "utf-8",
  );
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

async function run() {
  const firstNames = await loadNames("first_names.txt");
  const lastNames = await loadNames("last_names.txt");

  if (firstNames.length === 0 || lastNames.length === 0) {
    throw new Error(
      "first_names.txt and last_names.txt must contain at least one name each.",
    );
  }

  const employees = Array.from({ length: recordCount }, (_, index) => {
    const firstName = pick(firstNames);
    const lastName = pick(lastNames);
    const fullName = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${index}@example.com`;
    const joiningDate = randomDate(
      new Date(2015, 0, 1),
      new Date(),
    ).toISOString();

    return {
      fullName,
      email,
      jobTitle: pick(jobTitles),
      country: pick(countries),
      department: pick(departments),
      salary: randomSalary(),
      joiningDate,
      employmentType: pick(employmentTypes),
    };
  });

  console.log(
    `Seeding ${employees.length} employees using a single createMany batch...`,
  );
  const result = await prisma.employee.createMany({ data: employees });
  console.log(`Inserted ${result.count} employees.`);
}

run()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
