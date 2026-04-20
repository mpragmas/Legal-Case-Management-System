import { useApp } from "../context/AppContext";
import { StatusBadge } from "./StatusBadge";
import { Avatar } from "./Avatar";
import { Check, X } from "lucide-react";

export function RequestList({ requests, showActions = false }) {
  const { getLawyerById, getClientById, acceptRequest, rejectRequest, cancelRequest, role } = useApp();

  if (!requests.length) {
    return (
      <div className="text-center py-12 text-surface-400">
        <p className="text-sm">No requests found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-surface-200">
            <th className="text-left py-3 px-4 font-semibold text-surface-500 text-xs uppercase tracking-wider">
              {role === "lawyer" ? "Client" : "Lawyer"}
            </th>
            <th className="text-left py-3 px-4 font-semibold text-surface-500 text-xs uppercase tracking-wider hidden sm:table-cell">
              Message
            </th>
            <th className="text-left py-3 px-4 font-semibold text-surface-500 text-xs uppercase tracking-wider">
              Status
            </th>
            <th className="text-left py-3 px-4 font-semibold text-surface-500 text-xs uppercase tracking-wider">
              Date
            </th>
            {showActions && (
              <th className="text-right py-3 px-4 font-semibold text-surface-500 text-xs uppercase tracking-wider">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-100">
          {requests.map((req) => {
            const person =
              role === "lawyer"
                ? getClientById(req.clientId)
                : getLawyerById(req.lawyerId);
            return (
              <tr key={req.id} className="hover:bg-surface-50 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <Avatar initials={person?.avatar || "?"} size="sm" />
                    <span className="font-medium text-surface-800">
                      {person?.name || "Unknown"}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-surface-500 max-w-xs truncate hidden sm:table-cell">
                  {req.message}
                </td>
                <td className="py-3 px-4">
                  <StatusBadge status={req.status} />
                </td>
                <td className="py-3 px-4 text-surface-500">
                  {new Date(req.createdAt).toLocaleDateString()}
                </td>
                {showActions && (
                  <td className="py-3 px-4 text-right">
                    {req.status === "pending" && role === "lawyer" && (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          id={`accept-${req.id}`}
                          onClick={() => acceptRequest(req.id)}
                          className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors cursor-pointer"
                          title="Accept"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          id={`reject-${req.id}`}
                          onClick={() => rejectRequest(req.id)}
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                          title="Reject"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                    {req.status === "pending" && role === "client" && (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          id={`cancel-${req.id}`}
                          onClick={() => cancelRequest(req.id)}
                          className="px-3 py-1.5 rounded-lg bg-surface-100 text-surface-600 hover:bg-surface-200 transition-colors cursor-pointer font-medium text-xs"
                        >
                          Cancel Request
                        </button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
