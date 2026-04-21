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
  Activity,
  Layers,
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
  const [activeTab, setActiveTab] = useState("Overview");
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
        {/* Concise Header */}
        <div className="relative">
          <div className={`h-32 rounded-2xl ${role === "lawyer" ? "bg-primary-600" : "bg-emerald-600"}`}>
            <div className="absolute top-4 right-4">
              <button
                onClick={openEdit}
                className="px-4 py-2 rounded-lg bg-white/10 text-white text-xs font-bold border border-white/20 hover:bg-white/20 transition-all flex items-center gap-2"
              >
                <Pencil size={14} />
                Edit Profile
              </button>
            </div>
          </div>
          <div className="absolute -bottom-8 left-8 flex items-end gap-4">
            <Avatar
              initials={user.avatar}
              size="xl"
              className="ring-4 ring-white shadow-md h-24 w-24"
            />
            <div className="mb-2">
              <h1 className="text-2xl font-bold text-surface-900">{user.name}</h1>
              <p className="text-sm text-surface-500 font-medium flex items-center gap-2">
                {role === "lawyer" ? user.specialization : "Verified Client"}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8">
          {/* Tabs Navigation */}
          <div className="flex items-center gap-6 border-b border-surface-200 mb-6 overflow-x-auto no-scrollbar">
            {["Overview", "Settings", "Security"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all relative ${
                  activeTab === tab 
                    ? "text-primary-600 border-b-2 border-primary-600" 
                    : "text-surface-400 hover:text-surface-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {activeTab === "Overview" && (
              <>
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-xl border border-surface-200 space-y-4">
                    <h3 className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Contact Info</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Mail size={16} className="text-surface-400" />
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold text-surface-300 uppercase">Email</p>
                          <p className="text-sm font-medium text-surface-800 truncate">{user.email}</p>
                        </div>
                      </div>
                      {role === "client" && (
                        <>
                          <div className="flex items-center gap-3">
                            <Phone size={16} className="text-surface-400" />
                            <div className="min-w-0">
                              <p className="text-[10px] font-bold text-surface-300 uppercase">Phone</p>
                              <p className="text-sm font-medium text-surface-800">{user.phone || "Not set"}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <MapPin size={16} className="text-surface-400" />
                            <div className="min-w-0">
                              <p className="text-[10px] font-bold text-surface-300 uppercase">Address</p>
                              <p className="text-sm font-medium text-surface-800">{user.address || "Not set"}</p>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {role === "lawyer" && (
                    <div className="bg-white p-6 rounded-xl border border-surface-200">
                      <h3 className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-4">Metrics</h3>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-surface-50 border border-surface-100 text-center">
                          <p className="text-xl font-bold text-primary-600">{user.rating}</p>
                          <p className="text-[10px] font-bold text-surface-400 uppercase">Rating</p>
                        </div>
                        <div className="p-3 rounded-lg bg-surface-50 border border-surface-100 text-center">
                          <p className="text-xl font-bold text-primary-600">{user.casesWon}</p>
                          <p className="text-[10px] font-bold text-surface-400 uppercase">Won</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-2 space-y-6">
                  {role === "lawyer" && (
                    <div className="bg-white p-6 rounded-xl border border-surface-200">
                      <h3 className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-4">Biography</h3>
                      <p className="text-sm text-surface-600 leading-relaxed italic">
                        "{user.bio || "No professional summary provided."}"
                      </p>
                      <div className="mt-6 pt-6 border-t border-surface-100 flex items-center gap-6">
                        <div>
                          <p className="text-xl font-bold text-surface-900">{user.experience} yrs</p>
                          <p className="text-[10px] font-bold text-surface-400 uppercase">Experience</p>
                        </div>
                        <div className="h-8 w-px bg-surface-100"></div>
                        <div>
                          <p className="text-xl font-bold text-surface-900">Active</p>
                          <p className="text-[10px] font-bold text-surface-400 uppercase">Status</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {role === "client" && (
                    <div className="bg-white p-6 rounded-xl border border-surface-200">
                      <h3 className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-4">Case Overview</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-lg bg-surface-50 border border-surface-100 flex items-center gap-3">
                          <Activity size={20} className="text-primary-600" />
                          <p className="text-sm font-bold text-surface-900">Active Matters</p>
                        </div>
                        <div className="p-4 rounded-lg bg-surface-50 border border-surface-100 flex items-center gap-3">
                          <Layers size={20} className="text-primary-600" />
                          <p className="text-sm font-bold text-surface-900">Document Vault</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === "Settings" && (
              <div className="lg:col-span-3 space-y-8 animate-fade-in">
                <div className="bg-white rounded-[3rem] border border-surface-200 shadow-sm overflow-hidden">
                  <div className="px-10 py-8 border-b border-surface-100 bg-surface-50/50">
                    <h3 className="text-xl font-black text-surface-900 tracking-tight flex items-center gap-3">
                      <Settings size={24} className="text-primary-600" />
                      Platform Preferences
                    </h3>
                  </div>
                  <div className="p-10 space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="flex items-center justify-between p-6 rounded-[2rem] bg-surface-50 border border-surface-100 hover:border-primary-200 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="p-3.5 bg-white text-primary-600 rounded-2xl shadow-sm">
                            <BellRing size={24} />
                          </div>
                          <div>
                            <p className="text-base font-black text-surface-900">Communication Alerts</p>
                            <p className="text-xs text-surface-400 font-bold">Stay updated on case progress</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={settings.emailNotifs} onChange={(e) => setSettings({ ...settings, emailNotifs: e.target.checked })} />
                          <div className="w-14 h-7 bg-surface-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between p-6 rounded-[2rem] bg-surface-50 border border-surface-100 hover:border-primary-200 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="p-3.5 bg-white text-emerald-600 rounded-2xl shadow-sm">
                            <ShieldCheck size={24} />
                          </div>
                          <div>
                            <p className="text-base font-black text-surface-900">Advanced Security</p>
                            <p className="text-xs text-surface-400 font-bold">Biometric or SMS verification</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={settings.twoFactor} onChange={(e) => setSettings({ ...settings, twoFactor: e.target.checked })} />
                          <div className="w-14 h-7 bg-surface-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-600"></div>
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">Interface Language</label>
                        <select value={settings.language} onChange={(e) => setSettings({ ...settings, language: e.target.value })} className="w-full px-6 py-4 rounded-2xl border-2 border-surface-100 bg-white text-sm font-black outline-none focus:border-primary-500 transition-all appearance-none cursor-pointer">
                          <option value="en">English (US)</option>
                          <option value="es">Español</option>
                          <option value="fr">Français</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-surface-400 uppercase tracking-widest ml-1">Local Timezone</label>
                        <select value={settings.timezone} onChange={(e) => setSettings({ ...settings, timezone: e.target.value })} className="w-full px-6 py-4 rounded-2xl border-2 border-surface-100 bg-white text-sm font-black outline-none focus:border-primary-500 transition-all appearance-none cursor-pointer">
                          <option value="UTC">Universal Time (UTC)</option>
                          <option value="EST">Eastern Time (EST)</option>
                          <option value="PST">Pacific Time (PST)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Security" && (
              <div className="lg:col-span-3 space-y-8 animate-fade-in">
                <div className="bg-white p-10 rounded-[3rem] border border-surface-200 shadow-sm flex flex-col items-center text-center">
                   <div className="h-20 w-20 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-6 ring-8 ring-red-50/50">
                      <ShieldCheck size={40} />
                   </div>
                   <h3 className="text-2xl font-black text-surface-900 mb-2">Security Controls</h3>
                   <p className="text-surface-500 max-w-md mb-10">Manage your credentials and account access. Ensure your sensitive legal data remains protected.</p>
                   
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
                      <button
                        onClick={() => setPasswordOpen(true)}
                        className="px-8 py-5 rounded-3xl bg-surface-900 text-white font-black hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl active:scale-[0.98]"
                      >
                        <Lock size={20} />
                        Rotate Password
                      </button>
                      <button
                        onClick={() => setDeleteOpen(true)}
                        className="px-8 py-5 rounded-3xl bg-white border-2 border-red-100 text-red-600 font-black hover:bg-red-50 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                      >
                        <Trash2 size={20} />
                        Delete Identity
                      </button>
                   </div>
                </div>
              </div>
            )}
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
