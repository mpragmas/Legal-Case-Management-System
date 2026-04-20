import { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Bell, CalendarClock, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export function NotificationBell() {
  const { upcomingReminders, notifications, markAsRead, getLawyerById, getClientById, role } = useApp();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const unreadNotifications = notifications.filter((n) => !n.isRead);
  const count = upcomingReminders.length + unreadNotifications.length;

  return (
    <div className="relative" ref={ref}>
      <button
        id="notification-bell"
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-xl text-surface-400 hover:bg-surface-100 hover:text-surface-600 transition-all cursor-pointer"
      >
        <Bell size={20} />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-bold ring-2 ring-white animate-pulse">
            {count}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-surface-200 shadow-2xl animate-scale-in overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-surface-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-surface-800">
              Notifications
            </h3>
            <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
              {count} New
            </span>
          </div>

          <div className="max-h-96 overflow-y-auto divide-y divide-surface-50">
            {/* Appointment Reminders */}
            {upcomingReminders.map((apt) => {
              const other =
                role === "lawyer"
                  ? getClientById(apt.clientId)
                  : getLawyerById(apt.lawyerId);
              return (
                <div
                  key={`apt-${apt.id}`}
                  className="px-4 py-3 bg-amber-50/30 hover:bg-amber-50/50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-amber-100 text-amber-600 shrink-0 mt-0.5">
                      <CalendarClock size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-surface-800">
                        Appointment {apt.timeLabel}
                      </p>
                      <p className="text-xs text-surface-500 mt-0.5">
                        {apt.date} at {apt.time} • {other?.name || "Unassigned"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* General Notifications */}
            {notifications.map((n) => (
              <div
                key={`notif-${n.id}`}
                className={`px-4 py-3 hover:bg-surface-50 transition-colors ${!n.isRead ? 'bg-primary-50/20' : ''}`}
                onClick={() => !n.isRead && markAsRead(n.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`flex items-center justify-center h-9 w-9 rounded-xl shrink-0 mt-0.5 ${!n.isRead ? 'bg-primary-100 text-primary-600' : 'bg-surface-100 text-surface-400'}`}>
                    <Bell size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!n.isRead ? 'font-semibold text-surface-900' : 'text-surface-600'}`}>
                      {n.message}
                    </p>
                    <p className="text-[10px] text-surface-400 mt-1">
                      {new Date(n.sentAt).toLocaleString()}
                    </p>
                  </div>
                  {!n.isRead && (
                    <div className="h-2 w-2 rounded-full bg-primary-500 mt-2" />
                  )}
                </div>
              </div>
            ))}

            {count === 0 && (
              <div className="px-4 py-8 text-center text-surface-400">
                <Bell size={28} className="mx-auto mb-2 text-surface-300" />
                <p className="text-sm">No new notifications</p>
              </div>
            )}
          </div>

          <div className="px-4 py-2.5 border-t border-surface-100 bg-surface-50">
            <Link
              to="/appointments"
              onClick={() => setOpen(false)}
              className="text-xs font-semibold text-primary-600 hover:text-primary-700"
            >
              View all appointments →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
