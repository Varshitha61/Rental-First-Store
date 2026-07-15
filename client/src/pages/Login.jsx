import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock, Mail, User, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Mode toggling: "login" or "register"
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Error/loading states
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Where to redirect after success
  const redirectUrl = searchParams.get("redirect") || "/";

  // Redirect immediately if already logged in
  if (isAuthenticated) {
    setTimeout(() => navigate(redirectUrl), 0);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (isLoginMode) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate(redirectUrl);
    } catch (err) {
      setError(err.message || "An authentication error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-8 backdrop-blur-md shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            {isLoginMode ? "Welcome to Borrow" : "Create an Account"}
          </h2>
          <p className="text-neutral-400 text-sm mt-2">
            {isLoginMode ? "Log in to rent premium gear." : "Sign up to begin borrowing items today."}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginMode && (
            <div>
              <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 focus:border-violet-500 text-white rounded-xl pl-12 pr-4 py-3 outline-none text-sm transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-violet-500 text-white rounded-xl pl-12 pr-4 py-3 outline-none text-sm transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-violet-500 text-white rounded-xl pl-12 pr-4 py-3 outline-none text-sm transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-4 py-3.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-violet-500/10 disabled:opacity-50"
          >
            {submitting ? "Processing..." : isLoginMode ? "Log In" : "Sign Up"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-neutral-800/80 text-center text-xs text-neutral-400">
          {isLoginMode ? (
            <span>
              Don't have an account?{" "}
              <button onClick={() => setIsLoginMode(false)} className="text-violet-400 hover:underline font-semibold ml-0.5">
                Sign Up
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{" "}
              <button onClick={() => setIsLoginMode(true)} className="text-violet-400 hover:underline font-semibold ml-0.5">
                Log In
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
