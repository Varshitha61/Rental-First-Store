import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ArrowLeft, ShieldCheck, Zap, Calendar, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function ProductDetail() {
  const { id } = useParams();
  const { token, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Date range picker states
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);

  // Booking states
  const [bookingError, setBookingError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load product details");
        }
        return res.json();
      })
      .then((data) => setProduct(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    setBookingError(null);
  };

  // Pricing helper
  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const diffTime = endDate - startDate;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 0 ? 1 : diffDays;
  };

  const getPriceEstimate = () => {
    if (!product) return { rentalCost: 0, deposit: 0, total: 0, days: 0 };
    const days = calculateDays();
    const rentalCost = product.dailyRate * days;
    const deposit = product.depositAmount;
    return {
      rentalCost: Number(rentalCost.toFixed(2)),
      deposit: Number(deposit.toFixed(2)),
      total: Number((rentalCost + deposit).toFixed(2)),
      days,
    };
  };

  const handleReserve = async () => {
    if (!isAuthenticated) {
      // Redirect to login with return path
      const returnPath = window.location.pathname;
      navigate(`/login?redirect=${encodeURIComponent(returnPath)}`);
      return;
    }

    if (!endDate) {
      setBookingError("Please select both a start and an end date for your rental.");
      return;
    }

    setSubmitting(true);
    setBookingError(null);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: id,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Reservation failed");
      }

      setBookingSuccess(true);
      showToast("Gear reserved successfully!", "success");
      setTimeout(() => navigate("/bookings"), 2000);
    } catch (err) {
      setBookingError(err.message || "Something went wrong while placing booking.");
      showToast(err.message || "Reservation failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const estimate = getPriceEstimate();

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8 text-center animate-pulse">
        <div className="h-8 bg-neutral-800 rounded w-1/3 mb-12"></div>
        <div className="bg-neutral-900/40 border border-neutral-900 rounded-3xl p-8 h-96"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8 text-center">
        <p className="text-red-400 font-medium">❌ Product could not be loaded: {error}</p>
        <Link to="/" className="inline-block mt-4 text-violet-400 hover:underline">
          Return to home page
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-4">
      <Link to="/" className="inline-flex items-center text-sm text-neutral-400 hover:text-white mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products
      </Link>

      <div className="bg-neutral-900/40 border border-neutral-900 rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-2xl">
        <div className="grid md:grid-cols-12 gap-8">
          {/* Product Media & Details */}
          <div className="md:col-span-7 space-y-6">
            <div className="aspect-video rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-800">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <span className="px-3 py-1 bg-violet-500/10 text-violet-400 text-xs font-semibold rounded-full uppercase tracking-wider border border-violet-500/20">
                {product.category}
              </span>
              <h2 className="text-3xl font-black text-white mt-4">{product.name}</h2>
              <p className="text-neutral-400 text-sm mt-3 leading-relaxed">{product.description}</p>
            </div>

            <div className="p-4 bg-neutral-950/50 border border-neutral-900 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-neutral-300 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Security Guarantee</span>
              </div>
              <p className="text-neutral-500 text-[11px] leading-relaxed">
                Refundable deposits are secured immediately. After returning the rental in original conditions, deposits are released to your balance within 24-48 business hours.
              </p>
            </div>
          </div>

          {/* Date Picker & Price Estimates */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-neutral-950/80 border border-neutral-900 p-6 rounded-2xl">
              <h3 className="text-sm font-semibold uppercase tracking-widest text-neutral-400 mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-violet-400" /> Select Rental Dates
              </h3>

              <div className="custom-datepicker-wrapper flex justify-center mb-6">
                <DatePicker
                  selected={startDate}
                  onChange={handleDateChange}
                  startDate={startDate}
                  endDate={endDate}
                  selectsRange
                  minDate={new Date()}
                  inline
                />
              </div>

              {/* Booking feedback */}
              {bookingError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold rounded-xl flex items-center gap-2 mb-4">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{bookingError}</span>
                </div>
              )}

              {bookingSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-xl flex items-center gap-2 mb-4">
                  <ShieldCheck className="w-4 h-4 shrink-0" />
                  <span>Booking Confirmed! Redirecting to bookings list...</span>
                </div>
              )}

              {/* Price Calculation details */}
              <div className="space-y-3 pt-4 border-t border-neutral-900">
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>Daily Rate</span>
                  <span className="font-semibold text-neutral-200">${product.dailyRate}/day</span>
                </div>
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>Rental Duration</span>
                  <span className="font-semibold text-neutral-200">
                    {estimate.days} {estimate.days === 1 ? "day" : "days"}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>Rental Subtotal</span>
                  <span className="font-semibold text-neutral-200">${estimate.rentalCost}</span>
                </div>
                <div className="flex justify-between text-xs text-neutral-400">
                  <span>Security Deposit (Refundable)</span>
                  <span className="font-semibold text-neutral-200">${estimate.deposit}</span>
                </div>

                <div className="flex justify-between items-end pt-3 border-t border-neutral-900">
                  <span className="text-sm font-bold text-white">Estimated Total</span>
                  <div className="text-right">
                    <span className="text-lg font-black text-emerald-400">${estimate.total}</span>
                    <span className="block text-[8px] text-neutral-500 mt-0.5 tracking-wider uppercase font-semibold">
                      estimate — final price confirmed at checkout
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleReserve}
                disabled={submitting || bookingSuccess}
                className="mt-6 w-full py-3.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-violet-500/10 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Zap className="w-4 h-4" /> {submitting ? "Booking..." : bookingSuccess ? "Reserved!" : "Reserve Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
