import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Calendar, ShieldAlert, Sparkles, AlertCircle, CheckCircle2, RotateCcw, Clock } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function MyBookings() {
  const { user, token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Returning state tracking
  const [returningId, setReturningId] = useState(null);
  const [returnError, setReturnError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      setLoading(false);
      return;
    }

    fetchBookings();
  }, [isAuthenticated, user]);

  const fetchBookings = () => {
    setLoading(true);
    fetch(`/api/bookings/${user.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load your reservations.");
        }
        return res.json();
      })
      .then((data) => setBookings(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  const handleReturn = async (bookingId) => {
    setReturningId(bookingId);
    setReturnError(null);

    try {
      const res = await fetch(`/api/bookings/${bookingId}/return`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to mark booking as returned.");
      }

      // Update local state without full reload
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: "returned" } : b))
      );
    } catch (err) {
      setReturnError(err.message);
    } finally {
      setReturningId(null);
    }
  };

  // Helper to determine if today lies within the booking range
  const getActiveStatus = (startStr, endStr, status) => {
    if (status !== "confirmed") return { isActive: false };

    const today = new Date();
    const start = new Date(startStr);
    const end = new Date(endStr);

    // Normalize to compare full days
    today.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    if (today >= start && today <= end) {
      const diffTime = end - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return {
        isActive: true,
        daysRemaining: diffDays <= 0 ? 0 : diffDays,
      };
    }
    return { isActive: false };
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-black text-white mb-2">My Bookings</h2>
        <p className="text-neutral-400 text-sm mb-8">Review and track your active, returned, and upcoming rentals.</p>

        <div className="bg-neutral-900/50 border border-neutral-900 rounded-3xl p-8 flex flex-col items-center justify-center text-center py-16 backdrop-blur-md">
          <div className="w-16 h-16 rounded-full bg-neutral-850 flex items-center justify-center mb-6 text-neutral-400 border border-neutral-800">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Login Required</h3>
          <p className="text-neutral-500 text-sm max-w-sm mb-8">
            You must be logged in to view your booking dashboard and track active rentals.
          </p>
          <button
            onClick={() => navigate("/login?redirect=/bookings")}
            className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition-colors shadow-lg"
          >
            Log In / Sign Up
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black text-white flex items-center gap-2">
            My Bookings <span className="text-xs font-bold text-neutral-500 bg-neutral-900 border border-neutral-800 rounded-full px-2.5 py-0.5">{bookings.length} total</span>
          </h2>
          <p className="text-neutral-400 text-xs mt-1">Review and manage your active, returned, and historical reservations.</p>
        </div>
        <button
          onClick={fetchBookings}
          className="self-start sm:self-center px-4 py-2 border border-neutral-800 hover:bg-neutral-900 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Refresh List
        </button>
      </div>

      {returnError && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Error: {returnError}</span>
        </div>
      )}

      {loading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-neutral-900/40 border border-neutral-900 rounded-3xl p-6 animate-pulse h-40"></div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="text-center py-16 bg-neutral-900/20 border border-neutral-900 rounded-3xl">
          <p className="text-red-400 font-medium">❌ Failed to load reservations: {error}</p>
        </div>
      )}

      {!loading && !error && bookings.length === 0 && (
        <div className="bg-neutral-900/50 border border-neutral-900 rounded-3xl p-8 flex flex-col items-center justify-center text-center py-16 backdrop-blur-md">
          <div className="w-16 h-16 rounded-full bg-neutral-850 flex items-center justify-center mb-6 text-neutral-400 border border-neutral-800">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No Bookings Found</h3>
          <p className="text-neutral-500 text-sm max-w-sm mb-8">
            You haven't rented any products yet. Browse through our items and make your first booking!
          </p>
          <Link to="/" className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition-colors shadow-lg">
            Find Rental Gear
          </Link>
        </div>
      )}

      {!loading && !error && bookings.length > 0 && (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const prod = booking.productId || {};
            const start = new Date(booking.startDate);
            const end = new Date(booking.endDate);
            const activeInfo = getActiveStatus(booking.startDate, booking.endDate, booking.status);

            return (
              <div
                key={booking._id}
                className="bg-neutral-900/40 border border-neutral-900 hover:border-neutral-800 rounded-3xl p-6 transition-colors flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
              >
                {/* Product Info details */}
                <div className="flex gap-4 items-center">
                  <div className="w-20 h-16 rounded-xl overflow-hidden bg-neutral-950 border border-neutral-900 shrink-0">
                    <img
                      src={prod.imageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"}
                      alt={prod.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                        {prod.category}
                      </span>

                      {/* Status Badges */}
                      {booking.status === "returned" && (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 bg-neutral-800/80 px-2 py-0.5 rounded-full border border-neutral-700">
                          Returned
                        </span>
                      )}
                      {booking.status === "cancelled" && (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-red-400 bg-red-950/20 px-2 py-0.5 rounded-full border border-red-900/20">
                          Cancelled
                        </span>
                      )}
                      {booking.status === "confirmed" && !activeInfo.isActive && (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-violet-400 bg-violet-950/20 px-2 py-0.5 rounded-full border border-violet-900/20">
                          Confirmed
                        </span>
                      )}

                      {/* Lease Active countdown badge */}
                      {activeInfo.isActive && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/20 px-2 py-0.5 rounded-full border border-emerald-900/20">
                          <Clock className="w-3 h-3 animate-spin" /> {activeInfo.daysRemaining} {activeInfo.daysRemaining === 1 ? "day" : "days"} remaining
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-white mt-2 line-clamp-1">{prod.name || "Unknown Product"}</h3>
                    <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                      <span>
                        {start.toLocaleDateString(undefined, { month: "short", day: "numeric" })} -{" "}
                        {end.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Return Actions and charges details */}
                <div className="flex w-full lg:w-auto justify-between lg:justify-end items-center gap-8 border-t lg:border-t-0 pt-4 lg:pt-0 border-neutral-900/80">
                  <div className="flex gap-6 items-center">
                    <div className="text-left">
                      <span className="block text-[10px] text-neutral-500 tracking-wider uppercase font-semibold">Subtotal</span>
                      <span className="text-base font-black text-neutral-200">${booking.totalPrice}</span>
                    </div>
                    <div className="text-left">
                      <span className="block text-[10px] text-neutral-500 tracking-wider uppercase font-semibold">Deposit</span>
                      <span className="text-sm font-semibold text-neutral-400">${booking.depositAmount}</span>
                    </div>
                  </div>

                  {booking.status === "confirmed" && (
                    <button
                      onClick={() => handleReturn(booking._id)}
                      disabled={returningId === booking._id}
                      className="px-4 py-2.5 bg-neutral-850 hover:bg-emerald-600 hover:text-white border border-neutral-800 hover:border-emerald-600 text-neutral-300 text-xs font-bold rounded-xl transition-all disabled:opacity-50"
                    >
                      {returningId === booking._id ? "Returning..." : "Mark as Returned"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
