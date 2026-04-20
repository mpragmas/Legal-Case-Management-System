import { useState } from "react";
import { MessageSquare, Save } from "lucide-react";

export function NotesSection({ appointments, onAddNotes, isLawyer = false }) {
  const [editing, setEditing] = useState(null);
  const [noteText, setNoteText] = useState("");

  const appointmentsWithNotes = appointments.filter(
    (a) => a.status === "completed" || a.notes
  );

  const handleSave = (appointmentId) => {
    onAddNotes(appointmentId, noteText);
    setEditing(null);
    setNoteText("");
  };

  if (appointmentsWithNotes.length === 0) {
    return (
      <div className="text-center py-12 text-surface-400">
        <MessageSquare size={40} className="mx-auto mb-3 text-surface-300" />
        <p className="text-sm">No appointment notes yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointmentsWithNotes.map((apt) => (
        <div
          key={apt.id}
          className="p-4 rounded-xl bg-white border border-surface-200"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-primary-500" />
              <span className="text-sm font-semibold text-surface-700">
                {apt.date} at {apt.time}
              </span>
            </div>
            <span className="text-xs text-surface-400 capitalize px-2 py-0.5 rounded-full bg-surface-50">
              {apt.status}
            </span>
          </div>

          {editing === apt.id ? (
            <div className="mt-2">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-surface-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                placeholder="Add notes about this appointment..."
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleSave(apt.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-600 text-white text-xs font-semibold hover:bg-primary-700 transition-colors cursor-pointer"
                >
                  <Save size={14} />
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditing(null);
                    setNoteText("");
                  }}
                  className="px-3 py-1.5 rounded-lg border border-surface-200 text-xs font-semibold text-surface-500 hover:bg-surface-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              {apt.notes ? (
                <p className="text-sm text-surface-600 mt-1 leading-relaxed">
                  {apt.notes}
                </p>
              ) : (
                <p className="text-sm text-surface-400 italic mt-1">No notes added</p>
              )}
              {isLawyer && apt.status === "completed" && (
                <button
                  onClick={() => {
                    setEditing(apt.id);
                    setNoteText(apt.notes || "");
                  }}
                  className="mt-2 text-xs font-medium text-primary-600 hover:text-primary-700 cursor-pointer"
                >
                  {apt.notes ? "Edit Notes" : "Add Notes"}
                </button>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
