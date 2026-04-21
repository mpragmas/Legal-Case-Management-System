import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { api } from "../services/api";
import { KeyRound, Eye, EyeOff, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!password.trim() || !confirm.trim()) {
      setError("Please fill in both fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (!token) {
      setError("Invalid or missing reset token");
      return;
    }
    setLoading(true);
    try {
      await api.resetPassword(token, password);
      setDone(true);
      setTimeout(() => navigate("/login"), 2500);
    } catch (err) {
      setError(err.message || "Reset failed. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  const cardClass = "bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-900 via-primary-950 to-surface-900 px-4">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-primary-600/10 blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-primary-400/10 blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="relative w-full max-w-md animate-fade-in">
        <div className={cardClass}>
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/30 mb-4">
              {done ? <CheckCircle2 size={28} className="text-white" /> : <KeyRound size={28} className="text-white" />}
            </div>
            <h1 className="text-2xl font-bold text-white">
              {done ? "Password Reset!" : "Reset Password"}
            </h1>
            <p className="text-sm text-white/50 mt-1 text-center">
              {done ? "Redirecting you to login…" : "Choose a new password for your account"}
            </p>
          </div>

          {done ? (
            <Link
              to="/login"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold text-sm hover:from-primary-700 hover:to-primary-600 transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft size={16} /> Go to Login
            </Link>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {!token && (
                <div className="text-sm text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-xl px-4 py-2.5">
                  No reset token found. Please use the link from your email.
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all pr-12"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                  >
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => { setConfirm(e.target.value); setError(""); }}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
              </div>

              {error && (
                <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !token}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold text-sm hover:from-primary-700 hover:to-primary-600 transition-all active:scale-[0.98] shadow-lg shadow-primary-500/25 disabled:opacity-60"
              >
                {loading ? "Saving…" : "Set New Password"}
              </button>

              <Link
                to="/login"
                className="w-full flex items-center justify-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors"
              >
                <ArrowLeft size={14} /> Back to Login
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
