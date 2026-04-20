import { useState } from "react";
import { Avatar } from "./Avatar";
import { Star, Briefcase, Clock, ChevronDown, ChevronUp } from "lucide-react";

export function LawyerCard({ lawyer, onRequest, requested }) {
  const [showBio, setShowBio] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-surface-200 p-6 hover:shadow-lg hover:shadow-primary-500/5 transition-all duration-300 group flex flex-col">
      <div className="flex items-start gap-4">
        <Avatar initials={lawyer.avatar} size="lg" />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-surface-900 group-hover:text-primary-700 transition-colors">
            {lawyer.name}
          </h3>
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
        onClick={() => onRequest(lawyer.id)}
        disabled={requested}
        className={`mt-4 w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
          requested
            ? "bg-surface-100 text-surface-400 cursor-not-allowed"
            : "bg-primary-600 text-white hover:bg-primary-700 active:scale-[0.98] shadow-sm shadow-primary-600/20"
        }`}
      >
        {requested ? "Request Sent" : "Request Lawyer"}
      </button>
    </div>
  );
}
