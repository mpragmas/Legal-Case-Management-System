import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Scale, Eye, EyeOff, Info, ShieldCheck, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginWith2FA, isAuthenticated } = useApp();

  const [step, setStep] = useState("credentials"); // "credentials" | "2fa"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [tfaCode, setTfaCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isAuthenticated) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  const handleCredentials = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password");
      return;
    }
    setLoading(true);
    try {
      const res = await login(email, password);
      if (res?.twoFactorRequired) {
        setStep("2fa");
        setTfaCode("");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleTfa = async (e) => {
    e.preventDefault();
    setError("");
    if (tfaCode.length !== 6) {
      setError("Enter the 6-digit code from your authenticator app");
      return;
    }
    setLoading(true);
    try {
      await loginWith2FA(email, tfaCode);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Invalid code. Try again.");
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
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/30 mb-4">
              {step === "2fa" ? <ShieldCheck size={28} className="text-white" /> : <Scale size={28} className="text-white" />}
            </div>
            <h1 className="text-2xl font-bold text-white">
              {step === "2fa" ? "Two-Factor Auth" : "Welcome Back"}
            </h1>
            <p className="text-sm text-white/50 mt-1">
              {step === "2fa" ? "Enter the code from your authenticator app" : "Sign in to LegalDesk"}
            </p>
          </div>

          {/* Step: Credentials */}
          {step === "credentials" && (
            <>
              <div className="mb-6 p-3 rounded-xl bg-white/[0.05] border border-white/10">
                <div className="flex items-start gap-2">
                  <Info size={16} className="text-primary-400 shrink-0 mt-0.5" />
                  <div className="text-xs text-white/50">
                    <p className="font-semibold text-white/70 mb-1">Demo Accounts</p>
                    <div className="space-y-1">
                      <p>
                        <button type="button" onClick={() => { setEmail("lawyer@example.com"); setPassword("password"); }} className="text-primary-400 hover:text-primary-300 font-medium underline underline-offset-2">
                          lawyer@example.com
                        </button>{" "}→ Lawyer view
                      </p>
                      <p>
                        <button type="button" onClick={() => { setEmail("client@example.com"); setPassword("password"); }} className="text-primary-400 hover:text-primary-300 font-medium underline underline-offset-2">
                          client@example.com
                        </button>{" "}→ Client view
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleCredentials} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">Email</label>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Password</label>
                    <Link to="/forgot-password" className="text-xs text-primary-400 hover:text-primary-300 transition-colors">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      id="login-password"
                      type={showPw ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all pr-12"
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
                      {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {error && <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">{error}</div>}

                <button id="login-submit" type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold text-sm hover:from-primary-700 hover:to-primary-600 transition-all active:scale-[0.98] shadow-lg shadow-primary-500/25 disabled:opacity-60">
                  {loading ? "Signing in…" : "Sign In"}
                </button>
              </form>

              <p className="text-center text-sm text-white/40 mt-6">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">Register</Link>
              </p>
            </>
          )}

          {/* Step: 2FA */}
          {step === "2fa" && (
            <form onSubmit={handleTfa} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">6-Digit Code</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={tfaCode}
                  onChange={(e) => { setTfaCode(e.target.value.replace(/\D/g, "")); setError(""); }}
                  placeholder="000000"
                  autoFocus
                  className="w-full px-4 py-4 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-white/30 text-center text-2xl font-mono tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
              </div>

              {error && <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">{error}</div>}

              <button type="submit" disabled={loading || tfaCode.length !== 6} className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold text-sm hover:from-primary-700 hover:to-primary-600 transition-all active:scale-[0.98] shadow-lg shadow-primary-500/25 disabled:opacity-60">
                {loading ? "Verifying…" : "Verify & Sign In"}
              </button>

              <button type="button" onClick={() => { setStep("credentials"); setError(""); }} className="w-full flex items-center justify-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors">
                <ArrowLeft size={14} /> Back to login
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
