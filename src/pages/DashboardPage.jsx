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
  Zap,
  Activity,
  Layers,
} from "lucide-react";

/* ─── Modern Stat Card ─────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, color, to, trend }) {
  const inner = (
    <div className="bg-white rounded-[2rem] border border-surface-200 p-6 hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-500 group relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon size={80} />
      </div>
      <div className="relative flex items-start justify-between">
        <div className="space-y-3">
          <div className={`inline-flex items-center justify-center h-12 w-12 rounded-2xl ${color} shadow-sm`}>
            <Icon size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-surface-400 uppercase tracking-widest">{label}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black text-surface-900 tracking-tight">{value}</p>
              {trend && <span className="text-xs font-bold text-emerald-500">{trend}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  return to ? <Link to={to}>{inner}</Link> : inner;
}

/* ─── Improved Reminder Banner ─────────────────────────────── */
function ReminderBanner({ reminders, role, getLawyerById, getClientById }) {
  if (reminders.length === 0) return null;
  return (
    <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-[2.5rem] p-8 text-white shadow-xl shadow-amber-500/20 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-110 transition-transform duration-700">
        <Zap size={120} />
      </div>
      <div className="relative flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-widest mb-4">
            <Activity size={12} /> Live Action Needed
          </div>
          <h3 className="text-2xl font-black tracking-tight mb-2">Upcoming Meetings</h3>
          <p className="text-amber-50 font-medium max-w-md">
            You have {reminders.length} session{reminders.length > 1 ? 's' : ''} scheduled for today. Don't be late!
          </p>
        </div>
        <div className="flex -space-x-3 overflow-hidden">
          {reminders.slice(0, 3).map((apt) => {
             const other = role === "lawyer" ? getClientById(apt.clientId) : getLawyerById(apt.lawyerId);
             return <Avatar key={apt.id} initials={other?.avatar} className="ring-4 ring-amber-500" size="md" />
          })}
          {reminders.length > 3 && (
            <div className="h-10 w-10 rounded-full bg-amber-600 flex items-center justify-center text-xs font-bold ring-4 ring-amber-500">
              +{reminders.length - 3}
            </div>
          )}
        </div>
        <Link to="/appointments" className="px-6 py-3 rounded-2xl bg-white text-amber-600 font-bold hover:bg-amber-50 transition-colors shadow-lg active:scale-95">
          Join Session
        </Link>
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

  const lawyer = getLawyerById(currentUserId);
  const myRequests = requests.filter((r) => r.lawyerId === currentUserId);
  const myCases = cases.filter((c) => c.lawyerId === currentUserId);
  const activeCases = myCases.filter((c) => c.status === "active");
  const pendingReqs = myRequests.filter((r) => r.status === "pending");

  return (
    <div className="space-y-10">
      {/* Dynamic Header */}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 bg-white rounded-[3rem] border border-surface-200 p-8 shadow-sm flex items-center gap-8 flex-wrap">
          <Avatar initials={lawyer?.avatar} size="xl" className="ring-8 ring-primary-50" />
          <div className="flex-1 min-w-[200px]">
            <p className="text-xs font-black text-primary-600 uppercase tracking-widest mb-1">Elite Counsel</p>
            <h2 className="text-3xl font-black text-surface-900 tracking-tight">Welcome back, {lawyer?.name}</h2>
            <div className="flex items-center gap-4 mt-3 flex-wrap">
               <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-50 text-surface-500 text-xs font-bold border border-surface-100">
                 <Star size={14} className="fill-amber-400 text-amber-400" /> {lawyer?.rating} Rating
               </span>
               <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-50 text-surface-500 text-xs font-bold border border-surface-100">
                 <Check size={14} className="text-emerald-500" /> {lawyer?.casesWon} Won
               </span>
            </div>
          </div>
        </div>
        <div className="lg:w-1/3">
          <ReminderBanner reminders={upcomingReminders} role="lawyer" getLawyerById={getLawyerById} getClientById={getClientById} />
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Inbox} label="New Inbound" value={pendingReqs.length} color="bg-amber-100 text-amber-600" to="/requests" trend="+2 today" />
        <StatCard icon={Briefcase} label="Managed Cases" value={activeCases.length} color="bg-primary-100 text-primary-600" to="/cases" trend="0% change" />
        <StatCard icon={CalendarClock} label="Today's Agenda" value={upcomingReminders.length} color="bg-indigo-100 text-indigo-600" to="/appointments" trend="Full day" />
        <StatCard icon={Users} label="Total Reach" value={myCases.length + pendingReqs.length} color="bg-purple-100 text-purple-600" trend="+5% week" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left: Inbound Queue */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-surface-900 tracking-tight flex items-center gap-2">
              <Layers size={24} className="text-primary-600" />
              Inbound Request Queue
            </h3>
            <Link to="/requests" className="text-sm font-bold text-primary-600 hover:underline">View Priority →</Link>
          </div>
          
          {pendingReqs.length === 0 ? (
            <div className="bg-surface-50 rounded-[2.5rem] border-2 border-dashed border-surface-200 p-20 text-center">
              <Inbox size={48} className="mx-auto mb-4 text-surface-300" />
              <p className="text-surface-500 font-bold">Your queue is currently empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingReqs.slice(0, 3).map((req) => {
                const client = getClientById(req.clientId);
                return (
                  <div key={req.id} className="bg-white rounded-3xl border border-surface-200 p-6 flex items-center gap-6 hover:shadow-md transition-shadow group">
                    <Avatar initials={client?.avatar} size="lg" className="ring-4 ring-surface-50" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-black text-surface-900 truncate">{client?.name}</h4>
                        <span className="px-2 py-0.5 rounded-md bg-amber-50 text-[10px] font-black text-amber-600 uppercase tracking-widest">Priority</span>
                      </div>
                      <p className="text-sm text-surface-500 line-clamp-1">{req.message}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => acceptRequest(req.id)} className="px-6 py-2.5 rounded-xl bg-primary-600 text-white font-bold text-sm hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20 active:scale-95">Accept</button>
                      <button onClick={() => rejectRequest(req.id)} className="p-2.5 rounded-xl border border-surface-200 text-surface-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Active Radar */}
        <div className="space-y-6">
          <h3 className="text-xl font-black text-surface-900 tracking-tight flex items-center gap-2">
            <Briefcase size={24} className="text-indigo-600" />
            Active Radar
          </h3>
          <div className="space-y-4">
            {activeCases.slice(0, 4).map((c) => (
              <div key={c.id} className="bg-white rounded-3xl border border-surface-200 p-5 hover:border-primary-300 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                    {c.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-black text-surface-900 truncate group-hover:text-primary-600 transition-colors">{c.title}</h4>
                    <p className="text-xs text-surface-400 font-bold uppercase tracking-widest mt-0.5">{c.status}</p>
                  </div>
                </div>
              </div>
            ))}
            <Link to="/cases" className="block w-full py-4 text-center text-sm font-black text-surface-400 hover:text-primary-600 transition-colors uppercase tracking-widest">
              View All Radar →
            </Link>
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

  const client = getClientById(currentUserId);
  const myRequests = requests.filter((r) => r.clientId === currentUserId);
  const myCases = cases.filter((c) => c.clientId === currentUserId);
  const activeCases = myCases.filter((c) => c.status === "active");
  const myDocs = documents.filter((d) => myCases.some((c) => c.id === d.caseId));

  return (
    <div className="space-y-10 pb-10">
      {/* Portal Header */}
      <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-900 p-12 text-white shadow-2xl shadow-emerald-900/20">
        <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12">
          <Layers size={200} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-widest mb-6">
              Verified Client Portal
            </div>
            <h2 className="text-5xl font-black tracking-tight mb-2">Hello, {client?.name}!</h2>
            <p className="text-emerald-100 text-lg font-medium max-w-lg">
              Your legal journey is in progress. We've compiled your latest updates and case statuses here.
            </p>
          </div>
          <div className="flex gap-4">
             <div className="p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 text-center min-w-[120px]">
               <p className="text-3xl font-black">{activeCases.length}</p>
               <p className="text-[10px] font-black uppercase tracking-widest text-emerald-300">Active Cases</p>
             </div>
             <div className="p-4 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 text-center min-w-[120px]">
               <p className="text-3xl font-black">{myDocs.length}</p>
               <p className="text-[10px] font-black uppercase tracking-widest text-emerald-300">Total Docs</p>
             </div>
          </div>
        </div>
      </div>

      {/* Urgent Reminders */}
      <ReminderBanner reminders={upcomingReminders} role="client" getLawyerById={getLawyerById} getClientById={getClientById} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Feed: Cases */}
        <div className="lg:col-span-2 space-y-8">
           <div className="flex items-center justify-between">
              <h3 className="text-2xl font-black text-surface-900 tracking-tight">Active Legal Matters</h3>
              <Link to="/cases" className="text-sm font-bold text-primary-600 hover:underline">Full Portfolio →</Link>
           </div>

           {activeCases.length === 0 ? (
             <div className="bg-white rounded-[2.5rem] border border-surface-200 p-16 text-center shadow-sm">
                <Briefcase size={64} className="mx-auto mb-6 text-surface-200" />
                <h4 className="text-xl font-black text-surface-900 mb-2">No Active Cases Yet</h4>
                <p className="text-surface-500 mb-8 max-w-xs mx-auto">Start by browsing our legal experts and submitting a representation request.</p>
                <Link to="/lawyers" className="px-8 py-4 rounded-2xl bg-primary-600 text-white font-black shadow-xl shadow-primary-600/20 hover:scale-105 transition-transform inline-block">Find a Lawyer</Link>
             </div>
           ) : (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeCases.slice(0, 4).map((c) => (
                  <CaseCard key={c.id} caseItem={c} />
                ))}
             </div>
           )}
        </div>

        {/* Sidebar: Documents & Requests */}
        <div className="space-y-10">
           {/* Recent Files */}
           <div className="bg-white rounded-[2.5rem] border border-surface-200 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-surface-900 flex items-center gap-2">
                  <FileText size={20} className="text-primary-600" />
                  Recent Files
                </h3>
                <Link to="/documents" className="text-xs font-bold text-surface-400 hover:text-primary-600 uppercase">View All</Link>
              </div>
              
              {myDocs.length === 0 ? (
                <p className="text-sm text-surface-400 py-4 italic">No documents shared yet.</p>
              ) : (
                <div className="space-y-4">
                  {myDocs.slice(-4).reverse().map((doc) => (
                    <div key={doc.id} className="flex items-center gap-4 group cursor-pointer">
                      <div className="h-10 w-10 rounded-xl bg-surface-50 text-surface-400 flex items-center justify-center group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                        <FileText size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-surface-800 truncate group-hover:text-primary-600 transition-colors">{doc.name}</p>
                        <p className="text-[10px] font-bold text-surface-400 uppercase">{doc.size} • {new Date(doc.uploadedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
           </div>

           {/* Representation Requests */}
           <div className="bg-white rounded-[2.5rem] border border-surface-200 p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-surface-900 flex items-center gap-2">
                  <Inbox size={20} className="text-amber-500" />
                  Sent Requests
                </h3>
                <Link to="/requests" className="text-xs font-bold text-surface-400 hover:text-primary-600 uppercase">Full History</Link>
              </div>

              <div className="space-y-4">
                {myRequests.slice(0, 3).map((req) => {
                  const lawyer = getLawyerById(req.lawyerId);
                  return (
                    <div key={req.id} className="flex items-center gap-4">
                      <Avatar initials={lawyer?.avatar} size="md" className="ring-2 ring-surface-50" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-surface-800 truncate">{lawyer?.name}</p>
                        <StatusBadge status={req.status} />
                      </div>
                    </div>
                  );
                })}
                {myRequests.length === 0 && <p className="text-sm text-surface-400 italic">No pending requests.</p>}
              </div>
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
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
        {role === "lawyer" ? <LawyerDashboard /> : <ClientDashboard />}
      </div>
    </DashboardLayout>
  );
}
