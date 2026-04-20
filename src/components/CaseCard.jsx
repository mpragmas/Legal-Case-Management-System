import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { StatusBadge } from "./StatusBadge";
import { Avatar } from "./Avatar";
import { ArrowRight } from "lucide-react";

export function CaseCard({ caseItem }) {
  const { getLawyerById, getClientById, role } = useApp();
  const lawyer = getLawyerById(caseItem.lawyerId);
  const client = getClientById(caseItem.clientId);
  const other = role === "lawyer" ? client : lawyer;

  return (
    <Link
      to={`/cases/${caseItem.id}`}
      className="block bg-white rounded-2xl border border-surface-200 p-5 hover:shadow-lg hover:shadow-primary-500/5 hover:border-primary-200 transition-all duration-300 group"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <StatusBadge status={caseItem.status} />
          </div>
          <h3 className="text-base font-semibold text-surface-900 mt-2 group-hover:text-primary-700 transition-colors">
            {caseItem.title}
          </h3>
          <p className="text-sm text-surface-500 mt-1 line-clamp-2">
            {caseItem.description}
          </p>
        </div>
        <ArrowRight
          size={20}
          className="text-surface-300 group-hover:text-primary-500 transition-all group-hover:translate-x-1 shrink-0 ml-4 mt-1"
        />
      </div>
      <div className="flex items-center gap-3 mt-4 pt-4 border-t border-surface-100">
        <Avatar initials={other?.avatar || "?"} size="sm" />
        <div>
          <p className="text-sm font-medium text-surface-700">{other?.name}</p>
          <p className="text-xs text-surface-400 capitalize">
            {role === "lawyer" ? "Client" : lawyer?.specialization}
          </p>
        </div>
      </div>
    </Link>
  );
}
