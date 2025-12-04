import type { UserListEntry } from "../models/UserListEntry";

export const mockUserList: UserListEntry[] = [
  { plate: '1023', role: "user", blocked: false, name: "Jan Kowalski", mail: "jan.kowalski@example.com" },
  { plate: '2045', role: "admin", blocked: true, name: "Anna Nowak", mail: "anna.nowak@example.com" },
  { plate: '3098', role: "user", blocked: true, name: "Piotr Zieliński", mail: "piotr.zielinski@example.com" },
  { plate: '4501', role: "user", blocked: false, name: "Maria Wiśniewska", mail: "maria.wisniewska@example.com" }
];
