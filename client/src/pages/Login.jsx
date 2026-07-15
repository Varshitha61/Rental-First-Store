import { Lock, Mail } from "lucide-react";

export default function Login() {
  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-8 backdrop-blur-md shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-white">Welcome to Borrow</h2>
          <p className="text-neutral-400 text-sm mt-2">Log in or create a new account to rent gear.</p>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-400 uppercase tracking-widest mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="email"
                placeholder="you@example.com"
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
                placeholder="••••••••"
                className="w-full bg-neutral-950 border border-neutral-800 focus:border-violet-500 text-white rounded-xl pl-12 pr-4 py-3 outline-none text-sm transition-colors"
              />
            </div>
          </div>

          <button className="w-full mt-4 py-3.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-violet-500/10">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}
