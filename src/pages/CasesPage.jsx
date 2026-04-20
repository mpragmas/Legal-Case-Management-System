import { useApp } from "../context/AppContext";
import { DashboardLayout } from "../components/DashboardLayout";
import { CaseCard } from "../components/CaseCard";
import { Briefcase, Search } from "lucide-react";
import { useState } from "react";

export default function CasesPage() {
  const { role, currentUserId, cases, getClientById } = useApp();
  
  const [searchFilter, setSearchFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [clientFilter, setClientFilter] = useState("all");

  const myCases =
    role === "lawyer"
      ? cases.filter((c) => c.lawyerId === currentUserId)
      : cases.filter((c) => c.clientId === currentUserId);

  const uniqueClients = role === "lawyer" 
    ? Array.from(new Set(myCases.map(c => c.clientId))).map(id => getClientById(id)).filter(Boolean)
    : [];

  const filteredCases = myCases.filter((c) => {
    if (searchFilter.trim() && !c.title.toLowerCase().includes(searchFilter.toLowerCase())) return false;
    if (statusFilter !== "all" && c.status !== statusFilter) return false;
    if (role === "lawyer" && clientFilter !== "all" && c.clientId !== clientFilter) return false;
    return true;
  });

  const active = filteredCases.filter((c) => c.status === "active");
  const closed = filteredCases.filter((c) => c.status === "closed");

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-surface-900">Cases</h1>
          <p className="text-sm text-surface-500 mt-0.5">
            Manage your legal cases and their details
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl border border-surface-200">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              type="text"
              placeholder="Search by case title..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="closed">Closed</option>
          </select>
          {role === "lawyer" && (
            <select
              value={clientFilter}
              onChange={(e) => setClientFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Clients</option>
              {uniqueClients.map(client => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
          )}
        </div>

        {filteredCases.length === 0 ? (
          <div className="bg-white rounded-2xl border border-surface-200 p-12 text-center text-surface-400">
            <Briefcase size={48} className="mx-auto mb-4 text-surface-300" />
            <p className="text-sm">No cases found</p>
          </div>
        ) : (
          <>
            {active.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-surface-500 uppercase tracking-wider mb-3">
                  Active ({active.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {active.map((c) => (
                    <CaseCard key={c.id} caseItem={c} />
                  ))}
                </div>
              </div>
            )}
            {closed.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-surface-500 uppercase tracking-wider mb-3">
                  Closed ({closed.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {closed.map((c) => (
                    <CaseCard key={c.id} caseItem={c} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
