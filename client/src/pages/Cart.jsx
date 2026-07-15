import { ShoppingCart, ShieldAlert } from "lucide-react";

export default function Cart() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Cart & Bookings</h2>
      <p className="text-neutral-400 text-sm mb-8">Confirm products and configure duration before placing reservations.</p>

      <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-8 flex flex-col items-center justify-center text-center py-16 backdrop-blur-md">
        <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mb-6 text-neutral-400">
          <ShoppingCart className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Your Rent Cart is Empty</h3>
        <p className="text-neutral-500 text-sm max-w-sm mb-8">
          Browse through our selection of high-end tools, gear, and items to find the perfect rental for your needs.
        </p>
        <a href="/" className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition-colors shadow-lg">
          Start Borrowing
        </a>
      </div>
    </div>
  );
}
