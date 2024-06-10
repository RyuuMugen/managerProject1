export interface tblEmployee {
  empId: number;
  empNumber: number;
  fullName: string | null;
  otherName: string | null;
  sex: string | null;
  dateOfBirth: string | null;
  ethnic: string | null;
  nationality: string | null;
  religion: string | null;
  nation: string | null;
  province: string | null;
  district: string | null;
  ward: string | null;
  address: string | null;
  healthStatus: string | null;
  height: number;
  weight: number;
  bloodGroup: string | null;
  identifiedNumber: string | null;
  effectiveDate: string | null;
  issuedBy: string | null;
  telephoneNumber: string | null;
  email: string;
  creationDate: string | null;
  createdBy: string | null;
  lastUpdateDate: string | null;
  lastUpdatedBy: string | null;
  lastUpdateLogin: string | null;
  ondelete: string | null;
}

export interface tblEmployeekdol {
  id: number;
  mnv: number;
  name: string | null;
  work_unit_code: string | null;
  job_out_date: string | null;
  email_organ: string | null;
  email_personal: string | null;
}
