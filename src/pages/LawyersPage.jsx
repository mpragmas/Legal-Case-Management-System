import { useState } from "react";
import { useApp } from "../context/AppContext";
import { DashboardLayout } from "../components/DashboardLayout";
import { LawyerCard } from "../components/LawyerCard";
import { Modal } from "../components/Modal";
import { Search } from "lucide-react";

export default function LawyersPage() {
  const { lawyers, requests, currentUserId, sendRequest } = useApp();
  const [search, setSearch] = useState("");
  const [specFilter, setSpecFilter] = useState("all");
  const [expFilter, setExpFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [message, setMessage] = useState("");

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

  const requestedLawyerIds = requests
    .filter((r) => r.clientId === currentUserId)
    .map((r) => r.lawyerId);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold text-surface-900">Find a Lawyer</h1>
              <p className="text-sm text-surface-500 mt-0.5">
                Browse our network of qualified attorneys
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl border border-surface-200">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400"
              />
              <input
                id="search-lawyers"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or specialty..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white transition-all"
              />
            </div>
            <select
              value={specFilter}
              onChange={(e) => setSpecFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">All Specializations</option>
              {uniqueSpecializations.map((spec) => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
            <select
              value={expFilter}
              onChange={(e) => setExpFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="all">Any Experience</option>
              <option value="0-5">0 - 5 years</option>
              <option value="5-10">5 - 10 years</option>
              <option value="10+">10+ years</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((lawyer) => (
            <LawyerCard
              key={lawyer.id}
              lawyer={lawyer}
              onRequest={handleRequest}
              requested={requestedLawyerIds.includes(lawyer.id)}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-surface-400">
            <p className="text-sm">No lawyers match your search</p>
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
