import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import MyBookings from "./pages/MyBookings";
import Cart from "./pages/Cart";
import Login from "./pages/Login";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-grow py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/bookings" element={<MyBookings />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<div className="text-center py-16">Page Not Found</div>} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="border-t border-neutral-900 py-6 text-center text-xs text-neutral-600 bg-neutral-950">
          &copy; {new Date().getFullYear()} Borrow Inc. Rent anything. Own nothing.
        </footer>
      </div>
    </Router>
  );
}
