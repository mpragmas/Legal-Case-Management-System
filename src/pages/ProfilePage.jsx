import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { DashboardLayout } from "../components/DashboardLayout";
import { Avatar } from "../components/Avatar";
import { Modal } from "../components/Modal";
import {
  Pencil,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Clock,
  Star,
  TrendingUp,
  AlertTriangle,
  Lock,
  Settings,
  BellRing,
  ShieldCheck,
  Globe,
} from "lucide-react";

export default function ProfilePage() {
  const {
    role,
    currentUserId,
    getLawyerById,
    getClientById,
    updateProfile,
    deleteProfile,
    addToast,
  } = useApp();
  const navigate = useNavigate();

  const user =
    role === "lawyer" ? getLawyerById(currentUserId) : getClientById(currentUserId);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [form, setForm] = useState({});
  const [pwForm, setPwForm] = useState({ old: "", new: "", confirm: "" });
  const [settings, setSettings] = useState({
    emailNotifs: true,
    twoFactor: false,
    language: "en",
    timezone: "UTC",
  });

  const openEdit = () => {
    if (role === "lawyer") {
      setForm({
        name: user?.name || "",
        specialization: user?.specialization || "",
        experience: user?.experience || "",
        bio: user?.bio || "",
      });
    } else {
      setForm({
        name: user?.name || "",
        phone: user?.phone || "",
        address: user?.address || "",
      });
    }
    setEditOpen(true);
  };

  const handleSave = () => {
    const cleaned = { ...form };
    if (cleaned.experience) cleaned.experience = parseInt(cleaned.experience) || 0;
    // Derive new avatar from name
    if (cleaned.name) {
      const parts = cleaned.name.trim().split(" ");
      cleaned.avatar =
        parts.length >= 2
          ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
          : cleaned.name.slice(0, 2).toUpperCase();
    }
    updateProfile(cleaned);
    setEditOpen(false);
  };

  const handlePasswordSave = () => {
    if (pwForm.new !== pwForm.confirm) {
      addToast("Passwords do not match", "error");
      return;
    }
    setPasswordOpen(false);
    setPwForm({ old: "", new: "", confirm: "" });
    addToast("Password changed successfully", "success");
  };

  const handleDelete = () => {
    setDeleteOpen(false);
    deleteProfile();
    setTimeout(() => navigate("/login"), 1500);
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-surface-900">My Profile</h1>
          <div className="flex items-center gap-2">
            <button
              id="edit-profile-btn"
              onClick={openEdit}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors active:scale-[0.98] cursor-pointer shadow-sm shadow-primary-600/20"
            >
              <Pencil size={16} />
              Edit Profile
            </button>
            <button
              id="delete-profile-btn"
              onClick={() => setDeleteOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors cursor-pointer"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden">
          {/* Banner */}
          <div className={`h-32 ${role === "lawyer" ? "bg-gradient-to-r from-primary-600 to-primary-800" : "bg-gradient-to-r from-emerald-600 to-teal-700"} relative`}>
            <div className="absolute -bottom-10 left-6">
              <Avatar
                initials={user.avatar}
                size="xl"
                className="ring-4 ring-white"
              />
            </div>
          </div>

          {/* Info */}
          <div className="pt-14 pb-6 px-6">
            <h2 className="text-2xl font-bold text-surface-900">{user.name}</h2>

            {role === "lawyer" ? (
              <>
                <p className="text-sm text-primary-600 font-medium mt-0.5">
                  {user.specialization}
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-surface-500">
                  <span className="flex items-center gap-1.5">
                    <Clock size={15} className="text-surface-400" />
                    {user.experience} years experience
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Star
                      size={15}
                      className="text-amber-400 fill-amber-400"
                    />
                    {user.rating} rating
                  </span>
                  <span className="flex items-center gap-1.5">
                    <TrendingUp size={15} className="text-surface-400" />
                    {user.casesWon} cases won
                  </span>
                </div>

                <div className="flex items-center gap-1.5 mt-3 text-sm text-surface-500">
                  <Mail size={15} className="text-surface-400" />
                  {user.email}
                </div>

                <div className="mt-5 p-4 rounded-xl bg-surface-50 border border-surface-100">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-surface-400 mb-2">
                    Bio
                  </h3>
                  <p className="text-sm text-surface-600 leading-relaxed">
                    {user.bio}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2.5 mt-4">
                  <div className="flex items-center gap-2 text-sm text-surface-600">
                    <Mail size={16} className="text-surface-400" />
                    {user.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-surface-600">
                    <Phone size={16} className="text-surface-400" />
                    {user.phone}
                  </div>
                  {user.address && (
                    <div className="flex items-center gap-2 text-sm text-surface-600">
                      <MapPin size={16} className="text-surface-400" />
                      {user.address}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-surface-100 flex items-center gap-2">
            <Settings size={18} className="text-surface-500" />
            <h3 className="text-base font-semibold text-surface-900">Account Settings</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Notifs */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-50 text-primary-600 rounded-lg">
                    <BellRing size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-surface-800">Email Notifications</p>
                    <p className="text-xs text-surface-400">Receive updates via email</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.emailNotifs}
                    onChange={(e) => setSettings({ ...settings, emailNotifs: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              {/* 2FA */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary-50 text-primary-600 rounded-lg">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-surface-800">Two-Factor Authentication</p>
                    <p className="text-xs text-surface-400">Enhance account security</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={settings.twoFactor}
                    onChange={(e) => setSettings({ ...settings, twoFactor: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-surface-100">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5 flex items-center gap-2">
                  <Globe size={16} className="text-surface-400" /> Language
                </label>
                <select
                  value={settings.language}
                  onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="en">English (US)</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5 flex items-center gap-2">
                  <Clock size={16} className="text-surface-400" /> Timezone
                </label>
                <select
                  value={settings.timezone}
                  onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="UTC">UTC (Universal)</option>
                  <option value="EST">EST (Eastern)</option>
                  <option value="PST">PST (Pacific)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Security / Password */}
        <div className="bg-white rounded-2xl border border-surface-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-surface-100 flex items-center gap-2">
            <Lock size={18} className="text-surface-500" />
            <h3 className="text-base font-semibold text-surface-900">Security</h3>
          </div>
          <div className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-surface-800">Password</p>
              <p className="text-xs text-surface-400 mt-0.5">Last changed 3 months ago</p>
            </div>
            <button
              onClick={() => setPasswordOpen(true)}
              className="px-4 py-2 rounded-xl border border-surface-200 text-sm font-semibold text-surface-600 hover:bg-surface-50 transition-colors cursor-pointer"
            >
              Change Password
            </button>
          </div>
        </div>

      </div>

      {/* Edit Modal */}
      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit Profile"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">
              Full Name
            </label>
            <input
              id="edit-name"
              value={form.name || ""}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {role === "lawyer" ? (
            <>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">
                  Specialization
                </label>
                <input
                  id="edit-specialization"
                  value={form.specialization || ""}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, specialization: e.target.value }))
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">
                  Years of Experience
                </label>
                <input
                  id="edit-experience"
                  type="number"
                  value={form.experience || ""}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, experience: e.target.value }))
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">
                  Bio
                </label>
                <textarea
                  id="edit-bio"
                  value={form.bio || ""}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, bio: e.target.value }))
                  }
                  rows={4}
                  className="w-full px-3 py-2.5 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">
                  Phone
                </label>
                <input
                  id="edit-phone"
                  value={form.phone || ""}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, phone: e.target.value }))
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">
                  Address
                </label>
                <input
                  id="edit-address"
                  value={form.address || ""}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, address: e.target.value }))
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setEditOpen(false)}
              className="px-4 py-2 rounded-xl border border-surface-200 text-sm font-semibold text-surface-600 hover:bg-surface-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="save-profile"
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors cursor-pointer shadow-sm shadow-primary-600/20"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete Profile"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-100">
            <AlertTriangle size={20} className="text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-700">
                This action cannot be undone
              </p>
              <p className="text-xs text-red-600 mt-1">
                Your profile and all associated data will be permanently removed.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteOpen(false)}
              className="px-4 py-2 rounded-xl border border-surface-200 text-sm font-semibold text-surface-600 hover:bg-surface-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="confirm-delete-profile"
              onClick={handleDelete}
              className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors cursor-pointer shadow-sm shadow-red-600/20"
            >
              Delete Profile
            </button>
          </div>
        </div>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
        title="Change Password"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              value={pwForm.old}
              onChange={(e) => setPwForm((p) => ({ ...p, old: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">
              New Password
            </label>
            <input
              type="password"
              value={pwForm.new}
              onChange={(e) => setPwForm((p) => ({ ...p, new: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1.5">
              Confirm New Password
            </label>
            <input
              type="password"
              value={pwForm.confirm}
              onChange={(e) => setPwForm((p) => ({ ...p, confirm: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl border border-surface-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setPasswordOpen(false)}
              className="px-4 py-2 rounded-xl border border-surface-200 text-sm font-semibold text-surface-600 hover:bg-surface-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handlePasswordSave}
              className="px-4 py-2 rounded-xl bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 transition-colors cursor-pointer shadow-sm shadow-primary-600/20"
            >
              Update Password
            </button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
