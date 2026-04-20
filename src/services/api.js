const BASE_URL = "http://localhost:5000/api";

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
    const err = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(err.message || "Request failed");
  }
  return res.json();
}

export const api = {
  // Auth
  login: (email, password) => request("POST", "/auth/login", { email, password }),
  register: (fullName, email, password, role) =>
    request("POST", "/auth/register", { fullName, email, password, role }),

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

  // Appointments
  getAppointments: () => request("GET", "/appointments"),
  createAppointment: (data) => request("POST", "/appointments", data),
  updateAppointment: (id, data) => request("PUT", `/appointments/${id}`, data),
  deleteAppointment: (id) => request("DELETE", `/appointments/${id}`),

  // Documents
  getDocuments: () => request("GET", "/documents"),
  uploadDocument: (caseId, uploadedBy, file) => {
    const form = new FormData();
    form.append("caseId", caseId);
    form.append("uploadedBy", uploadedBy);
    form.append("file", file);
    return request("POST", "/documents/upload", form, true);
  },
  deleteDocument: (id) => request("DELETE", `/documents/${id}`),
};
