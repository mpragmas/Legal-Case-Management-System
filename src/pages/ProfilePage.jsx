import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { api } from "../services/api";
import { DashboardLayout } from "../components/DashboardLayout";
import { Avatar } from "../components/Avatar";
import { Modal } from "../components/Modal";
import {
  Pencil,
  Trash2,
  Mail,
  Phone,
  MapPin,
  Lock,
  ShieldCheck,
  ShieldOff,
  AlertTriangle,
  QrCode,
  CheckCircle2,
} from "lucide-react";

export default function ProfilePage() {
  const {
    role,
    currentUserId,
    getLawyerById,
    getClientById,
    updateProfile,
    deleteProfile,
    twoFactorEnabled,
    enableTwoFactor,
    disableTwoFactor,
    addToast,
  } = useApp();
  const navigate = useNavigate();

  const user =
    role === "lawyer" ? getLawyerById(currentUserId) : getClientById(currentUserId);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [tfaSetupOpen, setTfaSetupOpen] = useState(false);
  const [tfaDisableOpen, setTfaDisableOpen] = useState(false);

  const [form, setForm] = useState({});
  const [pwForm, setPwForm] = useState({ old: "", new: "", confirm: "" });

  // 2FA enable flow
  const [tfaSecret, setTfaSecret] = useState("");
  const [tfaCode, setTfaCode] = useState("");
  const [tfaLoading, setTfaLoading] = useState(false);
  const [tfaError, setTfaError] = useState("");

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

  const handlePasswordSave = async () => {
    if (!pwForm.old.trim() || !pwForm.new.trim()) {
      addToast("Please fill in all fields", "error");
      return;
    }
    if (pwForm.new !== pwForm.confirm) {
      addToast("Passwords do not match", "error");
      return;
    }
    try {
      await api.changePassword(pwForm.old, pwForm.new);
      setPasswordOpen(false);
      setPwForm({ old: "", new: "", confirm: "" });
      addToast("Password changed successfully");
    } catch (err) {
      addToast(err.message || "Failed to change password", "error");
    }
  };

  const handleDelete = () => {
    setDeleteOpen(false);
    deleteProfile();
    setTimeout(() => navigate("/login"), 1500);
  };

  const handleEnable2FA = async () => {
    setTfaLoading(true);
    setTfaError("");
    try {
      const res = await api.enable2FA();
      setTfaSecret(res.secret);
      setTfaCode("");
    } catch (err) {
      setTfaError(err.message || "Failed to start 2FA setup");
    } finally {
      setTfaLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    if (tfaCode.length !== 6) {
      setTfaError("Enter the 6-digit code from your authenticator app");
      return;
    }
    setTfaLoading(true);
    setTfaError("");
    try {
      await enableTwoFactor(tfaCode);
      setTfaSetupOpen(false);
      setTfaSecret("");
      setTfaCode("");
    } catch (err) {
      setTfaError(err.message || "Invalid code. Please try again.");
    } finally {
      setTfaLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    try {
      await disableTwoFactor();
      setTfaDisableOpen(false);
    } catch (err) {
      addToast(err.message || "Failed to disable 2FA", "error");
    }
  };

  const openTfaSetup = async () => {
    setTfaSetupOpen(true);
    setTfaSecret("");
    setTfaCode("");
    setTfaError("");
    // Immediately kick off the enable request to get the secret
    setTfaLoading(true);
    try {
      const res = await api.enable2FA();
      setTfaSecret(res.secret);
    } catch (err) {
      setTfaError(err.message || "Failed to start 2FA setup");
    } finally {
      setTfaLoading(false);
    }
  };

  if (!user) return null;

  const roleColor = role === "lawyer" ? "from-primary-600 to-primary-800" : "from-emerald-600 to-emerald-800";

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in pb-12">

        {/* Profile Header */}
        <div className="relative">
          <div className={`h-28 rounded-2xl bg-gradient-to-r ${roleColor}`} />
          <div className="absolute top-4 right-4">
            <button
              onClick={openEdit}
              className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-xs font-bold border border-white/20 hover:bg-white/20 transition-all flex items-center gap-1.5"
            >
              <Pencil size={13} /> Edit Profile
            </button>
          </div>
          <div className="px-6 pb-4 -mt-10 flex items-end gap-4">
            <Avatar initials={user.avatar} size="xl" className="ring-4 ring-white shadow-md" />
            <div className="mb-1">
              <h1 className="text-xl font-bold text-surface-900">{user.name}</h1>
              <p className="text-sm text-surface-500">
                {role === "lawyer" ? user.specialization : "Client"}
              </p>
            </div>
          </div>
        </div>

        {/* Info Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Contact Info */}
          <div className="bg-white rounded-xl border border-surface-200 p-5 space-y-3">
            <h3 className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Contact</h3>
            <div className="flex items-center gap-3">
              <Mail size={15} className="text-surface-400 shrink-0" />
              <span className="text-sm text-surface-700 truncate">{user.email}</span>
            </div>
            {role === "client" && (
              <>
                <div className="flex items-center gap-3">
                  <Phone size={15} className="text-surface-400 shrink-0" />
                  <span className="text-sm text-surface-700">{user.phone || "Not set"}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={15} className="text-surface-400 shrink-0" />
                  <span className="text-sm text-surface-700">{user.address || "Not set"}</span>
                </div>
              </>
            )}
          </div>

          {/* Lawyer Stats or Client placeholder */}
          {role === "lawyer" ? (
            <div className="bg-white rounded-xl border border-surface-200 p-5">
              <h3 className="text-[10px] font-bold text-surface-400 uppercase tracking-widest mb-3">Stats</h3>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-lg bg-surface-50 border border-surface-100">
                  <p className="text-lg font-bold text-primary-600">{user.rating}</p>
                  <p className="text-[10px] font-bold text-surface-400 uppercase">Rating</p>
                </div>
                <div className="p-3 rounded-lg bg-surface-50 border border-surface-100">
                  <p className="text-lg font-bold text-primary-600">{user.casesWon}</p>
                  <p className="text-[10px] font-bold text-surface-400 uppercase">Won</p>
                </div>
                <div className="p-3 rounded-lg bg-surface-50 border border-surface-100">
                  <p className="text-lg font-bold text-primary-600">{user.experience}</p>
                  <p className="text-[10px] font-bold text-surface-400 uppercase">Yrs</p>
                </div>
              </div>
              {user.bio && (
                <p className="mt-4 text-xs text-surface-500 leading-relaxed italic border-t border-surface-100 pt-3">
                  "{user.bio}"
                </p>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-surface-200 p-5 flex items-center gap-3">
              <CheckCircle2 size={20} className="text-emerald-500 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-surface-800">Verified Client Account</p>
                <p className="text-xs text-surface-400">Your account is in good standing</p>
              </div>
            </div>
          )}
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-xl border border-surface-200 p-5 space-y-4">
          <h3 className="text-[10px] font-bold text-surface-400 uppercase tracking-widest">Security</h3>

          {/* 2FA Row */}
          <div className="flex items-center justify-between py-3 border-b border-surface-100">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${twoFactorEnabled ? "bg-emerald-50 text-emerald-600" : "bg-surface-100 text-surface-400"}`}>
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-surface-800">Two-Factor Authentication</p>
                <p className="text-xs text-surface-400">
                  {twoFactorEnabled ? "Enabled — your account is extra secure" : "Not enabled — add an extra layer of security"}
                </p>
              </div>
            </div>
            {twoFactorEnabled ? (
              <button
                onClick={() => setTfaDisableOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-bold border border-red-100 hover:bg-red-100 transition-all"
              >
                Disable
              </button>
            ) : (
              <button
                onClick={openTfaSetup}
                className="px-3 py-1.5 rounded-lg bg-primary-600 text-white text-xs font-bold hover:bg-primary-700 transition-all"
              >
                Enable
              </button>
            )}
          </div>

          {/* Change Password Row */}
          <div className="flex items-center justify-between py-3 border-b border-surface-100">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-surface-100 text-surface-500">
                <Lock size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-surface-800">Password</p>
                <p className="text-xs text-surface-400">Change your login password</p>
              </div>
            </div>
            <button
              onClick={() => setPasswordOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-surface-100 text-surface-700 text-xs font-bold hover:bg-surface-200 transition-all"
            >
              Change
            </button>
          </div>

          {/* Delete Account Row */}
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-50 text-red-500">
                <Trash2 size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-surface-800">Delete Account</p>
                <p className="text-xs text-surface-400">Permanently remove your account and all data</p>
              </div>
            </div>
            <button
              onClick={() => setDeleteOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-bold border border-red-100 hover:bg-red-100 transition-all"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Profile">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-surface-400 uppercase tracking-widest">Full Name</label>
            <input value={form.name || ""} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-surface-200 text-sm font-semibold focus:ring-2 focus:ring-primary-500 outline-none" />
          </div>
          {role === "lawyer" ? (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-surface-400 uppercase tracking-widest">Specialization</label>
                  <input value={form.specialization || ""} onChange={(e) => setForm((p) => ({ ...p, specialization: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-surface-200 text-sm font-semibold focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-surface-400 uppercase tracking-widest">Experience (yrs)</label>
                  <input type="number" value={form.experience || ""} onChange={(e) => setForm((p) => ({ ...p, experience: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-surface-200 text-sm font-semibold focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-surface-400 uppercase tracking-widest">Bio</label>
                <textarea value={form.bio || ""} onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))} rows={3} className="w-full px-4 py-3 rounded-xl border border-surface-200 text-sm font-semibold focus:ring-2 focus:ring-primary-500 outline-none resize-none" />
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-surface-400 uppercase tracking-widest">Phone</label>
                <input value={form.phone || ""} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-surface-200 text-sm font-semibold focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-surface-400 uppercase tracking-widest">Address</label>
                <input value={form.address || ""} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-surface-200 text-sm font-semibold focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button onClick={() => setEditOpen(false)} className="flex-1 py-3 rounded-xl border border-surface-200 font-bold text-surface-600 hover:bg-surface-50 transition-all">Cancel</button>
            <button onClick={handleSave} className="flex-1 py-3 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 active:scale-[0.98]">Save Changes</button>
          </div>
        </div>
      </Modal>

      {/* 2FA Setup Modal */}
      <Modal open={tfaSetupOpen} onClose={() => { setTfaSetupOpen(false); setTfaSecret(""); setTfaCode(""); setTfaError(""); }} title="Enable Two-Factor Authentication">
        <div className="space-y-5">
          {tfaLoading && !tfaSecret ? (
            <div className="text-center py-8 text-surface-400 text-sm">Generating secret…</div>
          ) : tfaSecret ? (
            <>
              <div className="p-4 rounded-xl bg-surface-50 border border-surface-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-surface-500 uppercase tracking-widest">
                  <QrCode size={14} /> Your Secret Key
                </div>
                <p className="font-mono text-sm text-surface-800 break-all bg-white px-3 py-2 rounded-lg border border-surface-200 select-all">
                  {tfaSecret}
                </p>
                <p className="text-xs text-surface-500 leading-relaxed">
                  Open your authenticator app (Google Authenticator, Authy, etc.), add a new account, and enter this key manually. Then enter the 6-digit code below.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-surface-400 uppercase tracking-widest mb-2">Verification Code</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={tfaCode}
                  onChange={(e) => { setTfaCode(e.target.value.replace(/\D/g, "")); setTfaError(""); }}
                  placeholder="000000"
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl border border-surface-200 text-center text-2xl font-mono tracking-[0.5em] focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>

              {tfaError && (
                <div className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
                  {tfaError}
                </div>
              )}

              <button
                onClick={handleVerify2FA}
                disabled={tfaLoading || tfaCode.length !== 6}
                className="w-full py-3 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 active:scale-[0.98] disabled:opacity-60"
              >
                {tfaLoading ? "Verifying…" : "Verify & Enable"}
              </button>
            </>
          ) : (
            <>
              {tfaError && (
                <div className="text-sm text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
                  {tfaError}
                </div>
              )}
              <button onClick={handleEnable2FA} className="w-full py-3 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-all">
                Try Again
              </button>
            </>
          )}
        </div>
      </Modal>

      {/* 2FA Disable Confirm Modal */}
      <Modal open={tfaDisableOpen} onClose={() => setTfaDisableOpen(false)} title="Disable Two-Factor Authentication">
        <div className="space-y-5">
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 flex gap-3">
            <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-amber-700">Disabling 2FA will make your account less secure. You can re-enable it at any time from your profile.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setTfaDisableOpen(false)} className="flex-1 py-3 rounded-xl border border-surface-200 font-bold text-surface-600 hover:bg-surface-50 transition-all">Cancel</button>
            <button onClick={handleDisable2FA} className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-all flex items-center justify-center gap-2">
              <ShieldOff size={16} /> Disable 2FA
            </button>
          </div>
        </div>
      </Modal>

      {/* Change Password Modal */}
      <Modal open={passwordOpen} onClose={() => setPasswordOpen(false)} title="Change Password">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-surface-400 uppercase tracking-widest">Current Password</label>
            <input type="password" value={pwForm.old} onChange={(e) => setPwForm((p) => ({ ...p, old: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-surface-200 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-surface-400 uppercase tracking-widest">New Password</label>
            <input type="password" value={pwForm.new} onChange={(e) => setPwForm((p) => ({ ...p, new: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-surface-200 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-surface-400 uppercase tracking-widest">Confirm New Password</label>
            <input type="password" value={pwForm.confirm} onChange={(e) => setPwForm((p) => ({ ...p, confirm: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-surface-200 text-sm font-semibold outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <button onClick={handlePasswordSave} className="w-full py-3 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-600/20 mt-2">Save Password</button>
        </div>
      </Modal>

      {/* Delete Account Modal */}
      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete Account">
        <div className="space-y-5">
          <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex gap-3">
            <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={18} />
            <p className="text-sm text-red-700 leading-snug">This is permanent. All your cases, documents, and account data will be removed.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setDeleteOpen(false)} className="flex-1 py-3 rounded-xl border border-surface-200 font-bold text-surface-600 hover:bg-surface-50 transition-all">Cancel</button>
            <button onClick={handleDelete} className="flex-1 py-3 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-600/20">Delete Forever</button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}
