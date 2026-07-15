import { useState, useEffect } from "react";

export default function App() {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then((data) => setHealth(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-8">
      {/* Wordmark */}
      <h1 className="text-6xl font-black tracking-tight bg-gradient-to-br from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
        Borrow
      </h1>
      <p className="text-neutral-400 text-lg -mt-4">
        Rent anything. Own nothing.
      </p>

      {/* Health card */}
      <div className="w-full max-w-sm rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur p-6 shadow-xl">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-4">
          Server Status
        </h2>

        {loading && (
          <p className="text-neutral-400 animate-pulse">Checking…</p>
        )}

        {error && (
          <p className="text-red-400 font-medium">
            ❌ Could not reach server: {error}
          </p>
        )}

        {health && (
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span className="text-neutral-400">API status</span>
              <span className="font-semibold text-emerald-400">
                ✅ {health.status}
              </span>
            </li>
            <li className="flex justify-between">
              <span className="text-neutral-400">Database</span>
              <span
                className={
                  health.db === "connected"
                    ? "font-semibold text-emerald-400"
                    : "font-semibold text-amber-400"
                }
              >
                {health.db === "connected" ? "✅" : "⚠️"} {health.db}
              </span>
            </li>
            <li className="flex justify-between">
              <span className="text-neutral-400">Timestamp</span>
              <span className="text-neutral-300">
                {new Date(health.timestamp).toLocaleTimeString()}
              </span>
            </li>
          </ul>
        )}
      </div>
    </main>
  );
}
