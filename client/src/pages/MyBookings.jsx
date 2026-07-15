import { Calendar, Shield, Clock } from "lucide-react";

export default function MyBookings() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold tracking-tight text-white mb-2">My Bookings</h2>
      <p className="text-neutral-400 text-sm mb-8">Review and track your active, returned, and upcoming rentals.</p>

      {/* Mock bookings listing */}
      <div className="space-y-4">
        <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Active Rental</span>
            </div>
            <h3 className="text-lg font-bold text-white mt-1">Specialized Rockhopper Mountain Bike</h3>
            <p className="text-xs text-neutral-500 mt-0.5">Rental Period: Jul 20, 2026 - Jul 25, 2026</p>
          </div>

          <div className="flex gap-8 items-center">
            <div className="text-right">
              <span className="block text-xs text-neutral-500">Amount Charged</span>
              <span className="text-base font-bold text-neutral-200">$125.00</span>
            </div>
            <button className="px-4 py-2 bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold rounded-lg transition-colors">
              Return Rental
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
