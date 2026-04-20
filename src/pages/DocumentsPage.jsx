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

  const [caseFilter, setCaseFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("newest"); // "newest" | "oldest"

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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-surface-900">Documents</h1>
          <p className="text-sm text-surface-500 mt-0.5">
            Manage case documents and files
          </p>
        </div>

        {myCases.length === 0 ? (
          <div className="bg-white rounded-2xl border border-surface-200 p-12 text-center text-surface-400">
            <p className="text-sm">No cases with documents</p>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-2xl border border-surface-200">
              <div className="flex items-center gap-2 text-surface-500 font-medium text-sm mr-2">
                <Filter size={16} /> Filters
              </div>
              <select
                value={caseFilter}
                onChange={(e) => setCaseFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent flex-1"
              >
                <option value="all">All Cases</option>
                {myCases.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.title}
                  </option>
                ))}
              </select>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full sm:w-auto"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

            {/* Documents */}
            <div className="bg-white rounded-2xl border border-surface-200 p-5">
              <DocumentList
                documents={filteredDocs}
                  showUpload={role === "lawyer" && caseFilter !== "all"}
              caseId={caseFilter !== "all" ? Number(caseFilter) : null}
              />
              {role === "lawyer" && caseFilter === "all" && (
                <p className="text-xs text-surface-400 italic text-center mt-4">
                  Select a specific case to upload a document.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DocumentsPage;
