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
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
        {/* Modern Header / Cover */}
        <div className="relative group">
          <div className={`h-48 rounded-3xl overflow-hidden shadow-lg ${role === "lawyer" ? "bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-900" : "bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-800"}`}>
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-6 right-6 flex gap-3">
              <button
                onClick={openEdit}
                className="px-5 py-2.5 rounded-xl bg-white/20 backdrop-blur-md text-white text-sm font-bold border border-white/30 hover:bg-white/30 transition-all cursor-pointer flex items-center gap-2"
              >
                <Pencil size={16} />
                Edit Profile
              </button>
            </div>
          </div>
          <div className="absolute -bottom-12 left-8 flex items-end gap-6">
            <div className="relative group/avatar">
              <Avatar
                initials={user.avatar}
                size="xl"
                className="ring-8 ring-white shadow-xl h-32 w-32"
              />
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                <Globe size={24} className="text-white" />
              </div>
            </div>
            <div className="mb-2">
              <h1 className="text-3xl font-black text-surface-900 tracking-tight">{user.name}</h1>
              <p className="text-surface-500 font-medium flex items-center gap-2">
                {role === "lawyer" ? (
                  <>
                    <Briefcase size={16} className="text-primary-500" />
                    {user.specialization}
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} className="text-emerald-500" />
                    Premium Client
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Quick Info */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-surface-200 shadow-sm space-y-4">
              <h3 className="text-sm font-black text-surface-400 uppercase tracking-widest">Contact Info</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 group">
                  <div className="p-2.5 rounded-xl bg-surface-50 text-surface-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                    <Mail size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-surface-400 uppercase">Email Address</p>
                    <p className="text-sm font-semibold text-surface-800 truncate">{user.email}</p>
                  </div>
                </div>
                {role === "client" && (
                  <>
                    <div className="flex items-center gap-3 group">
                      <div className="p-2.5 rounded-xl bg-surface-50 text-surface-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                        <Phone size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-surface-400 uppercase">Phone Number</p>
                        <p className="text-sm font-semibold text-surface-800">{user.phone || "Not set"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 group">
                      <div className="p-2.5 rounded-xl bg-surface-50 text-surface-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                        <MapPin size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-surface-400 uppercase">Office / Home</p>
                        <p className="text-sm font-semibold text-surface-800">{user.address || "Not set"}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {role === "lawyer" && (
              <div className="bg-white p-6 rounded-3xl border border-surface-200 shadow-sm">
                <h3 className="text-sm font-black text-surface-400 uppercase tracking-widest mb-4">Performance</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100">
                    <Star size={20} className="text-amber-500 fill-amber-500 mb-1" />
                    <p className="text-2xl font-black text-amber-700">{user.rating}</p>
                    <p className="text-[10px] font-bold text-amber-600 uppercase">Rating</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100">
                    <TrendingUp size={20} className="text-indigo-500 mb-1" />
                    <p className="text-2xl font-black text-indigo-700">{user.casesWon}</p>
                    <p className="text-[10px] font-bold text-indigo-600 uppercase">Cases Won</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio Section */}
            {role === "lawyer" && (
              <div className="bg-white p-8 rounded-3xl border border-surface-200 shadow-sm">
                <h3 className="text-sm font-black text-surface-400 uppercase tracking-widest mb-4">Biography</h3>
                <p className="text-surface-600 leading-relaxed text-lg italic font-medium">
                  "{user.bio || "No biography provided yet. Professional summary goes here."}"
                </p>
                <div className="mt-6 pt-6 border-t border-surface-100 flex items-center gap-6">
                  <div>
                    <p className="text-2xl font-black text-surface-900">{user.experience}+</p>
                    <p className="text-xs font-bold text-surface-400 uppercase tracking-wider">Years Exp.</p>
                  </div>
                  <div className="h-10 w-[1px] bg-surface-100"></div>
                  <div>
                    <p className="text-2xl font-black text-surface-900">150+</p>
                    <p className="text-xs font-bold text-surface-400 uppercase tracking-wider">Clients</p>
                  </div>
                </div>
              </div>
            )}

            {/* Account Settings */}
            <div className="bg-white rounded-3xl border border-surface-200 shadow-sm overflow-hidden">
              <div className="px-8 py-5 border-b border-surface-100 flex items-center justify-between bg-surface-50/50">
                <h3 className="font-black text-surface-900 tracking-tight flex items-center gap-2">
                  <Settings size={20} className="text-primary-600" />
                  Account Settings
                </h3>
              </div>
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex items-center justify-between p-4 rounded-2xl border border-surface-100 hover:border-primary-200 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-primary-50 text-primary-600 rounded-xl">
                        <BellRing size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-surface-800">Email Alerts</p>
                        <p className="text-[10px] text-surface-400 font-medium">Updates and reminders</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={settings.emailNotifs} onChange={(e) => setSettings({ ...settings, emailNotifs: e.target.checked })} />
                      <div className="w-11 h-6 bg-surface-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl border border-surface-100 hover:border-primary-200 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl">
                        <ShieldCheck size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-surface-800">Security Check</p>
                        <p className="text-[10px] text-surface-400 font-medium">Two-factor protection</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={settings.twoFactor} onChange={(e) => setSettings({ ...settings, twoFactor: e.target.checked })} />
                      <div className="w-11 h-6 bg-surface-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">Language</label>
                    <select value={settings.language} onChange={(e) => setSettings({ ...settings, language: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-surface-200 bg-surface-50/50 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary-500 transition-all">
                      <option value="en">English (US)</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">Timezone</label>
                    <select value={settings.timezone} onChange={(e) => setSettings({ ...settings, timezone: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-surface-200 bg-surface-50/50 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary-500 transition-all">
                      <option value="UTC">UTC (Universal)</option>
                      <option value="EST">EST (Eastern)</option>
                      <option value="PST">PST (Pacific)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Critical Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setPasswordOpen(true)}
                className="flex-1 px-8 py-4 rounded-3xl bg-white border border-surface-200 text-surface-700 font-bold hover:bg-surface-50 transition-all flex items-center justify-center gap-3 shadow-sm active:scale-[0.98] cursor-pointer"
              >
                <Lock size={20} className="text-surface-400" />
                Security Settings
              </button>
              <button
                onClick={() => setDeleteOpen(true)}
                className="flex-1 px-8 py-4 rounded-3xl bg-red-50 border border-red-100 text-red-600 font-bold hover:bg-red-100 transition-all flex items-center justify-center gap-3 shadow-sm active:scale-[0.98] cursor-pointer"
              >
                <Trash2 size={20} />
                Terminate Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Edit Modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Update Your Profile">
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">Full Legal Name</label>
            <input value={form.name || ""} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-surface-200 text-sm font-semibold focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>

          {role === "lawyer" ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">Specialization</label>
                  <input value={form.specialization || ""} onChange={(e) => setForm((p) => ({ ...p, specialization: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-surface-200 text-sm font-semibold focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">Experience (Years)</label>
                  <input type="number" value={form.experience || ""} onChange={(e) => setForm((p) => ({ ...p, experience: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-surface-200 text-sm font-semibold focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">Professional Bio</label>
                <textarea value={form.bio || ""} onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))} rows={4} className="w-full px-4 py-3 rounded-xl border border-surface-200 text-sm font-semibold focus:ring-2 focus:ring-primary-500 outline-none resize-none" />
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">Phone</label>
                <input value={form.phone || ""} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-surface-200 text-sm font-semibold focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">Address</label>
                <input value={form.address || ""} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-surface-200 text-sm font-semibold focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button onClick={() => setEditOpen(false)} className="flex-1 py-3.5 rounded-2xl border border-surface-200 font-bold text-surface-600 hover:bg-surface-50 transition-all cursor-pointer">Cancel</button>
            <button onClick={handleSave} className="flex-1 py-3.5 rounded-2xl bg-primary-600 text-white font-bold hover:bg-primary-700 shadow-lg shadow-primary-600/20 active:scale-[0.98] transition-all cursor-pointer">Commit Changes</button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete Account">
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-red-50 border border-red-100 flex gap-4">
            <AlertTriangle className="text-red-500 shrink-0" />
            <p className="text-sm font-bold text-red-700 leading-snug">This action is permanent. All legal records and cases associated with this account will be purged.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setDeleteOpen(false)} className="flex-1 py-3 rounded-xl border border-surface-200 font-bold text-surface-600 hover:bg-surface-50 transition-all cursor-pointer">Abort</button>
            <button onClick={handleDelete} className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 cursor-pointer">Delete Forever</button>
          </div>
        </div>
      </Modal>

      {/* Password Modal */}
      <Modal open={passwordOpen} onClose={() => setPasswordOpen(false)} title="Update Password">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">Old Password</label>
            <input type="password" value={pwForm.old} onChange={(e) => setPwForm((p) => ({ ...p, old: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-surface-200 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">New Password</label>
            <input type="password" value={pwForm.new} onChange={(e) => setPwForm((p) => ({ ...p, new: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-surface-200 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">Confirm New Password</label>
            <input type="password" value={pwForm.confirm} onChange={(e) => setPwForm((p) => ({ ...p, confirm: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-surface-200 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <button onClick={handlePasswordSave} className="w-full py-4 rounded-2xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 mt-4 cursor-pointer">Verify & Save</button>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
