import { useApp } from "../context/AppContext";
import { DashboardLayout } from "../components/DashboardLayout";
import { Avatar } from "../components/Avatar";
import { StatusBadge } from "../components/StatusBadge";
import { CaseCard } from "../components/CaseCard";
import { Link } from "react-router-dom";
import {
  Briefcase,
  CalendarClock,
  Inbox,
  Users,
  TrendingUp,
  Clock,
  ArrowRight,
  Star,
  Bell,
  FileText,
  Check,
  X,
} from "lucide-react";

/* ─── Stat Card ────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, color, to }) {
  const inner = (
    <div className="bg-white rounded-2xl border border-surface-200 p-5 hover:shadow-lg hover:shadow-primary-500/5 transition-all duration-300 group">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-surface-500 font-medium">{label}</p>
          <p className="text-2xl font-bold text-surface-900 mt-1">{value}</p>
        </div>
        <div className={`flex items-center justify-center h-12 w-12 rounded-xl ${color}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
  return to ? <Link to={to}>{inner}</Link> : inner;
}

/* ─── Reminder Banner ──────────────────────────────────────── */
function ReminderBanner({ reminders, role, getLawyerById, getClientById }) {
  if (reminders.length === 0) return null;
  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-5 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-amber-100 text-amber-600">
          <Bell size={18} />
        </div>
        <h3 className="text-sm font-semibold text-amber-800">
          Upcoming Appointments
        </h3>
        <span className="ml-auto text-xs font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
          {reminders.length}
        </span>
      </div>
      <div className="space-y-2">
        {reminders.map((apt) => {
          const other =
            role === "lawyer"
              ? getClientById(apt.clientId)
              : getLawyerById(apt.lawyerId);
          return (
            <div
              key={apt.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/70 border border-amber-100"
            >
              <CalendarClock size={18} className="text-amber-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-surface-800">
                  Appointment <span className="text-amber-600 font-semibold">{apt.timeLabel}</span>
                </p>
                <p className="text-xs text-surface-500">
                  {apt.date} at {apt.time} • {other?.name || "TBD"} • {apt.duration} min
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <Link
        to="/appointments"
        className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-amber-700 hover:text-amber-800"
      >
        View all appointments <ArrowRight size={12} />
      </Link>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LAWYER DASHBOARD
   ═══════════════════════════════════════════════════════════════ */
function LawyerDashboard() {
  const {
    currentUserId,
    requests,
    cases,
    appointments,
    getLawyerById,
    getClientById,
    upcomingReminders,
    acceptRequest,
    rejectRequest,
  } = useApp();

  const lawyer = getLawyerById(currentUserId);
  const myRequests = requests.filter((r) => r.lawyerId === currentUserId);
  const myCases = cases.filter((c) => c.lawyerId === currentUserId);
  const myAppointments = appointments.filter(
    (a) => a.lawyerId === currentUserId && a.status !== "available"
  );
  const pendingReqs = myRequests.filter((r) => r.status === "pending");
  const activeCases = myCases.filter((c) => c.status === "active");

  // Unique current clients (from active cases)
  const clientIds = [...new Set(activeCases.map((c) => c.clientId))];
  const currentClients = clientIds
    .map((id) => getClientById(id))
    .filter(Boolean)
    .slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Profile header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-1/2 w-48 h-48 rounded-full bg-white/5 translate-y-1/2" />
        <div className="relative flex items-center gap-5 flex-wrap">
          <Avatar initials={lawyer?.avatar} size="xl" className="ring-4 ring-white/20" />
          <div>
            <h2 className="text-2xl font-bold">{lawyer?.name}</h2>
            <p className="text-primary-200 font-medium mt-0.5">{lawyer?.specialization}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-primary-100 flex-wrap">
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {lawyer?.experience} years
              </span>
              <span className="flex items-center gap-1">
                <Star size={14} className="fill-amber-400 text-amber-400" />
                {lawyer?.rating}
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp size={14} />
                {lawyer?.casesWon} cases won
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Reminders */}
      <ReminderBanner
        reminders={upcomingReminders}
        role="lawyer"
        getLawyerById={getLawyerById}
        getClientById={getClientById}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Inbox} label="Pending Requests" value={pendingReqs.length} color="bg-amber-50 text-amber-600" to="/requests" />
        <StatCard icon={Briefcase} label="Active Cases" value={activeCases.length} color="bg-blue-50 text-blue-600" to="/cases" />
        <StatCard icon={CalendarClock} label="Confirmed Appts" value={myAppointments.filter((a) => a.status === "confirmed").length} color="bg-emerald-50 text-emerald-600" to="/appointments" />
        <StatCard icon={Users} label="Current Clients" value={clientIds.length} color="bg-purple-50 text-purple-600" />
      </div>

      {/* Current Clients (max 2) */}
      {currentClients.length > 0 && (
        <div className="bg-white rounded-2xl border border-surface-200 p-5">
          <h3 className="text-base font-semibold text-surface-900 mb-4">
            Current Clients
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentClients.map((c) => {
              const clientCase = activeCases.find((cs) => cs.clientId === c.id);
              return (
                <div key={c.id} className="flex items-center gap-3 p-4 rounded-xl bg-surface-50 border border-surface-100">
                  <Avatar initials={c.avatar} size="md" className="from-emerald-500 to-emerald-700" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-surface-800">{c.name}</p>
                    <p className="text-xs text-surface-500 truncate">{c.email}</p>
                    {clientCase && (
                      <p className="text-xs text-primary-600 font-medium mt-0.5 truncate">{clientCase.title}</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pending Requests */}
      {pendingReqs.length > 0 && (
        <div className="bg-white rounded-2xl border border-surface-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <h3 className="text-base font-semibold text-surface-900">
                Incoming Requests
              </h3>
            </div>
            <Link to="/requests" className="text-primary-600 text-sm font-medium hover:text-primary-700 flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="space-y-2">
            {pendingReqs.slice(0, 4).map((req) => {
              const client = getClientById(req.clientId);
              return (
                <div key={req.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-50 border border-surface-100">
                  <Avatar initials={client?.avatar || "?"} size="sm" className="from-emerald-500 to-emerald-700" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-surface-800">{client?.name}</p>
                    <p className="text-xs text-surface-400 truncate">{req.message}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => acceptRequest(req.id)}
                      className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors cursor-pointer"
                      title="Accept"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => rejectRequest(req.id)}
                      className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                      title="Reject"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Cases + Appointments side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Cases */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-surface-900">Active Cases</h3>
            <Link to="/cases" className="text-primary-600 text-sm font-medium hover:text-primary-700 flex items-center gap-1">
              All <ArrowRight size={14} />
            </Link>
          </div>
          {activeCases.length === 0 ? (
            <div className="bg-white rounded-2xl border border-surface-200 p-8 text-center text-surface-400">
              <Briefcase size={32} className="mx-auto mb-2 text-surface-300" />
              <p className="text-sm">No active cases</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeCases.slice(0, 3).map((c) => (
                <CaseCard key={c.id} caseItem={c} />
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Appointments */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-surface-900">Appointments</h3>
            <Link to="/appointments" className="text-primary-600 text-sm font-medium hover:text-primary-700 flex items-center gap-1">
              All <ArrowRight size={14} />
            </Link>
          </div>
          {myAppointments.filter((a) => a.status === "confirmed").length === 0 ? (
            <div className="bg-white rounded-2xl border border-surface-200 p-8 text-center text-surface-400">
              <CalendarClock size={32} className="mx-auto mb-2 text-surface-300" />
              <p className="text-sm">No upcoming appointments</p>
            </div>
          ) : (
            <div className="space-y-2">
              {myAppointments
                .filter((a) => a.status === "confirmed")
                .slice(0, 4)
                .map((apt) => {
                  const client = getClientById(apt.clientId);
                  return (
                    <div key={apt.id} className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-surface-200">
                      <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                        <CalendarClock size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-surface-800">{apt.date} at {apt.time}</p>
                        <p className="text-xs text-surface-500">{client?.name} • {apt.duration} min</p>
                      </div>
                      <StatusBadge status={apt.status} />
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CLIENT DASHBOARD
   ═══════════════════════════════════════════════════════════════ */
function ClientDashboard() {
  const {
    currentUserId,
    requests,
    cases,
    appointments,
    documents,
    getLawyerById,
    getClientById,
    upcomingReminders,
  } = useApp();

  const client = getClientById(currentUserId);
  const myRequests = requests.filter((r) => r.clientId === currentUserId);
  const myCases = cases.filter((c) => c.clientId === currentUserId);
  const myAppointments = appointments.filter((a) => a.clientId === currentUserId);
  const myDocs = documents.filter((d) => myCases.some((c) => c.id === d.caseId));
  const activeCases = myCases.filter((c) => c.status === "active");

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-1/3 w-40 h-40 rounded-full bg-white/5 translate-y-1/2" />
        <div className="relative">
          <h2 className="text-2xl font-bold">Hello, {client?.name}!</h2>
          <p className="text-emerald-100 mt-1">
            Here's an overview of your legal matters
          </p>
        </div>
      </div>

      {/* Reminders */}
      <ReminderBanner
        reminders={upcomingReminders}
        role="client"
        getLawyerById={getLawyerById}
        getClientById={getClientById}
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Inbox} label="My Requests" value={myRequests.length} color="bg-amber-50 text-amber-600" to="/requests" />
        <StatCard icon={Briefcase} label="Active Cases" value={activeCases.length} color="bg-blue-50 text-blue-600" to="/cases" />
        <StatCard icon={CalendarClock} label="Appointments" value={myAppointments.filter((a) => a.status === "confirmed").length} color="bg-emerald-50 text-emerald-600" to="/appointments" />
        <StatCard icon={FileText} label="Documents" value={myDocs.length} color="bg-purple-50 text-purple-600" to="/documents" />
      </div>

      {/* Requested Lawyers */}
      <div className="bg-white rounded-2xl border border-surface-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-surface-900">
            Requested Lawyers
          </h3>
          <Link to="/requests" className="text-primary-600 text-sm font-medium hover:text-primary-700 flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>
        {myRequests.length === 0 ? (
          <div className="text-center py-8 text-surface-400">
            <p className="text-sm">No requests yet</p>
            <Link to="/lawyers" className="text-primary-600 text-sm font-medium mt-1 inline-block">Find a Lawyer →</Link>
          </div>
        ) : (
          <div className="space-y-2">
            {myRequests.slice(0, 4).map((req) => {
              const lawyer = getLawyerById(req.lawyerId);
              return (
                <div key={req.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-50 border border-surface-100">
                  <Avatar initials={lawyer?.avatar || "?"} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-surface-800">{lawyer?.name}</p>
                    <p className="text-xs text-surface-500">{lawyer?.specialization}</p>
                  </div>
                  <StatusBadge status={req.status} />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cases + Appointments + Documents */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Approved Cases */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-semibold text-surface-900">Approved Cases</h3>
            <Link to="/cases" className="text-primary-600 text-sm font-medium hover:text-primary-700 flex items-center gap-1">
              All <ArrowRight size={14} />
            </Link>
          </div>
          {activeCases.length === 0 ? (
            <div className="bg-white rounded-2xl border border-surface-200 p-8 text-center text-surface-400">
              <Briefcase size={32} className="mx-auto mb-2 text-surface-300" />
              <p className="text-sm">No active cases</p>
              <Link to="/lawyers" className="inline-block mt-2 text-sm font-medium text-primary-600">Find a Lawyer →</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {activeCases.slice(0, 3).map((c) => (
                <CaseCard key={c.id} caseItem={c} />
              ))}
            </div>
          )}
        </div>

        {/* Book Appointments + Recent Documents */}
        <div className="space-y-6">
          {/* Appointments */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-surface-900">My Appointments</h3>
              <Link to="/appointments" className="text-primary-600 text-sm font-medium hover:text-primary-700 flex items-center gap-1">
                Book <ArrowRight size={14} />
              </Link>
            </div>
            {myAppointments.filter((a) => a.status === "confirmed").length === 0 ? (
              <div className="bg-white rounded-2xl border border-surface-200 p-6 text-center text-surface-400">
                <CalendarClock size={28} className="mx-auto mb-2 text-surface-300" />
                <p className="text-sm">No confirmed appointments</p>
                <Link to="/appointments" className="inline-block mt-2 text-sm font-medium text-primary-600">Book Now →</Link>
              </div>
            ) : (
              <div className="space-y-2">
                {myAppointments
                  .filter((a) => a.status === "confirmed")
                  .slice(0, 3)
                  .map((apt) => {
                    const lawyer = getLawyerById(apt.lawyerId);
                    return (
                      <div key={apt.id} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-surface-200">
                        <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-blue-50 text-blue-600 shrink-0">
                          <CalendarClock size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-surface-800">{apt.date} at {apt.time}</p>
                          <p className="text-xs text-surface-500">{lawyer?.name}</p>
                        </div>
                        <StatusBadge status={apt.status} />
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Recent Documents */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-surface-900">Recent Documents</h3>
              <Link to="/documents" className="text-primary-600 text-sm font-medium hover:text-primary-700 flex items-center gap-1">
                All <ArrowRight size={14} />
              </Link>
            </div>
            {myDocs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-surface-200 p-6 text-center text-surface-400">
                <FileText size={28} className="mx-auto mb-2 text-surface-300" />
                <p className="text-sm">No documents yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {myDocs.slice(-3).reverse().map((doc) => (
                  <div key={doc.id} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-surface-200">
                    <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary-50 text-primary-600 shrink-0">
                      <FileText size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-surface-800 truncate">{doc.name}</p>
                      <p className="text-xs text-surface-400">{doc.size} • {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN DASHBOARD PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const { role } = useApp();

  return (
    <DashboardLayout>
      {role === "lawyer" ? <LawyerDashboard /> : <ClientDashboard />}
    </DashboardLayout>
  );
}
