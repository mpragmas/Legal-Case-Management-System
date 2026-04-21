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
  TrendingUp,
  Clock,
  Star,
  Bell,
  FileText,
  Check,
  X,
  Activity,
  Layers,
} from "lucide-react";

/* ─── Stat Card ────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, color, to }) {
  const inner = (
    <div className="bg-white rounded-xl border border-surface-200 p-4 hover:border-primary-300 transition-all duration-200 group">
      <div className="flex items-center gap-4">
        <div className={`flex items-center justify-center h-10 w-10 rounded-lg ${color} shrink-0`}>
          <Icon size={20} />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-surface-500 font-bold uppercase tracking-wider">{label}</p>
          <p className="text-xl font-bold text-surface-900">{value}</p>
        </div>
      </div>
    </div>
  );
  return to ? <Link to={to}>{inner}</Link> : inner;
}

/* ─── Activity Chart ─────────────────────────────────── */
function ActivityChart({ data, title }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="bg-white rounded-xl border border-surface-200 p-5">
      <h3 className="text-sm font-bold text-surface-900 mb-6">{title}</h3>
      <div className="flex items-end justify-between h-32 gap-2">
        {data.map((item, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
            <div
              className="w-full bg-primary-100 rounded-t-md group-hover:bg-primary-500 transition-all duration-300"
              style={{ height: `${Math.round((item.value / max) * 96)}px`, minHeight: "3px" }}
            />
            <span className="text-[10px] font-bold text-surface-400 uppercase">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Reminder Banner ──────────────────────────────────────── */
function ReminderBanner({ reminders, role, getLawyerById, getClientById }) {
  if (reminders.length === 0) return null;
  return (
    <div className="bg-surface-50 rounded-xl border border-surface-200 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Bell size={16} className="text-primary-600" />
        <h3 className="text-[10px] font-bold text-surface-900 uppercase tracking-widest">Upcoming</h3>
      </div>
      <div className="space-y-2">
        {reminders.slice(0, 1).map((apt) => {
          const other = role === "lawyer" ? getClientById(apt.clientId) : getLawyerById(apt.lawyerId);
          return (
            <div key={apt.id} className="flex items-center gap-3 p-2 rounded-lg bg-white border border-surface-100">
              <Clock size={14} className="text-surface-400" />
              <div className="flex-1 min-w-0 text-xs">
                <p className="font-bold text-surface-900">{apt.timeLabel}</p>
                <p className="text-surface-500 truncate">{other?.name}</p>
              </div>
            </div>
          );
        })}
      </div>
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

  const myId = Number(currentUserId);
  const lawyer = getLawyerById(currentUserId);
  const myRequests = requests.filter((r) => r.lawyerId === myId);
  const myCases = cases.filter((c) => c.lawyerId === myId);
  const pendingReqs = myRequests.filter((r) => r.status === "pending");
  const activeCases = myCases.filter((c) => c.status === "active");

  // Dynamic activity data: Appointments per day this week
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const activityData = days.map((day, idx) => {
    const count = appointments.filter(a => {
      const d = new Date(a.date + "T00:00:00");
      return d.getDay() === idx && a.lawyerId === myId;
    }).length;
    return { label: day, value: count };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Lawyer Dashboard</h1>
          <p className="text-sm text-surface-500">Welcome back, counselor.</p>
        </div>
        <ReminderBanner
          reminders={upcomingReminders}
          role="lawyer"
          getLawyerById={getLawyerById}
          getClientById={getClientById}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Inbox} label="Requests" value={pendingReqs.length} color="bg-amber-50 text-amber-600" to="/requests" />
        <StatCard icon={Briefcase} label="Active" value={activeCases.length} color="bg-blue-50 text-blue-600" to="/cases" />
        <StatCard icon={CalendarClock} label="Today" value={upcomingReminders.length} color="bg-emerald-50 text-emerald-600" to="/appointments" />
        <StatCard icon={Star} label="Rating" value={lawyer?.rating || "0.0"} color="bg-purple-50 text-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ActivityChart data={activityData} title="Weekly Activity" />
          <div className="bg-white rounded-xl border border-surface-200 p-5">
            <h3 className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-4">Priority Requests</h3>
            {pendingReqs.length === 0 ? (
              <p className="text-sm text-surface-400 italic text-center py-4">No pending requests</p>
            ) : (
              <div className="space-y-3">
                {pendingReqs.slice(0, 3).map((req) => {
                  const client = getClientById(req.clientId);
                  return (
                    <div key={req.id} className="flex items-center gap-3 p-3 rounded-lg bg-surface-50 border border-surface-100">
                      <Avatar initials={client?.avatar} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-surface-800 truncate">{client?.name}</p>
                        <p className="text-xs text-surface-400 truncate">{req.message}</p>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => acceptRequest(req.id)} className="p-1.5 rounded-md bg-white border border-surface-200 text-emerald-600 hover:bg-emerald-50">
                          <Check size={14} />
                        </button>
                        <button onClick={() => rejectRequest(req.id)} className="p-1.5 rounded-md bg-white border border-surface-200 text-red-600 hover:bg-red-50">
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-surface-200 p-5">
          <h3 className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-4">Active Matters</h3>
          <div className="space-y-3">
            {activeCases.slice(0, 5).map((c) => (
              <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-50 border border-transparent hover:border-surface-100 cursor-pointer group">
                <div className="h-8 w-8 rounded bg-surface-100 text-surface-500 flex items-center justify-center text-[10px] font-bold">
                  {c.id}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-surface-900 truncate group-hover:text-primary-600">{c.title}</h4>
                  <p className="text-[10px] font-bold text-surface-400 uppercase">{c.status}</p>
                </div>
              </div>
            ))}
            {activeCases.length === 0 && <p className="text-xs text-surface-400 italic text-center">No active cases</p>}
          </div>
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

  const myId = Number(currentUserId);
  const client = getClientById(currentUserId);
  const myRequests = requests.filter((r) => r.clientId === myId);
  const myCases = cases.filter((c) => c.clientId === myId);
  const myAppointments = appointments.filter((a) => a.clientId === myId);
  const myDocs = documents.filter((d) => myCases.some((c) => c.id === d.caseId));
  const activeCases = myCases.filter((c) => c.status === "active");

  // Dynamic progress data: Cases created per month
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const progressData = months.map((m, idx) => {
    const count = myCases.filter(c => new Date(c.createdAt).getMonth() === idx).length;
    return { label: m, value: count };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Client Portal</h1>
          <p className="text-sm text-surface-500">Hello, {client?.name}.</p>
        </div>
        <ReminderBanner
          reminders={upcomingReminders}
          role="client"
          getLawyerById={getLawyerById}
          getClientById={getClientById}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Inbox} label="Requests" value={myRequests.length} color="bg-amber-50 text-amber-600" to="/requests" />
        <StatCard icon={Briefcase} label="Active" value={activeCases.length} color="bg-blue-50 text-blue-600" to="/cases" />
        <StatCard icon={CalendarClock} label="Appts" value={myAppointments.length} color="bg-emerald-50 text-emerald-600" to="/appointments" />
        <StatCard icon={FileText} label="Documents" value={myDocs.length} color="bg-purple-50 text-purple-600" to="/documents" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ActivityChart data={progressData} title="Legal Progress" />
          <div className="bg-white rounded-xl border border-surface-200 p-5">
            <h3 className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-4">Active Matters</h3>
            {activeCases.length === 0 ? (
              <div className="text-center py-10 bg-surface-50 rounded-xl border-2 border-dashed border-surface-200">
                <p className="text-sm text-surface-500 font-bold mb-4">No active cases found</p>
                <Link to="/lawyers" className="px-6 py-2 rounded-lg bg-primary-600 text-white text-sm font-bold">Find a Lawyer</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeCases.slice(0, 4).map((c) => (
                  <CaseCard key={c.id} caseItem={c} />
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-surface-200 p-5">
            <h3 className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-4">Files</h3>
            <div className="space-y-3">
              {myDocs.slice(-3).reverse().map((doc) => (
                <div key={doc.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-50 cursor-pointer group">
                  <div className="h-8 w-8 rounded bg-primary-50 text-primary-600 flex items-center justify-center">
                    <FileText size={14} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-surface-900 truncate group-hover:text-primary-600">{doc.name}</p>
                    <p className="text-[10px] font-bold text-surface-400 uppercase">{doc.size}</p>
                  </div>
                </div>
              ))}
              {myDocs.length === 0 && <p className="text-xs text-surface-400 italic text-center">No documents</p>}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-surface-200 p-5">
            <h3 className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-4">Representation</h3>
            <div className="space-y-3">
              {myRequests.slice(0, 3).map((req) => {
                const lawyer = getLawyerById(req.lawyerId);
                return (
                  <div key={req.id} className="flex items-center gap-3">
                    <Avatar initials={lawyer?.avatar} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-surface-900 truncate">{lawyer?.name}</p>
                      <StatusBadge status={req.status} />
                    </div>
                  </div>
                );
              })}
              {myRequests.length === 0 && <p className="text-xs text-surface-400 italic text-center">No requests</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { role } = useApp();
  return (
    <DashboardLayout>
      {role === "lawyer" ? <LawyerDashboard /> : <ClientDashboard />}
    </DashboardLayout>
  );
}
