import { createContext, useContext, useState, useCallback } from "react";
import {
  lawyersData,
  clientsData,
  requestsData,
  casesData,
  appointmentsData,
  documentsData,
} from "../data/mockData";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Auth / role
  const [role, setRole] = useState("lawyer"); // "lawyer" | "client"
  const [currentUserId, setCurrentUserId] = useState("l1");

  // Data stores
  const [lawyers] = useState(lawyersData);
  const [clients] = useState(clientsData);
  const [requests, setRequests] = useState(requestsData);
  const [cases, setCases] = useState(casesData);
  const [appointments, setAppointments] = useState(appointmentsData);
  const [documents, setDocuments] = useState(documentsData);

  // Toast
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  // Switch role
  const switchRole = useCallback(
    (newRole) => {
      setRole(newRole);
      if (newRole === "lawyer") {
        setCurrentUserId("l1");
      } else {
        setCurrentUserId("c1");
      }
      addToast(`Switched to ${newRole === "lawyer" ? "Lawyer" : "Client"} view`, "info");
    },
    [addToast]
  );

  // ── Request actions ──
  const sendRequest = useCallback(
    (lawyerId, message) => {
      const newReq = {
        id: `r${Date.now()}`,
        clientId: currentUserId,
        lawyerId,
        status: "pending",
        message,
        createdAt: new Date().toISOString(),
      };
      setRequests((prev) => [...prev, newReq]);
      addToast("Request sent successfully!");
    },
    [currentUserId, addToast]
  );

  const acceptRequest = useCallback(
    (requestId) => {
      setRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: "approved" } : r))
      );
      const req = requests.find((r) => r.id === requestId);
      if (req) {
        const newCase = {
          id: `case${Date.now()}`,
          title: `New Case — ${clients.find((c) => c.id === req.clientId)?.name || "Client"}`,
          description: req.message,
          status: "active",
          clientId: req.clientId,
          lawyerId: req.lawyerId,
          requestId: req.id,
          createdAt: new Date().toISOString(),
        };
        setCases((prev) => [...prev, newCase]);
        addToast("Request accepted & case created!");
      }
    },
    [requests, clients, addToast]
  );

  const rejectRequest = useCallback(
    (requestId) => {
      setRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: "rejected" } : r))
      );
      addToast("Request rejected", "warning");
    },
    [addToast]
  );

  // ── Appointment actions ──
  const createSlot = useCallback(
    (date, time, duration = 60) => {
      const newSlot = {
        id: `a${Date.now()}`,
        lawyerId: currentUserId,
        clientId: null,
        caseId: null,
        date,
        time,
        duration,
        status: "available",
        notes: "",
      };
      setAppointments((prev) => [...prev, newSlot]);
      addToast("Appointment slot created!");
    },
    [currentUserId, addToast]
  );

  const bookAppointment = useCallback(
    (appointmentId, caseId) => {
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === appointmentId
            ? { ...a, clientId: currentUserId, caseId, status: "confirmed" }
            : a
        )
      );
      addToast("Appointment booked!");
    },
    [currentUserId, addToast]
  );

  const cancelAppointment = useCallback(
    (appointmentId) => {
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === appointmentId
            ? { ...a, clientId: null, caseId: null, status: "available", notes: "" }
            : a
        )
      );
      addToast("Appointment cancelled", "warning");
    },
    [addToast]
  );

  const completeAppointment = useCallback(
    (appointmentId) => {
      setAppointments((prev) =>
        prev.map((a) =>
          a.id === appointmentId ? { ...a, status: "completed" } : a
        )
      );
      addToast("Appointment marked as completed");
    },
    [addToast]
  );

  const addNotes = useCallback(
    (appointmentId, notes) => {
      setAppointments((prev) =>
        prev.map((a) => (a.id === appointmentId ? { ...a, notes } : a))
      );
      addToast("Notes saved!");
    },
    [addToast]
  );

  // ── Document actions ──
  const uploadDocument = useCallback(
    (caseId, fileName, fileSize) => {
      const newDoc = {
        id: `d${Date.now()}`,
        caseId,
        name: fileName,
        size: fileSize,
        uploadedBy: currentUserId,
        uploadedAt: new Date().toISOString(),
      };
      setDocuments((prev) => [...prev, newDoc]);
      addToast("Document uploaded!");
    },
    [currentUserId, addToast]
  );

  // Helpers
  const getLawyerById = useCallback((id) => lawyers.find((l) => l.id === id), [lawyers]);
  const getClientById = useCallback((id) => clients.find((c) => c.id === id), [clients]);

  const value = {
    role,
    currentUserId,
    switchRole,
    lawyers,
    clients,
    requests,
    cases,
    appointments,
    documents,
    toasts,
    addToast,
    sendRequest,
    acceptRequest,
    rejectRequest,
    createSlot,
    bookAppointment,
    cancelAppointment,
    completeAppointment,
    addNotes,
    uploadDocument,
    getLawyerById,
    getClientById,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
