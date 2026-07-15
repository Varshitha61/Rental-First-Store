import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, SlidersHorizontal, Tag, DollarSign, Calendar, Sparkles } from "lucide-react";
import { useToast } from "../context/ToastContext";

export default function Home() {
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetch("/api/products")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load products");
        }
        return res.json();
      })
      .then((data) => setProducts(data))
      .catch((err) => {
        setError(err.message);
        showToast(err.message || "Failed to load products", "error");
      })
      .finally(() => setLoading(false));
  }, [showToast]);

  // Filter logic
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Extract unique categories for dropdown filter
  const categories = ["All", ...new Set(products.map((p) => p.category))];

  return (
    <div className="max-w-6xl mx-auto px-6 py-4">
      {/* Hero section */}
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-violet-500/10 text-violet-400 text-xs font-semibold rounded-full uppercase tracking-wider mb-4 border border-violet-500/20">
          <Sparkles className="w-3.5 h-3.5" /> High-End Rental Platform
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
          Rent Premium Gear, <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Pay Less</span>
        </h1>
        <p className="text-neutral-400 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
          Why buy when you can borrow? Access professional cameras, outdoor gear, specialized tools, and more for a fraction of the cost.
        </p>
      </header>

      {/* Search & Filters Controls */}
      <section className="flex flex-col sm:flex-row gap-4 mb-8 bg-neutral-900/40 p-4 border border-neutral-900 rounded-2xl">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search products by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 focus:border-violet-500 text-white rounded-xl pl-12 pr-4 py-3 outline-none text-sm transition-colors"
          />
        </div>

        <div className="relative min-w-[200px] flex items-center">
          <SlidersHorizontal className="absolute left-4 w-4 h-4 text-neutral-500 pointer-events-none" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 focus:border-violet-500 text-neutral-300 rounded-xl pl-12 pr-8 py-3 outline-none text-sm appearance-none cursor-pointer transition-colors"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {/* Custom selector dropdown caret icon */}
          <div className="absolute right-4 pointer-events-none w-2.5 h-2.5 border-r border-b border-neutral-500 rotate-45"></div>
        </div>
      </section>

      {/* Grid Display Area */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 py-12">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-neutral-900/40 border border-neutral-900 rounded-3xl p-4 animate-pulse h-80 flex flex-col justify-between">
              <div className="w-full aspect-video bg-neutral-800 rounded-2xl"></div>
              <div className="space-y-3 mt-4">
                <div className="h-4 bg-neutral-800 rounded w-2/3"></div>
                <div className="h-3 bg-neutral-800 rounded w-1/2"></div>
                <div className="h-6 bg-neutral-800 rounded w-full mt-4"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-16 bg-neutral-900/20 border border-neutral-900 rounded-3xl">
          <p className="text-red-400 font-medium">❌ Failed to fetch products: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-sm"
          >
            Retry Connection
          </button>
        </div>
      )}

      {!loading && !error && filteredProducts.length === 0 && (
        <div className="text-center py-16 bg-neutral-900/20 border border-neutral-900 rounded-3xl">
          <p className="text-neutral-500 text-sm">No products found matching your criteria.</p>
        </div>
      )}

      {!loading && !error && filteredProducts.length > 0 && (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="group bg-neutral-900/45 hover:bg-neutral-900/70 border border-neutral-900 hover:border-neutral-800 rounded-3xl p-4 transition-all duration-300 hover:-translate-y-1 shadow-md hover:shadow-xl flex flex-col justify-between"
            >
              <div>
                {/* Product image container */}
                <div className="relative aspect-video rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-900">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur border border-neutral-800 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                    <Tag className="w-3 h-3 text-violet-400" />
                    <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-wider">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <h3 className="text-lg font-bold text-white mt-4 line-clamp-1 group-hover:text-violet-400 transition-colors">
                  {product.name}
                </h3>
                <p className="text-neutral-500 text-xs mt-1.5 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Price details & rent action */}
              <div className="mt-6 pt-4 border-t border-neutral-900/80 flex items-center justify-between">
                <div>
                  <div className="flex items-center text-emerald-400">
                    <DollarSign className="w-4 h-4 -mr-0.5" />
                    <span className="text-xl font-black">{product.dailyRate}</span>
                    <span className="text-[10px] text-neutral-500 font-semibold lowercase ml-0.5">/day</span>
                  </div>
                  <div className="text-[10px] text-neutral-500 mt-0.5">
                    Deposit: <span className="font-semibold text-neutral-400">${product.depositAmount}</span>
                  </div>
                </div>

                <Link
                  to={`/product/${product._id}`}
                  className="px-4 py-2.5 bg-neutral-850 hover:bg-violet-600 hover:text-white border border-neutral-800 hover:border-violet-600 text-neutral-300 text-xs font-bold rounded-xl transition-all shadow"
                >
                  Rent Now
                </Link>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
