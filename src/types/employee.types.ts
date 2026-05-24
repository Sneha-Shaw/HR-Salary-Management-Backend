export type EmployeePayload = {
  fullName: string;
  email: string;
  jobTitle: string;
  country: string;
  department: string;
  salary: number;
  joiningDate: Date;
  employmentType: string;
};

export type EmployeeUpdatePayload = Partial<EmployeePayload>;
