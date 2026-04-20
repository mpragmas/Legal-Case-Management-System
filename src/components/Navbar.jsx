import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Avatar } from "./Avatar";
import { NotificationBell } from "./NotificationBell";
import { Menu, LogOut } from "lucide-react";

export function Navbar({ onMenuClick }) {
  const { role, currentUserId, getLawyerById, getClientById, logout } = useApp();
  const navigate = useNavigate();

  const user =
    role === "lawyer" ? getLawyerById(currentUserId) : getClientById(currentUserId);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-white/80 backdrop-blur-lg border-b border-surface-200 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg text-surface-400 hover:bg-surface-100 transition-colors cursor-pointer"
        >
          <Menu size={22} />
        </button>
        <h1 className="text-sm font-medium text-surface-500 hidden sm:block">
          Welcome back,{" "}
          <span className="text-surface-800 font-semibold">{user?.name}</span>
        </h1>
      </div>

      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        <NotificationBell />

        {/* Logout */}
        <button
          id="logout-btn"
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-surface-500 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
          title="Log out"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Logout</span>
        </button>

        {/* User avatar */}
        <div className="flex items-center gap-2.5 ml-1">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-surface-800 leading-tight">
              {user?.name}
            </p>
            <p className="text-xs text-surface-400 capitalize">{role}</p>
          </div>
          <Avatar initials={user?.avatar || "?"} />
        </div>
      </div>
    </header>
  );
}
