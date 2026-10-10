export type Role = "admin" | "user";
export type Status = "Open" | "In progress" | "Resolved";
export type RequestType = {
  id: number;
  title: string;
  category: string;
  submittedBy: string;
  date: string;
  status: Status;
  priority: "Low" | "Medium" | "High";
};

export interface UserDataType {
  role: Role;
  email: string;
  password: string;
  name: string;
}
