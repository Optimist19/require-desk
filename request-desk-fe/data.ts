import { RequestType, Status } from "./types";

export const initialRequests: RequestType[] = [
  {
    id: 1,
    title: "Replace the broken lobby light",
    category: "Facilities",
    submittedBy: "Jordan Lee",
    date: "Today, 9:42 AM",
    status: "Open",
    priority: "High"
  },
  {
    id: 2,
    title: "Add me to the design workspace",
    category: "Access",
    submittedBy: "Taylor Morgan",
    date: "Yesterday",
    status: "In progress",
    priority: "Medium"
  },
  {
    id: 3,
    title: "Printer on floor 2 is out of toner",
    category: "IT & equipment",
    submittedBy: "Sam Rivera",
    date: "Aug 28, 2025",
    status: "Resolved",
    priority: "Low"
  },
  {
    id: 4,
    title: "Request a standing desk",
    category: "Workplace",
    submittedBy: "Alex Chen",
    date: "Aug 27, 2025",
    status: "Open",
    priority: "Medium"
  }
];

