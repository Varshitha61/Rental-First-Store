import { Link, NavLink, useNavigate } from "react-router-dom";
import { Layers, Calendar, ShoppingCart, User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 text-sm font-semibold transition-all px-3 py-1.5 rounded-lg ${
      isActive
        ? "text-white bg-neutral-900 border border-neutral-800"
        : "text-neutral-400 hover:text-neutral-200"
    }`;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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

          <NavLink to="/cart" className={linkClass}>
            <ShoppingCart className="w-4 h-4" /> Cart
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink to="/bookings" className={linkClass}>
                <Calendar className="w-4 h-4" /> My Bookings
              </NavLink>
              
              <div className="h-4 w-[1px] bg-neutral-800 mx-1"></div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-neutral-400 font-semibold hidden md:inline">
                  Hi, {user?.name.split(" ")[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm font-semibold text-red-400 hover:text-red-300 transition-all px-3 py-1.5 rounded-lg hover:bg-red-500/10 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </>
          ) : (
            <NavLink to="/login" className={linkClass}>
              <User className="w-4 h-4" /> Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}
