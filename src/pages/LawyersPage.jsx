import { useState } from "react";
import { useApp } from "../context/AppContext";
import { DashboardLayout } from "../components/DashboardLayout";
import { LawyerCard } from "../components/LawyerCard";
import { Modal } from "../components/Modal";
import { Search } from "lucide-react";

export default function LawyersPage() {
  const { lawyers, requests, cases, currentUserId, sendRequest } = useApp();
  const [search, setSearch] = useState("");
  const [specFilter, setSpecFilter] = useState("all");
  const [expFilter, setExpFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [message, setMessage] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const uniqueSpecializations = Array.from(new Set(lawyers.map((l) => l.specialization)));

  const filtered = lawyers.filter((l) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!l.name.toLowerCase().includes(q) && !l.specialization.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (specFilter !== "all" && l.specialization !== specFilter) return false;
    if (expFilter !== "all") {
      if (expFilter === "0-5" && l.experience > 5) return false;
      if (expFilter === "5-10" && (l.experience <= 5 || l.experience > 10)) return false;
      if (expFilter === "10+" && l.experience <= 10) return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedLawyers = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleRequest = (lawyerId) => {
    setSelectedLawyer(lawyerId);
    setMessage("");
    setModalOpen(true);
  };

  const handleSend = () => {
    if (!message.trim()) return;
    sendRequest(selectedLawyer, message);
    setModalOpen(false);
  };

  const myId = Number(currentUserId);

  // Lawyers with a pending request from this client
  const pendingLawyerIds = new Set(
    requests
      .filter((r) => r.clientId === myId && r.status === "pending")
      .map((r) => r.lawyerId)
  );

  // Lawyers the client already has an active case with
  const activeCaseLawyerIds = new Set(
    cases
      .filter((c) => c.clientId === myId && c.status === "active")
      .map((c) => c.lawyerId)
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-surface-900 tracking-tight">Legal Experts</h1>
              <p className="text-sm text-surface-500 mt-0.5">
                {filtered.length} qualified attorneys available for representation
              </p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-3xl border border-surface-200 shadow-sm">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400"
              />
              <input
                id="search-lawyers"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                placeholder="Search by name or specialty..."
                className="w-full pl-12 pr-4 py-3 rounded-2xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface-50/50 transition-all font-medium"
              />
            </div>
            <div className="flex gap-3">
              <select
                value={specFilter}
                onChange={(e) => { setSpecFilter(e.target.value); setCurrentPage(1); }}
                className="px-4 py-3 rounded-2xl border border-surface-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="all">All Specialties</option>
                {uniqueSpecializations.map((spec) => (
                  <option key={spec} value={spec}>{spec}</option>
                ))}
              </select>
              <select
                value={expFilter}
                onChange={(e) => { setExpFilter(e.target.value); setCurrentPage(1); }}
                className="px-4 py-3 rounded-2xl border border-surface-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="all">Experience</option>
                <option value="0-5">0 - 5 years</option>
                <option value="5-10">5 - 10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedLawyers.map((lawyer) => (
            <LawyerCard
              key={lawyer.id}
              lawyer={lawyer}
              onRequest={handleRequest}
              hasPending={pendingLawyerIds.has(lawyer.id)}
              hasActiveCase={activeCaseLawyerIds.has(lawyer.id)}
              isBusy={lawyer.activeClients >= lawyer.maxClients}
            />
          ))}
        </div>

        {filtered.length > itemsPerPage && (
          <div className="flex items-center justify-center gap-2 pt-6">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-2 rounded-xl border border-surface-200 disabled:opacity-30 hover:bg-surface-50 transition-colors"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-10 h-10 rounded-xl font-bold transition-all ${currentPage === p ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20" : "text-surface-500 hover:bg-surface-50"}`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-2 rounded-xl border border-surface-200 disabled:opacity-30 hover:bg-surface-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}

        {filtered.length === 0 && (
          <div className="bg-white rounded-[3rem] border border-dashed border-surface-200 p-20 text-center animate-fade-in">
            <Search size={48} className="mx-auto mb-4 text-surface-200" />
            <h3 className="text-xl font-black text-surface-900 mb-2">No Matches Found</h3>
            <p className="text-surface-500">Try adjusting your filters or search terms.</p>
          </div>
        )}
      </div>

      {/* Request modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Send Request"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">
              Message
            </label>
            <textarea
              id="request-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Briefly describe your legal needs..."
              className="w-full px-3 py-2.5 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-surface-200 text-sm font-semibold text-surface-600 hover:bg-surface-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="send-request"
              onClick={handleSend}
              disabled={!message.trim()}
              className="px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-sm shadow-primary-600/20"
            >
              Send Request
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
