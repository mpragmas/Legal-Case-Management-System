import { createContext, useContext, useState, useCallback, useMemo, useEffect } from "react";
import { api } from "../services/api";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // ── Auth state ──
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!localStorage.getItem("token"));
  const [role, setRole] = useState(() => localStorage.getItem("role"));
  const [currentUserId, setCurrentUserId] = useState(() => {
    const id = localStorage.getItem("profileId");
    return id ? Number(id) : null;
  });
  const [currentUserName, setCurrentUserName] = useState(() => localStorage.getItem("fullName") || "");

  // ── Data stores ──
  const [lawyers, setLawyers] = useState([]);
  const [clients, setClients] = useState([]);
  const [requests, setRequests] = useState([]);
  const [cases, setCases] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  // ── Toast system ──
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  // ── Load all data from API ──
  const loadData = useCallback(async () => {
    if (!localStorage.getItem("token")) return;
    setLoading(true);
    try {
      const [lawyersData, clientsData, requestsData, casesData, appointmentsData, documentsData] =
        await Promise.all([
          api.getLawyers(),
          api.getClients(),
          api.getRequests(),
          api.getCases(),
          api.getAppointments(),
          api.getDocuments(),
        ]);
      setLawyers(lawyersData);
      setClients(clientsData);
      setRequests(requestsData);
      setCases(casesData);
      setAppointments(appointmentsData);
      setDocuments(documentsData);
    } catch (e) {
      // Token may have expired
      if (e.message?.includes("401") || e.message?.includes("Unauthorized")) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line

  useEffect(() => {
    if (isAuthenticated) loadData();
  }, [isAuthenticated, loadData]);

  // ── Auth actions ──
  const login = useCallback(
    async (email, password) => {
      try {
        const data = await api.login(email, password);
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("profileId", String(data.profileId));
        localStorage.setItem("fullName", data.fullName);
        setIsAuthenticated(true);
        setRole(data.role);
        setCurrentUserId(data.profileId);
        setCurrentUserName(data.fullName);
        addToast("Welcome back!", "success");
        return true;
      } catch {
        addToast("Invalid email or password", "error");
        return false;
      }
    },
    [addToast]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("profileId");
    localStorage.removeItem("fullName");
    setIsAuthenticated(false);
    setRole(null);
    setCurrentUserId(null);
    setCurrentUserName("");
    setLawyers([]);
    setClients([]);
    setRequests([]);
    setCases([]);
    setAppointments([]);
    setDocuments([]);
    addToast("Logged out successfully", "info");
  }, [addToast]);

  // ── Register ──
  const register = useCallback(
    async (fullName, email, password, userRole) => {
      try {
        const data = await api.register(fullName, email, password, userRole);
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("profileId", String(data.profileId));
        localStorage.setItem("fullName", data.fullName);
        setIsAuthenticated(true);
        setRole(data.role);
        setCurrentUserId(data.profileId);
        setCurrentUserName(data.fullName);
        addToast("Account created!", "success");
        return true;
      } catch (e) {
        addToast(e.message || "Registration failed", "error");
        return false;
      }
    },
    [addToast]
  );

  // ── Profile actions ──
  const updateProfile = useCallback(
    async (fields) => {
      try {
        if (role === "lawyer") {
          await api.updateLawyer(currentUserId, {
            fullName: fields.name,
            specialization: fields.specialization,
            bio: fields.bio,
            yearsOfExperience: fields.experience,
          });
          setLawyers((prev) =>
            prev.map((l) => (l.id === currentUserId ? { ...l, ...fields } : l))
          );
        } else {
          await api.updateClient(currentUserId, {
            fullName: fields.name,
            phone: fields.phone,
            address: fields.address,
          });
          setClients((prev) =>
            prev.map((c) => (c.id === currentUserId ? { ...c, ...fields } : c))
          );
        }
        addToast("Profile updated successfully!");
      } catch {
        addToast("Failed to update profile", "error");
      }
    },
    [role, currentUserId, addToast]
  );

  const deleteProfile = useCallback(() => {
    addToast("Profile deleted. Logging out...", "warning");
    setTimeout(() => logout(), 1200);
  }, [logout, addToast]);

  // ── Request actions ──
  const sendRequest = useCallback(
    async (lawyerId, message) => {
      try {
        const req = await api.createRequest(lawyerId, currentUserId, message);
        setRequests((prev) => [...prev, req]);
        addToast("Request sent successfully!");
      } catch {
        addToast("Failed to send request", "error");
      }
    },
    [currentUserId, addToast]
  );

  const acceptRequest = useCallback(
    async (requestId) => {
      try {
        await api.acceptRequest(requestId);
        setRequests((prev) =>
          prev.map((r) => (r.id === requestId ? { ...r, status: "approved" } : r))
        );
        const [casesData] = await Promise.all([api.getCases()]);
        setCases(casesData);
        addToast("Request accepted & case created!");
      } catch {
        addToast("Failed to accept request", "error");
      }
    },
    [addToast]
  );

  const rejectRequest = useCallback(
    async (requestId) => {
      try {
        await api.rejectRequest(requestId);
        setRequests((prev) =>
          prev.map((r) => (r.id === requestId ? { ...r, status: "rejected" } : r))
        );
        addToast("Request rejected", "warning");
      } catch {
        addToast("Failed to reject request", "error");
      }
    },
    [addToast]
  );

  const cancelRequest = useCallback(
    async (requestId) => {
      try {
        await api.deleteRequest(requestId);
        setRequests((prev) => prev.filter((r) => r.id !== requestId));
        addToast("Request cancelled");
      } catch {
        addToast("Failed to cancel request", "error");
      }
    },
    [addToast]
  );

  // ── Appointment actions ──
  const createSlot = useCallback(
    async (date, time, duration = 60) => {
      try {
        const apt = await api.createAppointment({
          lawyerId: currentUserId,
          clientId: null,
          caseId: null,
          date,
          time,
          duration,
          status: "available",
          notes: "",
        });
        setAppointments((prev) => [...prev, apt]);
        addToast("Appointment slot created!");
      } catch {
        addToast("Failed to create slot", "error");
      }
    },
    [currentUserId, addToast]
  );

  const bookAppointment = useCallback(
    async (appointmentId) => {
      const apt = appointments.find((a) => a.id === appointmentId);
      if (!apt) return;
      const lawyerCases = cases.filter(
        (c) => c.lawyerId === apt.lawyerId && c.clientId === currentUserId && c.status === "active"
      );
      const defaultCaseId = lawyerCases.length > 0 ? lawyerCases[0].id : null;
      try {
        const updated = await api.updateAppointment(appointmentId, {
          clientId: currentUserId,
          caseId: defaultCaseId,
          status: "confirmed",
        });
        setAppointments((prev) => prev.map((a) => (a.id === appointmentId ? updated : a)));
        addToast("Appointment booked!");
      } catch {
        addToast("Failed to book appointment", "error");
      }
    },
    [currentUserId, cases, appointments, addToast]
  );

  const editAppointment = useCallback(
    async (appointmentId, updates) => {
      try {
        const updated = await api.updateAppointment(appointmentId, updates);
        setAppointments((prev) => prev.map((a) => (a.id === appointmentId ? updated : a)));
        addToast("Appointment updated!");
      } catch {
        addToast("Failed to update appointment", "error");
      }
    },
    [addToast]
  );

  const deleteAppointment = useCallback(
    async (appointmentId) => {
      try {
        await api.deleteAppointment(appointmentId);
        setAppointments((prev) => prev.filter((a) => a.id !== appointmentId));
        addToast("Appointment deleted", "warning");
      } catch {
        addToast("Failed to delete appointment", "error");
      }
    },
    [addToast]
  );

  const cancelAppointment = useCallback(
    async (appointmentId) => {
      try {
        const updated = await api.updateAppointment(appointmentId, {
          status: "available",
          clearClient: true,
          notes: "",
        });
        setAppointments((prev) => prev.map((a) => (a.id === appointmentId ? updated : a)));
        addToast("Appointment cancelled", "warning");
      } catch {
        addToast("Failed to cancel appointment", "error");
      }
    },
    [addToast]
  );

  const completeAppointment = useCallback(
    async (appointmentId) => {
      try {
        const updated = await api.updateAppointment(appointmentId, { status: "completed" });
        setAppointments((prev) => prev.map((a) => (a.id === appointmentId ? updated : a)));
        addToast("Appointment marked as completed");
      } catch {
        addToast("Failed to complete appointment", "error");
      }
    },
    [addToast]
  );

  const addNotes = useCallback(
    async (appointmentId, notes) => {
      try {
        const updated = await api.updateAppointment(appointmentId, { notes });
        setAppointments((prev) => prev.map((a) => (a.id === appointmentId ? updated : a)));
        addToast("Notes saved!");
      } catch {
        addToast("Failed to save notes", "error");
      }
    },
    [addToast]
  );

  // ── Document actions ──
  const uploadDocument = useCallback(
    async (caseId, _fileName, _fileSize, file) => {
      try {
        const doc = await api.uploadDocument(caseId, String(currentUserId), file);
        setDocuments((prev) => [...prev, doc]);
        addToast("Document uploaded!");
      } catch {
        addToast("Failed to upload document", "error");
      }
    },
    [currentUserId, addToast]
  );

  // ── Helpers ──
  const getLawyerById = useCallback((id) => lawyers.find((l) => l.id === id), [lawyers]);
  const getClientById = useCallback((id) => clients.find((c) => c.id === id), [clients]);

  // ── Appointment reminders ──
  const upcomingReminders = useMemo(() => {
    const now = new Date();
    return appointments
      .filter((a) => {
        if (a.status !== "confirmed") return false;
        if (role === "lawyer" && a.lawyerId !== currentUserId) return false;
        if (role === "client" && a.clientId !== currentUserId) return false;
        const aptDate = new Date(`${a.date}T${a.time}:00`);
        const diffMs = aptDate - now;
        return diffMs > -3600000 && diffMs < 48 * 3600000;
      })
      .map((a) => {
        const aptDate = new Date(`${a.date}T${a.time}:00`);
        const diffMs = aptDate - now;
        const diffHours = Math.round(diffMs / 3600000);
        let timeLabel;
        if (diffMs < 0) timeLabel = "Starting now";
        else if (diffHours < 1) timeLabel = `in ${Math.max(1, Math.round(diffMs / 60000))} min`;
        else if (diffHours === 1) timeLabel = "in 1 hour";
        else if (diffHours < 24) timeLabel = `in ${diffHours} hours`;
        else timeLabel = "tomorrow";
        return { ...a, timeLabel };
      })
      .sort((a, b) => new Date(`${a.date}T${a.time}:00`) - new Date(`${b.date}T${b.time}:00`));
  }, [appointments, role, currentUserId]);

  const value = {
    isAuthenticated,
    role,
    currentUserId,
    currentUserName,
    loading,
    login,
    logout,
    register,
    updateProfile,
    deleteProfile,
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
    cancelRequest,
    createSlot,
    bookAppointment,
    editAppointment,
    deleteAppointment,
    cancelAppointment,
    completeAppointment,
    addNotes,
    uploadDocument,
    getLawyerById,
    getClientById,
    upcomingReminders,
    refreshData: loadData,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
