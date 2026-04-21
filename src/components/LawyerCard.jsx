import { useState } from "react";
import { Avatar } from "./Avatar";
import { Star, Briefcase, Clock, ChevronDown, ChevronUp, Users, CheckCircle2 } from "lucide-react";

export function LawyerCard({ lawyer, onRequest, hasPending, hasActiveCase, isBusy }) {
  const [showBio, setShowBio] = useState(false);

  const canRequest = !hasPending && !hasActiveCase && !isBusy;

  const buttonLabel = hasActiveCase
    ? "Active Case Ongoing"
    : hasPending
    ? "Request Sent"
    : isBusy
    ? "Lawyer is Busy"
    : "Request Lawyer";

  const buttonClass = canRequest
    ? "bg-primary-600 text-white hover:bg-primary-700 active:scale-[0.98] shadow-sm shadow-primary-600/20"
    : hasActiveCase
    ? "bg-emerald-50 text-emerald-700 cursor-not-allowed border border-emerald-200"
    : hasPending
    ? "bg-surface-100 text-surface-400 cursor-not-allowed"
    : "bg-red-50 text-red-500 cursor-not-allowed border border-red-200";

  return (
    <div className="bg-white rounded-2xl border border-surface-200 p-6 hover:shadow-lg hover:shadow-primary-500/5 transition-all duration-300 group flex flex-col">
      <div className="flex items-start gap-4">
        <Avatar initials={lawyer.avatar} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-semibold text-surface-900 group-hover:text-primary-700 transition-colors">
              {lawyer.name}
            </h3>
            {isBusy && (
              <span className="shrink-0 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-100 text-red-600 border border-red-200">
                Full
              </span>
            )}
          </div>
          <p className="text-sm text-primary-600 font-medium mt-0.5">
            {lawyer.specialization}
          </p>
          <div className="flex items-center gap-4 mt-2 text-xs text-surface-500">
            <span className="flex items-center gap-1">
              <Clock size={14} />
              {lawyer.experience} yrs
            </span>
            <span className="flex items-center gap-1">
              <Briefcase size={14} />
              {lawyer.casesWon} won
            </span>
            <span className="flex items-center gap-1">
              <Star size={14} className="text-amber-400 fill-amber-400" />
              {lawyer.rating}
            </span>
          </div>

          {/* Capacity indicator */}
          <div className="flex items-center gap-1.5 mt-2">
            <Users size={12} className="text-surface-400" />
            <div className="flex gap-1">
              {Array.from({ length: lawyer.maxClients }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 w-5 rounded-full transition-colors ${
                    i < (lawyer.activeClients ?? 0) ? "bg-primary-500" : "bg-surface-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-[10px] text-surface-400 font-medium">
              {lawyer.activeClients ?? 0}/{lawyer.maxClients} cases
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex-1">
        <button
          onClick={() => setShowBio(!showBio)}
          className="flex items-center gap-1 text-xs font-bold text-surface-400 hover:text-primary-600 uppercase tracking-widest transition-colors mb-2"
        >
          {showBio ? "Hide Biography" : "View Biography"}
          {showBio ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showBio && (
          <p className="text-sm text-surface-600 leading-relaxed animate-fade-in">
            {lawyer.bio || "No biography provided."}
          </p>
        )}
      </div>

      <button
        id={`request-lawyer-${lawyer.id}`}
        onClick={() => canRequest && onRequest(lawyer.id)}
        disabled={!canRequest}
        className={`mt-4 w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${buttonClass}`}
      >
        {(hasActiveCase || hasPending) && <CheckCircle2 size={15} />}
        {buttonLabel}
      </button>
    </div>
  );
}
