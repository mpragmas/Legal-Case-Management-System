import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { Scale, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [debugToken, setDebugToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Please provide your email address");
      return;
    }
    setLoading(true);
    try {
      const res = await api.forgotPassword(email);
      setSent(true);
      if (res.debugToken) setDebugToken(res.debugToken);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cardClass =
    "bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-900 via-primary-950 to-surface-900 px-4">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-primary-600/10 blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-primary-400/10 blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="relative w-full max-w-md animate-fade-in">
        <div className={cardClass}>
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/30 mb-4">
              {sent ? (
                <CheckCircle2 size={28} className="text-white" />
              ) : (
                <Mail size={28} className="text-white" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-white">
              {sent ? "Check Your Email" : "Forgot Password"}
            </h1>
            <p className="text-sm text-white/50 mt-1 text-center">
              {sent
                ? "A reset link has been sent if this email is registered"
                : "Enter your email and we'll send a reset link"}
            </p>
          </div>

          {sent ? (
            <div className="space-y-4">
              {debugToken && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                  <p className="font-bold mb-1">Dev mode — reset token:</p>
                  <p className="font-mono break-all">{debugToken}</p>
                  <Link
                    to={`/reset-password?token=${debugToken}`}
                    className="mt-2 inline-block text-primary-400 hover:text-primary-300 underline underline-offset-2"
                  >
                    Click here to reset password
                  </Link>
                </div>
              )}
              <Link
                to="/login"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold text-sm hover:from-primary-700 hover:to-primary-600 transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} /> Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  autoFocus
                />
              </div>

              {error && (
                <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold text-sm hover:from-primary-700 hover:to-primary-600 transition-all active:scale-[0.98] shadow-lg shadow-primary-500/25 disabled:opacity-60"
              >
                {loading ? "Sending…" : "Send Reset Link"}
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
