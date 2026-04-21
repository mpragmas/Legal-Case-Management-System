const ENV_BASE =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_BASE_URL) ||
  (typeof process !== "undefined" &&
    process.env &&
    process.env.REACT_APP_API_BASE_URL);

const BASE_URL = ENV_BASE || "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("token");
}

async function request(method, path, body, isFormData = false) {
  const headers = {};
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!isFormData) headers["Content-Type"] = "application/json";

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || err.title || `Request failed (${res.status})`);
  }
  return res.json();
}

export const api = {
  // Auth
  login: (email, password) =>
    request("POST", "/auth/login", { email, password }),
  login2FA: (email, code) =>
    request("POST", "/auth/login-2fa", { email, code }),
  register: (fullName, email, password, role) =>
    request("POST", "/auth/register", { fullName, email, password, role }),
  forgotPassword: (email) =>
    request("POST", "/auth/forgot-password", { email }),
  resetPassword: (token, newPassword) =>
    request("POST", "/auth/reset-password", { token, newPassword }),
  enable2FA: () => request("POST", "/auth/2fa/enable"),
  verify2FA: (code) => request("POST", "/auth/2fa/verify", { code }),
  disable2FA: () => request("POST", "/auth/2fa/disable"),
  changePassword: (oldPassword, newPassword) =>
    request("POST", "/auth/change-password", { oldPassword, newPassword }),

  // Lawyers
  getLawyers: () => request("GET", "/lawyers"),
  getLawyer: (id) => request("GET", `/lawyers/${id}`),
  updateLawyer: (id, data) => request("PUT", `/lawyers/${id}`, data),

  // Clients
  getClients: () => request("GET", "/clients"),
  getClient: (id) => request("GET", `/clients/${id}`),
  updateClient: (id, data) => request("PUT", `/clients/${id}`, data),

  // Requests
  getRequests: () => request("GET", "/requests"),
  createRequest: (lawyerId, clientId, message) =>
    request("POST", "/requests", { lawyerId, clientId, message }),
  acceptRequest: (id) => request("PUT", `/requests/${id}/accept`),
  rejectRequest: (id) => request("PUT", `/requests/${id}/reject`),
  deleteRequest: (id) => request("DELETE", `/requests/${id}`),

  // Cases
  getCases: () => request("GET", "/cases"),
  getCase: (id) => request("GET", `/cases/${id}`),
  updateCase: (id, data) => request("PUT", `/cases/${id}`, data),

  // Appointments
  getAppointments: () => request("GET", "/appointments"),
  createAppointment: (data) => request("POST", "/appointments", data),
  updateAppointment: (id, data) => request("PUT", `/appointments/${id}`, data),
  deleteAppointment: (id) => request("DELETE", `/appointments/${id}`),

  // Documents
  getDocuments: () => request("GET", "/documents"),
  downloadDocument: async (id, fileName, filePath) => {
    const triggerBlob = (blob, name) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    };

    // Try auth-protected endpoint first
    try {
      const token = getToken();
      const res = await fetch(`${BASE_URL}/documents/${id}/download`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        triggerBlob(await res.blob(), fileName);
        return;
      }
    } catch { /* fall through */ }

    // Fallback: fetch the static file directly (no auth needed for static files)
    if (filePath) {
      const cleanPath = filePath.startsWith("/") ? filePath.slice(1) : filePath;
      const staticUrl = `http://localhost:5000/${cleanPath}`;
      const res = await fetch(staticUrl);
      if (res.ok) {
        triggerBlob(await res.blob(), fileName);
        return;
      }
    }

    throw new Error("File not available on server");
  },
  uploadDocument: (caseId, uploadedBy, file) => {
    const form = new FormData();
    form.append("caseId", caseId);
    form.append("uploadedBy", uploadedBy);
    form.append("file", file);
    return request("POST", "/documents/upload", form, true);
  },
  deleteDocument: (id) => request("DELETE", `/documents/${id}`),

  // Notifications
  getNotifications: () => request("GET", "/notifications"),
  markNotificationAsRead: (id) => request("PUT", `/notifications/${id}/read`),

  // Reviews
  getReviewsByLawyer: (lawyerId) =>
    request("GET", `/reviews/lawyer/${lawyerId}`),
  createReview: (lawyerId, rating, comment) =>
    request("POST", "/reviews", { lawyerId, rating, comment }),
};
