import { useApp } from "../context/AppContext";
import { DashboardLayout } from "../components/DashboardLayout";
import { RequestList } from "../components/RequestList";
import { Inbox } from "lucide-react";
import { useState } from "react";

export default function RequestsPage() {

  const [statusFilter, setStatusFilter] = useState("all");
  const [searchFilter, setSearchFilter] = useState("");

  const { role, currentUserId, requests, getLawyerById, getClientById } = useApp();

  const myRequests =
    role === "lawyer"
      ? requests.filter((r) => r.lawyerId === currentUserId)
      : requests.filter((r) => r.clientId === currentUserId);

  const filteredRequests = myRequests.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (searchFilter.trim()) {
      const otherPerson = role === "lawyer" ? getClientById(r.clientId) : getLawyerById(r.lawyerId);
      if (!otherPerson?.name.toLowerCase().includes(searchFilter.toLowerCase())) return false;
    }
    return true;
  });

  const pending = filteredRequests.filter((r) => r.status === "pending");
  const other = filteredRequests.filter((r) => r.status !== "pending");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-surface-900">
            {role === "lawyer" ? "Incoming Requests" : "My Requests"}
          </h1>
          <p className="text-sm text-surface-500 mt-0.5">
            {role === "lawyer"
              ? "Review and respond to client requests"
              : "Track your lawyer requests"}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl border border-surface-200">
          <input
            type="text"
            placeholder={`Search by ${role === "lawyer" ? "client name" : "lawyer name"}...`}
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="flex-1 px-3 py-2 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Pending */}
        {pending.length > 0 && (
          <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-surface-100 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <h3 className="text-sm font-semibold text-surface-700">
                Pending ({pending.length})
              </h3>
            </div>
            <RequestList requests={pending} showActions={true} />
          </div>
        )}

        {/* All other */}
        <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-surface-100">
            <h3 className="text-sm font-semibold text-surface-700">
              {pending.length > 0 ? "Previous Requests" : "All Requests"}
            </h3>
          </div>
          {other.length > 0 ? (
            <RequestList requests={other} />
          ) : (
            <div className="text-center py-12 text-surface-400">
              <Inbox size={40} className="mx-auto mb-3 text-surface-300" />
              <p className="text-sm">No requests yet</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
