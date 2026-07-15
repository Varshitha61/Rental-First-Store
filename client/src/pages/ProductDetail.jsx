import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Zap, Calendar } from "lucide-react";

export default function ProductDetail() {
  const { id } = useParams();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center text-sm text-neutral-400 hover:text-white mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products
      </Link>

      <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-8 backdrop-blur-md shadow-2xl">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Mock image placeholder */}
          <div className="aspect-square bg-neutral-800 rounded-2xl overflow-hidden flex items-center justify-center text-neutral-500">
            [Product Image Detail for ID: {id}]
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <span className="px-3 py-1 bg-violet-500/10 text-violet-400 text-xs font-semibold rounded-full uppercase tracking-wider">
                Outdoors
              </span>
              <h2 className="text-3xl font-bold mt-4 text-white">Premium Gear Rental</h2>
              <p className="text-neutral-400 mt-2 text-sm leading-relaxed">
                Rent this high-quality product for your next adventure or project. Full specifications and bookings are managed server-side with verified rates and deposits.
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-800 space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-neutral-400 text-sm">Daily Rental Rate</span>
                <span className="text-2xl font-black text-emerald-400">$19.99<span className="text-xs text-neutral-500">/day</span></span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-neutral-400 text-sm">Refundable Deposit</span>
                <span className="text-lg font-bold text-neutral-200">$50.00</span>
              </div>
            </div>

            <button className="mt-8 w-full py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-violet-500/10 flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" /> Book Now (Coming Soon)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
