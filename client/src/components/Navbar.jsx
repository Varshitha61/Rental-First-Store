import { Link, NavLink } from "react-router-dom";
import { Layers, Calendar, ShoppingCart, User, HelpCircle } from "lucide-react";

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 text-sm font-semibold transition-all px-3 py-1.5 rounded-lg ${
      isActive
        ? "text-white bg-neutral-900 border border-neutral-800"
        : "text-neutral-400 hover:text-neutral-200"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-900 py-4 px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Wordmark logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-black bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent group-hover:opacity-85 transition-opacity">
            Borrow
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 bg-neutral-900 border border-neutral-800 rounded px-1.5 py-0.5">
            Beta
          </span>
        </Link>

        {/* Navigation list */}
        <div className="flex items-center gap-4">
          <NavLink to="/" className={linkClass}>
            <Layers className="w-4 h-4" /> Home
          </NavLink>
          <NavLink to="/bookings" className={linkClass}>
            <Calendar className="w-4 h-4" /> My Bookings
          </NavLink>
          <NavLink to="/cart" className={linkClass}>
            <ShoppingCart className="w-4 h-4" /> Cart
          </NavLink>
          <NavLink to="/login" className={linkClass}>
            <User className="w-4 h-4" /> Login
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
