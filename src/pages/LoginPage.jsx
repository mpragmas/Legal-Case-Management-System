import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Scale, Eye, EyeOff, Info } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");

  // If already logged in, redirect
  if (isAuthenticated) {
    navigate("/dashboard", { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }
    const success = await login(email, password);
    if (success) {
      navigate("/dashboard");
    } else {
      setError("Invalid email. Try one of the demo accounts below.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-surface-900 via-primary-950 to-surface-900 px-4">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-primary-600/10 blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-primary-400/10 blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Card */}
        <div className="bg-white/[0.06] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/30 mb-4">
              <Scale size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
            <p className="text-sm text-white/50 mt-1">Sign in to LegalDesk</p>
          </div>

          {/* Demo accounts hint */}
          <div className="mb-6 p-3 rounded-xl bg-white/[0.05] border border-white/10">
            <div className="flex items-start gap-2">
              <Info size={16} className="text-primary-400 shrink-0 mt-0.5" />
              <div className="text-xs text-white/50">
                <p className="font-semibold text-white/70 mb-1">
                  Demo Accounts
                </p>
                <div className="space-y-1">
                  <p>
                    <button
                      type="button"
                      onClick={() => {
                        setEmail("lawyer@example.com");
                        setPassword("password");
                      }}
                      className="text-primary-400 hover:text-primary-300 font-medium cursor-pointer underline underline-offset-2"
                    >
                      lawyer@example.com
                    </button>{" "}
                    → Lawyer view
                  </p>
                  <p>
                    <button
                      type="button"
                      onClick={() => {
                        setEmail("client@example.com");
                        setPassword("password");
                      }}
                      className="text-primary-400 hover:text-primary-300 font-medium cursor-pointer underline underline-offset-2"
                    >
                      client@example.com
                    </button>{" "}
                    → Client view
                  </p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors cursor-pointer"
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5 animate-fade-in">
                {error}
              </div>
            )}

            <button
              id="login-submit"
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white font-semibold text-sm hover:from-primary-700 hover:to-primary-600 transition-all active:scale-[0.98] shadow-lg shadow-primary-500/25 cursor-pointer"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-sm text-white/40 mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
