import { NavLink } from "react-router-dom";
import { useApp } from "../context/AppContext";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CalendarClock,
  FileText,
  Inbox,
  Scale,
  UserCircle,
  X,
} from "lucide-react";

const lawyerLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/requests", label: "Requests", icon: Inbox },
  { to: "/cases", label: "Cases", icon: Briefcase },
  { to: "/appointments", label: "Appointments", icon: CalendarClock },
  { to: "/documents", label: "Documents", icon: FileText },
  { to: "/profile", label: "My Profile", icon: UserCircle },
];

const clientLinks = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/lawyers", label: "Find Lawyers", icon: Users },
  { to: "/requests", label: "My Requests", icon: Inbox },
  { to: "/cases", label: "My Cases", icon: Briefcase },
  { to: "/appointments", label: "Appointments", icon: CalendarClock },
  { to: "/documents", label: "Documents", icon: FileText },
  { to: "/profile", label: "My Profile", icon: UserCircle },
];

export function Sidebar({ open, onClose }) {
  const { role, currentUserId, getLawyerById, getClientById } = useApp();
  const links = role === "lawyer" ? lawyerLinks : clientLinks;
  const user =
    role === "lawyer" ? getLawyerById(currentUserId) : getClientById(currentUserId);

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-surface-900/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-white border-r border-surface-200 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-surface-200">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700">
              <Scale size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              LegalDesk
            </span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-surface-400 hover:bg-surface-100 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  isActive
                    ? "bg-primary-50 text-primary-700"
                    : "text-surface-500 hover:bg-surface-50 hover:text-surface-800"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <link.icon
                    size={20}
                    className={`transition-colors ${
                      isActive
                        ? "text-primary-600"
                        : "text-surface-400 group-hover:text-surface-600"
                    }`}
                  />
                  {link.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom user info */}
        <div className="px-4 py-4 border-t border-surface-200">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-surface-50">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-white text-xs font-bold shrink-0">
              {user?.avatar || "?"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-surface-700 truncate">
                {user?.name}
              </p>
              <p className="text-[10px] font-medium uppercase tracking-wider text-surface-400">
                {role}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
