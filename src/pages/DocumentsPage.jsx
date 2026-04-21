import { useState } from "react";
import { useApp } from "../context/AppContext";
import { DashboardLayout } from "../components/DashboardLayout";
import { DocumentList } from "../components/DocumentList";
import { Filter } from "lucide-react";

import React from "react";

const DocumentsPage = () => {
  const { role, currentUserId, cases, documents } = useApp();

  const myCases = cases.filter((c) =>
    role === "lawyer"
      ? c.lawyerId === currentUserId
      : c.clientId === currentUserId,
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [caseFilter, setCaseFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("newest");

  const filteredDocs = documents
    .filter((d) => {
      // Must belong to one of my cases
      if (!myCases.some((c) => c.id === d.caseId)) return false;
      // Filter by selected case
      if (caseFilter !== "all" && String(d.caseId) !== String(caseFilter)) return false;
      return true;
    })
    .sort((a, b) => {
      const dbA = new Date(a.uploadedAt).getTime();
      const dbB = new Date(b.uploadedAt).getTime();
      return dateFilter === "newest" ? dbB - dbA : dbA - dbB;
    });

  const totalPages = Math.ceil(filteredDocs.length / itemsPerPage);
  const paginatedDocs = filteredDocs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-surface-900 tracking-tight">Legal Repository</h1>
          <p className="text-sm text-surface-500 mt-0.5">
            {filteredDocs.length} sensitive documents secured in your case files
          </p>
        </div>

        {myCases.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] border border-surface-200 p-20 text-center shadow-sm">
            <Filter size={48} className="mx-auto mb-4 text-surface-200" />
            <h4 className="text-xl font-black text-surface-900 mb-2">No Records Found</h4>
            <p className="text-surface-500">Documents will appear here once you have an active case.</p>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 bg-white p-5 rounded-[2rem] border border-surface-200 shadow-sm">
              <div className="flex items-center gap-2 text-surface-400 font-bold text-xs uppercase tracking-widest mr-4">
                <Filter size={18} /> Perspective
              </div>
              <select
                value={caseFilter}
                onChange={(e) => { setCaseFilter(e.target.value); setCurrentPage(1); }}
                className="px-4 py-3 rounded-2xl border border-surface-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary-500 bg-surface-50/50 flex-1 transition-all"
              >
                <option value="all">Consolidated View (All Cases)</option>
                {myCases.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.title}
                  </option>
                ))}
              </select>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-3 rounded-2xl border border-surface-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="newest">Latest Uploads</option>
                <option value="oldest">Archive (Oldest)</option>
              </select>
            </div>

            {/* Documents */}
            <div className="space-y-6">
              <div className="bg-white rounded-[2.5rem] border border-surface-200 p-8 shadow-sm">
                <DocumentList
                  documents={paginatedDocs}
                  showUpload={caseFilter !== "all"}
                  caseId={caseFilter !== "all" ? Number(caseFilter) : null}
                />
                
                {caseFilter === "all" && (
                  <div className="mt-8 p-6 rounded-2xl bg-amber-50 border border-amber-100 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-white text-amber-500 flex items-center justify-center shadow-sm">
                      <Filter size={20} />
                    </div>
                    <p className="text-sm font-bold text-amber-800">
                      To upload a document, please select a specific case from the filter above.
                    </p>
                  </div>
                )}
              </div>

              {filteredDocs.length > itemsPerPage && (
                <div className="flex items-center justify-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => p - 1)}
                    className="p-3 rounded-xl border border-surface-200 disabled:opacity-30 hover:bg-surface-50 transition-colors"
                  >
                    Previous
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`w-12 h-12 rounded-xl font-black transition-all ${currentPage === p ? "bg-primary-600 text-white shadow-xl shadow-primary-600/20" : "text-surface-500 hover:bg-surface-50"}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => p + 1)}
                    className="p-3 rounded-xl border border-surface-200 disabled:opacity-30 hover:bg-surface-50 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DocumentsPage;
