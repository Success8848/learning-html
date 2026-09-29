import type { SystemUser } from "@/types";

export const users: SystemUser[] = [
  { id: "USR-001", name: "Suman Shrestha", email: "suman@traffic.gov.np", role: "ADMIN", status: "active", lastActive: "2026-09-22T15:44:00Z", createdAt: "2026-04-10" },
  { id: "USR-002", name: "Anita Karki", email: "anita@traffic.gov.np", role: "OPERATOR", status: "active", lastActive: "2026-09-22T15:41:00Z", createdAt: "2026-05-16" },
  { id: "USR-003", name: "Rajan Maharjan", email: "rajan@traffic.gov.np", role: "OPERATOR", status: "active", lastActive: "2026-09-22T14:57:00Z", createdAt: "2026-06-02" },
  { id: "USR-004", name: "Mina Gurung", email: "mina@traffic.gov.np", role: "OPERATOR", status: "inactive", lastActive: "2026-09-18T10:20:00Z", createdAt: "2026-06-21" },
];