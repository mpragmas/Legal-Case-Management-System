export const usersCredentials = [
  {
    email: "lawyer@example.com",
    password: "password",
    userId: "l1",
    role: "lawyer",
  },
  {
    email: "sarah.mitchell@legaldesk.com",
    password: "password",
    userId: "l1",
    role: "lawyer",
  },
  {
    email: "client@example.com",
    password: "password",
    userId: "c1",
    role: "client",
  },
  {
    email: "michael.torres@email.com",
    password: "password",
    userId: "c1",
    role: "client",
  },
];

export const lawyersData = [
  {
    id: "l1",
    name: "Sarah Mitchell",
    email: "sarah.mitchell@legaldesk.com",
    avatar: "SM",
    specialization: "Corporate Law",
    experience: 12,
    bio: "Sarah is a seasoned corporate attorney with over a decade of experience advising Fortune 500 companies on mergers, acquisitions, and regulatory compliance. She has a proven track record of closing complex multi-million dollar deals.",
    rating: 4.9,
    casesWon: 142,
    maxClients: 2,
  },
  {
    id: "l2",
    name: "David Hernandez",
    email: "david.hernandez@legaldesk.com",
    avatar: "DH",
    specialization: "Criminal Defense",
    experience: 8,
    bio: "David is a passionate criminal defense lawyer who believes in justice for all. He specializes in federal cases and white-collar crime defense, earning recognition for his courtroom prowess.",
    rating: 4.7,
    casesWon: 98,
    maxClients: 2,
  },
  {
    id: "l3",
    name: "Olivia Chen",
    email: "olivia.chen@legaldesk.com",
    avatar: "OC",
    specialization: "Family Law",
    experience: 15,
    bio: "Olivia is one of the most respected family law attorneys in the state. She handles divorce, custody, and adoption cases with empathy and precision, always putting the well-being of families first.",
    rating: 4.8,
    casesWon: 210,
    maxClients: 2,
  },
  {
    id: "l4",
    name: "James Kowalski",
    email: "james.kowalski@legaldesk.com",
    avatar: "JK",
    specialization: "Civil Litigation",
    experience: 10,
    bio: "James brings a strategic, analytical approach to civil litigation. He excels in contract disputes, personal injury, and property law, consistently delivering favorable outcomes for his clients.",
    rating: 4.6,
    casesWon: 115,
    maxClients: 2,
  },
];

// ─── Clients ────────────────────────────────────────────────
export const clientsData = [
  {
    id: "c1",
    name: "Michael Torres",
    email: "michael.torres@email.com",
    avatar: "MT",
    phone: "+1 555-0101",
    address: "742 Maple Avenue, Suite 200, New York, NY 10001",
  },
  {
    id: "c2",
    name: "Emily Watson",
    email: "emily.watson@email.com",
    avatar: "EW",
    phone: "+1 555-0202",
    address: "1580 Oak Lane, Apt 4B, Los Angeles, CA 90015",
  },
];

// ─── Requests ───────────────────────────────────────────────
export const requestsData = [
  {
    id: "r1",
    clientId: "c1",
    lawyerId: "l1",
    status: "approved",
    message:
      "I need legal counsel for a corporate merger involving two subsidiaries.",
    createdAt: "2026-04-01T10:00:00Z",
  },
  {
    id: "r2",
    clientId: "c2",
    lawyerId: "l3",
    status: "approved",
    message: "Seeking representation for a custody arrangement modification.",
    createdAt: "2026-04-03T14:30:00Z",
  },
  {
    id: "r3",
    clientId: "c1",
    lawyerId: "l2",
    status: "pending",
    message:
      "I would like to discuss a federal investigation related to my business.",
    createdAt: "2026-04-10T09:15:00Z",
  },
  {
    id: "r4",
    clientId: "c2",
    lawyerId: "l4",
    status: "pending",
    message: "I have a contract dispute with a former business partner.",
    createdAt: "2026-04-12T16:45:00Z",
  },
];

// ─── Cases ──────────────────────────────────────────────────
export const casesData = [
  {
    id: "case1",
    title: "TechCorp Merger Advisory",
    description:
      "Providing legal counsel and documentation for the merger of TechCorp's North American and European divisions, including regulatory filings and shareholder agreements.",
    status: "active",
    clientId: "c1",
    lawyerId: "l1",
    requestId: "r1",
    createdAt: "2026-04-02T08:00:00Z",
  },
  {
    id: "case2",
    title: "Watson Custody Modification",
    description:
      "Representing the client in modifying the existing custody arrangement. Focus on best-interest-of-the-child standard and updated parenting plans.",
    status: "active",
    clientId: "c2",
    lawyerId: "l3",
    createdAt: "2026-04-04T10:00:00Z",
    requestId: "r2",
  },
];

// Helper: get today's date string and create "near" appointments for demo.
// We build upcoming appointments relative to user's actual current date so
// the reminder system always has something to show.
function todayStr() {
  const d = new Date();
  return d.toISOString().slice(0, 10); // "YYYY-MM-DD"
}
function tomorrowStr() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}
function dayAfterStr() {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return d.toISOString().slice(0, 10);
}

// ─── Appointment Slots ──────────────────────────────────────
export const appointmentsData = [
  // ★ Upcoming TODAY (will trigger reminder)
  {
    id: "a1",
    lawyerId: "l1",
    clientId: "c1",
    caseId: "case1",
    date: todayStr(),
    time: "23:00",
    duration: 60,
    status: "confirmed",
    notes:
      "Reviewed merger timeline and key milestones. Client approved the preliminary due-diligence checklist.",
  },
  // ★ Upcoming TOMORROW (will trigger reminder)
  {
    id: "a3",
    lawyerId: "l3",
    clientId: "c2",
    caseId: "case2",
    date: tomorrowStr(),
    time: "11:00",
    duration: 45,
    status: "confirmed",
    notes: "",
  },
  // Available slots
  {
    id: "a2",
    lawyerId: "l1",
    clientId: null,
    caseId: null,
    date: tomorrowStr(),
    time: "14:00",
    duration: 60,
    status: "available",
    notes: "",
  },
  {
    id: "a4",
    lawyerId: "l1",
    clientId: null,
    caseId: null,
    date: dayAfterStr(),
    time: "09:00",
    duration: 60,
    status: "available",
    notes: "",
  },
  {
    id: "a5",
    lawyerId: "l3",
    clientId: null,
    caseId: null,
    date: dayAfterStr(),
    time: "15:00",
    duration: 45,
    status: "available",
    notes: "",
  },
  {
    id: "a6",
    lawyerId: "l2",
    clientId: null,
    caseId: null,
    date: tomorrowStr(),
    time: "10:00",
    duration: 60,
    status: "available",
    notes: "",
  },
  // Completed (past)
  {
    id: "a7",
    lawyerId: "l1",
    clientId: "c1",
    caseId: "case1",
    date: "2026-04-10",
    time: "10:00",
    duration: 60,
    status: "completed",
    notes:
      "Initial consultation completed. Discussed scope of the merger and legal requirements.",
  },
];

// ─── Documents ──────────────────────────────────────────────
export const documentsData = [
  {
    id: "d1",
    caseId: "case1",
    name: "Merger_Agreement_Draft_v1.pdf",
    size: "2.4 MB",
    uploadedBy: "l1",
    uploadedAt: "2026-04-05T12:00:00Z",
  },
  {
    id: "d2",
    caseId: "case1",
    name: "Due_Diligence_Checklist.xlsx",
    size: "540 KB",
    uploadedBy: "c1",
    uploadedAt: "2026-04-06T09:30:00Z",
  },
  {
    id: "d3",
    caseId: "case2",
    name: "Custody_Modification_Petition.pdf",
    size: "1.1 MB",
    uploadedBy: "l3",
    uploadedAt: "2026-04-07T14:00:00Z",
  },
  {
    id: "d4",
    caseId: "case1",
    name: "Financial_Statements_Q1.pdf",
    size: "3.8 MB",
    uploadedBy: "c1",
    uploadedAt: "2026-04-08T11:00:00Z",
  },
];
