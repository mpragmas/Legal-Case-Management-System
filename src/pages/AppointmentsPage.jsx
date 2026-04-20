import { useState } from "react";
import { useApp } from "../context/AppContext";
import { DashboardLayout } from "../components/DashboardLayout";
import { StatusBadge } from "../components/StatusBadge";
import { Modal } from "../components/Modal";
import { Avatar } from "../components/Avatar";
import {
  Plus,
  CalendarClock,
  Clock,
  CheckCircle2,
  Pencil,
  Trash2,
  XCircle,
  Calendar,
  MoreVertical,
  MessageSquare,
  AlertCircle,
} from "lucide-react";

export default function AppointmentsPage() {
  const {
    role,
    currentUserId,
    appointments,
    cases,
    createSlot,
    bookAppointment,
    editAppointment,
    deleteAppointment,
    cancelAppointment,
    completeAppointment,
    addNotes,
    getLawyerById,
    getClientById,
  } = useApp();

  const [showSlotModal, setShowSlotModal] = useState(false);
  const [showBookModal, setShowBookModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);

  const [selectedApt, setSelectedApt] = useState(null);
  const [selectedCase, setSelectedCase] = useState("");
  const [noteText, setNoteText] = useState("");

  const [isEditMode, setIsEditMode] = useState(false);

  const [slotForm, setSlotForm] = useState({
    date: "",
    time: "",
    duration: "60",
  });

  // Filter appointments
  const myAppointments =
    role === "lawyer"
      ? appointments.filter((a) => a.lawyerId === currentUserId)
      : appointments.filter(
          (a) => a.clientId === currentUserId || a.status === "available"
        );

  const myCases = cases.filter((c) =>
    role === "lawyer"
      ? c.lawyerId === currentUserId
      : c.clientId === currentUserId && c.status === "active",
  );

  const handleSaveSlot = () => {
    if (!slotForm.date || !slotForm.time) return;

    if (isEditMode && selectedApt) {
      editAppointment(selectedApt.id, {
        date: slotForm.date,
        time: slotForm.time,
        duration: parseInt(slotForm.duration),
      });
    } else {
      createSlot(slotForm.date, slotForm.time, parseInt(slotForm.duration));
    }

    setShowSlotModal(false);
    setSlotForm({ date: "", time: "", duration: "60" });
    setSelectedApt(null);
    setIsEditMode(false);
  };

  const handleCreateClick = () => {
    setIsEditMode(false);
    setSlotForm({
      date: new Date().toISOString().split("T")[0],
      time: "09:00",
      duration: "60",
    });
    setShowSlotModal(true);
  };

  const handleEditClick = (apt) => {
    setSelectedApt(apt);
    setSlotForm({
      date: apt.date,
      time: apt.time,
      duration: apt.duration.toString(),
    });
    setIsEditMode(true);
    setShowSlotModal(true);
  };

  const handleBook = (apt) => {
    setSelectedApt(apt);
    setSelectedCase("");
    setShowBookModal(true);
  };

  const handleConfirmBook = () => {
    if (!selectedApt || !selectedCase) return;
    bookAppointment(selectedApt.id, selectedCase);
    setShowBookModal(false);
    setSelectedCase("");
    setSelectedApt(null);
  };

  const handleOpenNotes = (apt) => {
    setSelectedApt(apt);
    setNoteText(apt.notes || "");
    setShowNotesModal(true);
  };

  const handleSaveNotes = () => {
    addNotes(selectedApt.id, noteText);
    setShowNotesModal(false);
  };

  const available = myAppointments.filter((a) => a.status === "available");
  const confirmed = myAppointments.filter((a) => a.status === "confirmed");
  const completed = myAppointments.filter((a) => a.status === "completed");

  const renderAppointmentRow = (apt) => {
    const lawyer = getLawyerById(apt.lawyerId);
    const client = getClientById(apt.clientId);
    const linkedCase = cases.find((c) => c.id === apt.caseId);
    const person = role === "lawyer" ? client : lawyer;

    return (
      <div
        key={apt.id}
        className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-white border border-surface-200 hover:border-primary-300 hover:shadow-sm transition-all animate-fade-in"
      >
        {/* Date & Time Icon */}
        <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary-50 text-primary-600 shrink-0">
          <CalendarClock size={24} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-surface-900 truncate">{apt.date}</h4>
            <span className="text-surface-400">•</span>
            <span className="text-primary-600 font-semibold">{apt.time}</span>
          </div>

          <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-sm">
            <span className="flex items-center gap-1.5 text-surface-500">
              <Clock size={14} className="text-surface-400" />
              {apt.duration} min
            </span>

            {person && (
              <span className="flex items-center gap-1.5 text-surface-500">
                <Avatar initials={person.avatar} size="xs" />
                {person.name}
              </span>
            )}

            {linkedCase && (
              <span className="flex items-center gap-1.5 text-primary-600 font-medium bg-primary-50 px-2 py-0.5 rounded-lg text-[11px] uppercase tracking-wider">
                {linkedCase.title}
              </span>
            )}
          </div>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center gap-3 self-end sm:self-center">
          <StatusBadge status={apt.status} />

          <div className="flex items-center gap-1 border-l border-surface-100 pl-3">
            {apt.status === "available" && role === "client" && (
              <button
                onClick={() => handleBook(apt)}
                className="px-4 py-1.5 bg-primary-600 text-white rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors shadow-sm"
              >
                Book Now
              </button>
            )}

            {apt.status === "available" && role === "lawyer" && (
              <>
                <button
                  onClick={() => handleEditClick(apt)}
                  className="p-2 text-surface-500 hover:bg-surface-50 hover:text-primary-600 rounded-lg transition-colors"
                  title="Edit Slot"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={() => deleteAppointment(apt.id)}
                  className="p-2 text-surface-500 hover:bg-red-50 hover:text-danger rounded-lg transition-colors"
                  title="Delete Slot"
                >
                  <Trash2 size={18} />
                </button>
              </>
            )}

            {apt.status === "confirmed" && role === "lawyer" && (
              <>
                <button
                  onClick={() => completeAppointment(apt.id)}
                  className="p-2 text-surface-500 hover:bg-emerald-50 hover:text-success rounded-lg transition-colors"
                  title="Mark Completed"
                >
                  <CheckCircle2 size={18} />
                </button>
                <button
                  onClick={() => cancelAppointment(apt.id)}
                  className="p-2 text-surface-500 hover:bg-red-50 hover:text-danger rounded-lg transition-colors"
                  title="Cancel Appointment"
                >
                  <XCircle size={18} />
                </button>
              </>
            )}

            {apt.status === "completed" && (
              <button
                onClick={() => handleOpenNotes(apt)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                  apt.notes 
                    ? "bg-primary-50 text-primary-700 border-primary-200 hover:bg-primary-100" 
                    : "bg-surface-50 text-surface-600 border-surface-200 hover:bg-surface-100"
                }`}
              >
                <MessageSquare size={16} />
                {apt.notes ? "View Report" : "Add Report"}
              </button>
            )}
          </div>
        </div>
        {apt.status === "completed" && apt.notes && (
          <div className="mt-3 pt-3 border-t border-surface-100 w-full">
            <p className="text-xs text-surface-400 font-black uppercase tracking-tighter mb-1 ml-1">Consultation Outcome</p>
            <div className="bg-surface-50 p-3 rounded-xl border border-surface-100 text-sm text-surface-600 italic line-clamp-2">
              "{apt.notes}"
            </div>
          </div>
        )}
      </div>
    );
  };

  const SectionHeader = ({ title, count }) => (
    <div className="flex items-center gap-3 mt-8 mb-4">
      <h3 className="text-sm font-bold text-surface-500 uppercase tracking-widest">
        {title}
      </h3>
      <div className="h-[1px] flex-1 bg-surface-100"></div>
      {count > 0 && (
        <span className="bg-surface-100 text-surface-600 px-2 py-0.5 rounded-full text-xs font-bold">
          {count}
        </span>
      )}
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-surface-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-surface-900">
              Appointments
            </h1>
            <p className="text-surface-500 text-sm mt-1">
              Manage your schedule and client meetings
            </p>
          </div>

          {role === "lawyer" && (
            <button
              onClick={handleCreateClick}
              className="flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-primary-700 transition-all shadow-md shadow-primary-500/20 active:scale-95"
            >
              <Plus size={20} />
              Create Availability Slot
            </button>
          )}
        </div>

        {/* Appointments List */}
        <div className="space-y-4">
          {confirmed.length > 0 && (
            <>
              <SectionHeader
                title="Confirmed Meetings"
                count={confirmed.length}
              />
              <div className="grid gap-3">
                {confirmed.map(renderAppointmentRow)}
              </div>
            </>
          )}

          {available.length > 0 && (
            <>
              <SectionHeader title="Available Slots" count={available.length} />
              <div className="grid gap-3">
                {available.map(renderAppointmentRow)}
              </div>
            </>
          )}

          {completed.length > 0 && (
            <>
              <SectionHeader title="History" count={completed.length} />
              <div className="grid gap-3">
                {completed.map(renderAppointmentRow)}
              </div>
            </>
          )}

          {myAppointments.length === 0 && (
            <div className="bg-white rounded-3xl border border-dashed border-surface-300 p-12 text-center animate-fade-in">
              <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-surface-50 text-surface-300 mb-4">
                <Calendar size={40} />
              </div>
              <h3 className="text-lg font-bold text-surface-900">
                No appointments found
              </h3>
              <p className="text-surface-500 max-w-xs mx-auto mt-2">
                {role === "lawyer"
                  ? "Start by creating some availability slots for your clients to book."
                  : "You don't have any upcoming or available appointments yet."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* SLOT MODAL */}
      <Modal
        open={showSlotModal}
        onClose={() => setShowSlotModal(false)}
        title={
          isEditMode ? "Edit Availability Slot" : "Create Availability Slot"
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-surface-700 ml-1">
                Date
              </label>
              <div className="relative">
                <Calendar
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400"
                  size={18}
                />
                <input
                  type="date"
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
                  value={slotForm.date}
                  onChange={(e) =>
                    setSlotForm({ ...slotForm, date: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-surface-700 ml-1">
                Time
              </label>
              <div className="relative">
                <Clock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400"
                  size={18}
                />
                <input
                  type="time"
                  className="w-full pl-10 pr-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
                  value={slotForm.time}
                  onChange={(e) =>
                    setSlotForm({ ...slotForm, time: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-surface-700 ml-1">
              Duration (minutes)
            </label>
            <select
              className="w-full px-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none appearance-none"
              value={slotForm.duration}
              onChange={(e) =>
                setSlotForm({ ...slotForm, duration: e.target.value })
              }
            >
              <option value="30">30 minutes</option>
              <option value="60">60 minutes</option>
              <option value="90">90 minutes</option>
              <option value="120">120 minutes</option>
            </select>
          </div>

          <button
            onClick={handleSaveSlot}
            className="w-full bg-primary-600 text-white py-3 rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 active:scale-[0.98] mt-4"
          >
            {isEditMode ? "Save Changes" : "Create Slot"}
          </button>
        </div>
      </Modal>

      {/* BOOK MODAL */}
      <Modal
        open={showBookModal}
        onClose={() => setShowBookModal(false)}
        title="Book Appointment"
      >
        <div className="space-y-5">
          {selectedApt && (
            <div className="bg-primary-50 rounded-2xl p-4 border border-primary-100 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-white text-primary-600 flex items-center justify-center border border-primary-200 shadow-sm">
                <CalendarClock size={24} />
              </div>
              <div>
                <p className="text-xs text-primary-600 font-bold uppercase tracking-wider">
                  Selected Slot
                </p>
                <p className="text-surface-900 font-bold">
                  {selectedApt.date} at {selectedApt.time}
                </p>
                <p className="text-sm text-surface-500">
                  {selectedApt.duration} minutes
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-surface-700 ml-1 text-center block">
              Associate with an Active Case
            </label>
            <div className="flex flex-col gap-2">
              {myCases.length === 0 ? (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-700 flex items-center gap-3">
                  <AlertCircle size={20} />
                  <p className="text-sm">
                    You must have an active case to book an appointment.
                  </p>
                </div>
              ) : (
                myCases.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCase(c.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all text-left ${
                      selectedCase === c.id
                        ? "bg-primary-50 border-primary-500 ring-2 ring-primary-500 ring-opacity-20 shadow-md"
                        : "bg-surface-50 border-surface-200 hover:border-primary-300"
                    }`}
                  >
                    <div>
                      <p
                        className={`font-bold ${selectedCase === c.id ? "text-primary-700" : "text-surface-900"}`}
                      >
                        {c.title}
                      </p>
                      <p className="text-xs text-surface-500">
                        Case ID: {c.id}
                      </p>
                    </div>
                    {selectedCase === c.id && (
                      <CheckCircle2 size={20} className="text-primary-600" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          <button
            disabled={!selectedCase}
            onClick={handleConfirmBook}
            className="w-full bg-primary-600 text-white py-4 rounded-2xl font-bold hover:bg-primary-700 transition-all shadow-xl shadow-primary-600/30 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] mt-2"
          >
            Confirm Booking
          </button>
        </div>
      </Modal>

      {/* NOTES MODAL */}
      <Modal
        open={showNotesModal}
        onClose={() => setShowNotesModal(false)}
        title="Consultation Summary"
      >
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-primary-50 rounded-2xl border border-primary-100">
            <div className="h-12 w-12 rounded-xl bg-white text-primary-600 flex items-center justify-center shadow-sm border border-primary-100">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-xs font-black text-primary-600 uppercase tracking-tighter">Reference Date</p>
              <p className="text-surface-900 font-bold">{selectedApt?.date}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">
              Internal Case Notes
            </label>
            <div className="relative">
              <textarea
                className="w-full px-5 py-4 bg-surface-50 border-2 border-surface-200 rounded-2xl focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all outline-none min-h-[200px] resize-none text-surface-800 leading-relaxed font-medium"
                placeholder="Document the discussion, legal advice provided, and next steps..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3">
             <button
              onClick={() => setShowNotesModal(false)}
              className="flex-1 px-6 py-3.5 rounded-xl font-bold text-surface-500 hover:bg-surface-50 transition-all active:scale-95"
            >
              Discard
            </button>
            <button
              onClick={handleSaveNotes}
              className="flex-[2] bg-primary-600 text-white py-3.5 rounded-xl font-bold hover:bg-primary-700 transition-all shadow-xl shadow-primary-600/20 active:scale-95"
            >
              Save Report
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
