import { useParams, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { DashboardLayout } from "../components/DashboardLayout";
import { StatusBadge } from "../components/StatusBadge";
import { Avatar } from "../components/Avatar";
import { DocumentList } from "../components/DocumentList";
import { NotesSection } from "../components/NotesSection";
import { ArrowLeft, User, Scale } from "lucide-react";

export default function CaseDetailPage() {
  const { id } = useParams();
  const {
    role,
    cases,
    appointments,
    documents,
    getLawyerById,
    getClientById,
    addNotes,
  } = useApp();

  const caseItem = cases.find((c) => c.id === id);

  if (!caseItem) {
    return (
      <DashboardLayout>
        <div className="text-center py-20 text-surface-400">
          <p>Case not found</p>
          <Link
            to="/cases"
            className="text-primary-600 text-sm font-medium mt-2 inline-block"
          >
            ← Back to Cases
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const lawyer = getLawyerById(caseItem.lawyerId);
  const client = getClientById(caseItem.clientId);
  const caseAppointments = appointments.filter(
    (a) => a.caseId === caseItem.id
  );
  const caseDocs = documents.filter((d) => d.caseId === caseItem.id);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Back */}
        <Link
          to="/cases"
          className="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-primary-600 transition-colors font-medium"
        >
          <ArrowLeft size={16} />
          Back to Cases
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl border border-surface-200 p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <StatusBadge status={caseItem.status} />
              <h1 className="text-xl font-bold text-surface-900 mt-2">
                {caseItem.title}
              </h1>
              <p className="text-sm text-surface-500 mt-1 max-w-2xl leading-relaxed">
                {caseItem.description}
              </p>
            </div>
          </div>

          {/* Parties */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-surface-100">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-50">
              <Avatar initials={lawyer?.avatar || "?"} size="sm" />
              <div>
                <p className="text-xs text-surface-400 font-medium flex items-center gap-1">
                  <Scale size={12} /> Lawyer
                </p>
                <p className="text-sm font-semibold text-surface-800">
                  {lawyer?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-50">
              <Avatar
                initials={client?.avatar || "?"}
                size="sm"
                className="from-emerald-500 to-emerald-700"
              />
              <div>
                <p className="text-xs text-surface-400 font-medium flex items-center gap-1">
                  <User size={12} /> Client
                </p>
                <p className="text-sm font-semibold text-surface-800">
                  {client?.name}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs-like sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notes */}
          <div className="bg-white rounded-2xl border border-surface-200 p-5">
            <h3 className="text-base font-semibold text-surface-900 mb-4">
              Appointment Notes
            </h3>
            <NotesSection
              appointments={caseAppointments}
              onAddNotes={addNotes}
              isLawyer={role === "lawyer"}
            />
          </div>

          {/* Documents */}
          <div className="bg-white rounded-2xl border border-surface-200 p-5">
            <h3 className="text-base font-semibold text-surface-900 mb-4">
              Documents
            </h3>
            <DocumentList
              documents={caseDocs}
              caseId={caseItem.id}
              showUpload
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
