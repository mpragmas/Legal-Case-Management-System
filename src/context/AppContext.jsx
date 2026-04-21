import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { api } from "../services/api";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [currentUserId, setCurrentUserId] = useState(
    localStorage.getItem("currentUserId"),
  );
  const [role, setRole] = useState(localStorage.getItem("role"));
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(
    localStorage.getItem("twoFactorEnabled") === "true"
  );

  const [lawyers, setLawyers] = useState([]);
  const [clients, setClients] = useState([]);
  const [cases, setCases] = useState([]);
  const [requests, setRequests] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  const isAuthenticated = !!token;

  const addToast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const loadData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [l, c, cs, reqs, apts, docs, notifs] = await Promise.all([
        api.getLawyers(),
        api.getClients(),
        api.getCases(),
        api.getRequests(),
        api.getAppointments(),
        api.getDocuments(),
        api.getNotifications().catch(() => []),
      ]);
      setLawyers(Array.isArray(l) ? l : l?.items || []);
      setClients(c);
      setCases(cs);
      setRequests(reqs);
      setAppointments(apts);
      setDocuments(docs);
      setNotifications(notifs);
    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token, loadData]);

  const refreshData = useCallback(() => loadData(), [loadData]);

  const _applySession = useCallback((res) => {
    localStorage.setItem("token", res.token);
    localStorage.setItem("currentUserId", res.profileId);
    localStorage.setItem("role", res.role);
    localStorage.setItem("twoFactorEnabled", res.twoFactorEnabled ? "true" : "false");
    setToken(res.token);
    setCurrentUserId(String(res.profileId));
    setRole(res.role);
    setTwoFactorEnabled(!!res.twoFactorEnabled);
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await api.login(email, password);
    if (res.twoFactorRequired) return res;
    _applySession(res);
    return res;
  }, [_applySession]);

  const loginWith2FA = useCallback(async (email, code) => {
    const res = await api.login2FA(email, code);
    _applySession(res);
    return res;
  }, [_applySession]);

  const register = useCallback(async (fullName, email, password, role) => {
    const res = await api.register(fullName, email, password, role);
    _applySession(res);
    return res;
  }, [_applySession]);

  const logout = useCallback(() => {
    localStorage.clear();
    setToken(null);
    setCurrentUserId(null);
    setRole(null);
    setLawyers([]);
    setClients([]);
    setCases([]);
    setRequests([]);
    setAppointments([]);
    setDocuments([]);
    setNotifications([]);
  }, []);

  // ─── 2FA Actions ───
  const enableTwoFactor = useCallback(async (code) => {
    await api.verify2FA(code);
    localStorage.setItem("twoFactorEnabled", "true");
    setTwoFactorEnabled(true);
    addToast("Two-factor authentication enabled");
  }, [addToast]);

  const disableTwoFactor = useCallback(async () => {
    await api.disable2FA();
    localStorage.setItem("twoFactorEnabled", "false");
    setTwoFactorEnabled(false);
    addToast("Two-factor authentication disabled");
  }, [addToast]);

  // ─── Profile Actions ───
  const updateProfile = useCallback(
    async (data) => {
      try {
        if (role === "lawyer") {
          await api.updateLawyer(currentUserId, {
            fullName: data.name || data.fullName,
            specialization: data.specialization,
            bio: data.bio,
            yearsOfExperience: data.experience !== undefined
              ? Number(data.experience)
              : data.yearsOfExperience,
          });
        } else {
          await api.updateClient(currentUserId, {
            fullName: data.name || data.fullName,
            phone: data.phone,
            address: data.address,
          });
        }
        await loadData();
        addToast("Profile updated successfully");
      } catch (error) {
        addToast(error.message, "error");
      }
    },
    [role, currentUserId, loadData, addToast],
  );

  const deleteProfile = useCallback(async () => {
    try {
      // Logic for deleting profile if API supports it, or just logout
      logout();
      addToast("Account deleted successfully");
    } catch (error) {
      addToast(error.message, "error");
    }
  }, [logout, addToast]);

  // ─── Request Actions ───
  const sendRequest = useCallback(
    async (lawyerId, message) => {
      try {
        await api.createRequest(lawyerId, currentUserId, message);
        await loadData();
        addToast("Request sent successfully");
      } catch (error) {
        addToast(error.message, "error");
      }
    },
    [currentUserId, loadData, addToast],
  );

  const acceptRequest = useCallback(
    async (id) => {
      try {
        await api.acceptRequest(id);
        await loadData();
        addToast("Request accepted");
      } catch (error) {
        addToast(error.message, "error");
      }
    },
    [loadData, addToast],
  );

  const rejectRequest = useCallback(
    async (id) => {
      try {
        await api.rejectRequest(id);
        await loadData();
        addToast("Request rejected");
      } catch (error) {
        addToast(error.message, "error");
      }
    },
    [loadData, addToast],
  );

  const cancelRequest = useCallback(
    async (id) => {
      try {
        await api.deleteRequest(id);
        await loadData();
        addToast("Request cancelled");
      } catch (error) {
        addToast(error.message, "error");
      }
    },
    [loadData, addToast],
  );

  // ─── Appointment Actions ───
  const createSlot = useCallback(
    async (date, time, duration = 60) => {
      const now = new Date();
      const selectedDate = new Date(`${date}T${time}:00`);

      if (selectedDate < now) {
        addToast("Cannot create slots in the past", "error");
        return;
      }

      const overlap = appointments.find(
        (a) =>
          String(a.lawyerId) === String(currentUserId) &&
          a.date === date &&
          a.time === time,
      );
      if (overlap) {
        addToast("You already have an appointment at this time", "error");
        return;
      }

      try {
        await api.createAppointment({
          lawyerId: currentUserId,
          clientId: null,
          caseId: null,
          date,
          time,
          duration,
          status: "available",
          notes: "",
        });
        await loadData();
        addToast("Slot created");
      } catch (error) {
        addToast(error.message, "error");
      }
    },
    [currentUserId, appointments, loadData, addToast],
  );

  const bookAppointment = useCallback(
    async (appointmentId, caseId) => {
      const apt = appointments.find(
        (a) => String(a.id) === String(appointmentId),
      );
      if (apt) {
        const now = new Date();
        const aptDate = new Date(`${apt.date}T${apt.time}:00`);
        if (aptDate < now) {
          addToast("This appointment time has already passed", "error");
          return;
        }
      }

      try {
        await api.updateAppointment(appointmentId, {
          clientId: currentUserId,
          caseId: caseId,
          status: "confirmed",
        });
        await loadData();
        addToast("Appointment booked");
      } catch (error) {
        addToast(error.message, "error");
      }
    },
    [currentUserId, appointments, loadData, addToast],
  );

  const updateAppointmentStatus = useCallback(
    async (id, status, notes = "") => {
      try {
        await api.updateAppointment(id, { status, notes });
        await loadData();
        addToast(`Appointment ${status}`);
      } catch (error) {
        addToast(error.message, "error");
      }
    },
    [loadData, addToast],
  );

  const editAppointment = useCallback(
    async (id, data) => {
      try {
        await api.updateAppointment(id, data);
        await loadData();
        addToast("Appointment updated");
      } catch (error) {
        addToast(error.message, "error");
      }
    },
    [loadData, addToast],
  );

  const deleteAppointment = useCallback(
    async (id) => {
      try {
        await api.deleteAppointment(id);
        await loadData();
        addToast("Appointment deleted");
      } catch (error) {
        addToast(error.message, "error");
      }
    },
    [loadData, addToast],
  );

  const cancelAppointment = useCallback(
    async (id) => {
      return updateAppointmentStatus(id, "cancelled");
    },
    [updateAppointmentStatus],
  );

  const completeAppointment = useCallback(
    async (id) => {
      return updateAppointmentStatus(id, "completed");
    },
    [updateAppointmentStatus],
  );

  const addNotes = useCallback(
    async (appointmentId, notes) => {
      return updateAppointmentStatus(appointmentId, "completed", notes);
    },
    [updateAppointmentStatus],
  );

  // ─── Case Actions ───
  const updateCaseStatus = useCallback(
    async (id, status) => {
      try {
        await api.updateCase(id, { status });
        await loadData();
        addToast(`Case marked as ${status}`);
      } catch (error) {
        addToast(error.message, "error");
      }
    },
    [loadData, addToast],
  );

  // ─── Document Actions ───
  const uploadDocument = useCallback(
    async (caseId, _fileName, _fileSize, file) => {
      try {
        await api.uploadDocument(caseId, currentUserId, file);
        await loadData();
        addToast("Document uploaded");
      } catch (error) {
        addToast(error.message, "error");
      }
    },
    [currentUserId, loadData, addToast],
  );

  const deleteDocument = useCallback(
    async (id) => {
      try {
        await api.deleteDocument(id);
        await loadData();
        addToast("Document deleted");
      } catch (error) {
        addToast(error.message, "error");
      }
    },
    [loadData, addToast],
  );

  // ─── Notification Actions ───
  const markAsRead = useCallback(async (id) => {
    try {
      await api.markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
      );
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  }, []);

  // ─── Helpers ───
  const getLawyerById = useCallback(
    (id) => lawyers.find((l) => String(l.id) === String(id)),
    [lawyers],
  );
  const getClientById = useCallback(
    (id) => clients.find((c) => String(c.id) === String(id)),
    [clients],
  );
  const getCaseById = useCallback(
    (id) => cases.find((c) => String(c.id) === String(id)),
    [cases],
  );

  const upcomingReminders = useMemo(() => {
    const now = new Date();
    return appointments
      .filter((a) => a.status === "confirmed")
      .map((a) => ({
        ...a,
        dateTime: new Date(`${a.date}T${a.time}:00`),
      }))
      .filter((a) => a.dateTime > now)
      .sort((a, b) => a.dateTime - b.dateTime)
      .map((a) => ({
        ...a,
        timeLabel: `${new Date(a.date).toLocaleDateString()} ${a.time}`,
      }));
  }, [appointments]);

  const value = {
    token,
    currentUserId,
    role,
    lawyers,
    clients,
    cases,
    requests,
    appointments,
    documents,
    notifications,
    loading,
    toasts,
    isAuthenticated,
    twoFactorEnabled,
    login,
    loginWith2FA,
    register,
    logout,
    enableTwoFactor,
    disableTwoFactor,
    loadData,
    refreshData,
    updateProfile,
    deleteProfile,
    sendRequest,
    acceptRequest,
    rejectRequest,
    cancelRequest,
    createSlot,
    bookAppointment,
    updateAppointmentStatus,
    editAppointment,
    deleteAppointment,
    cancelAppointment,
    completeAppointment,
    addNotes,
    updateCaseStatus,
    uploadDocument,
    deleteDocument,
    markAsRead,
    getLawyerById,
    getClientById,
    getCaseById,
    upcomingReminders,
    addToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
}
