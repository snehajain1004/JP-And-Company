import React, { useState, useEffect } from "react";
import {
  Phone,
  MessageCircle,
  ShieldCheck,
  Truck,
  Layers,
  MapPin,
  Menu,
  X,
  CheckCircle2,
  ChevronRight,
  Clock,
  Award
} from "lucide-react";

import gardenNetImg from "./images/garden-net.jpg";
import acPardaImg from "./images/ac-parda.jpg";
import maccharDaniImg from "./images/macchar-dani.jpg";
import plasticTirpalImg from "./images/plastic-tirpal.jpg";
import truckTirpalImg from "./images/truck-tirpal.jpg";
import armyTentImg from "./images/army-tent.jpg";

// Map IDs to bundled image imports
const imageMap = {
  "garden-net": gardenNetImg,
  "ac-parda": acPardaImg,
  "macchar-dani": maccharDaniImg,
  "plastic-tirpal": plasticTirpalImg,
  "truck-tirpal": truckTirpalImg,
  "army-tent": armyTentImg,
};

const DEFAULT_PRODUCTS = [
  {
    id: "garden-net",
    title_en: "Garden Shade Net",
    title_hi: "गार्डन नेट",
    category: "Gardening & Agro",
    image: gardenNetImg,
    description: "High-density UV stabilized agro shade net for gardens, nursery protection, terrace shade, and outdoor sitting areas.",
    features: ["UV Protected (50%-90% shading)", "Tear Resistant & Durable", "Weatherproof & Breathable"],
    price_per_unit: "₹12 / sq.ft",
    popular_sizes: ["10x10 ft", "10x20 ft", "15x30 ft", "Custom Roll"]
  },
  {
    id: "ac-parda",
    title_en: "AC PVC Strip Curtain",
    title_hi: "ए.सी. पर्दा",
    category: "Commercial & Home",
    image: acPardaImg,
    description: "Transparent PVC insulating strip curtains designed to prevent AC cooling loss, block dust, smoke, and maintain indoor temperature.",
    features: ["Crystal clear visibility", "Reduces electricity bills", "Effective dust & insect barrier"],
    price_per_unit: "₹180 / strip",
    popular_sizes: ["7x3 ft Door", "8x4 ft Door", "Custom Industrial Size"]
  },
  {
    id: "macchar-dani",
    title_en: "Mosquito Bed Net",
    title_hi: "मच्छरदानी",
    category: "Household",
    image: maccharDaniImg,
    description: "Breathable fine-mesh mosquito netting suitable for single, double, and king-size beds. Available in hanging and foldable styles.",
    features: ["Dense anti-mosquito micro-mesh", "Easy ceiling suspension hooks", "Washable & durable fabric"],
    price_per_unit: "₹450 / pc",
    popular_sizes: ["Single Bed (3x6 ft)", "Double Bed (6x6 ft)", "King Size (6.5x7 ft)"]
  },
  {
    id: "plastic-tirpal",
    title_en: "Multipurpose Plastic Tarpaulin",
    title_hi: "प्लास्टिक तिरपाल",
    category: "Waterproof Tarpaulins",
    image: plasticTirpalImg,
    description: "Heavy-duty waterproof polyethylene tarpaulin in yellow, blue, and black for covering grains, bricks, bike/car covers, and ground sheds.",
    features: ["100% Waterproof & Leak-proof", "Rust-proof eyelets on all edges", "Multi-layer laminate"],
    price_per_unit: "₹18 / sq.ft",
    popular_sizes: ["9x12 ft", "12x18 ft", "18x24 ft", "24x30 ft"]
  },
  {
    id: "truck-tirpal",
    title_en: "Heavy-Duty Truck Tarpaulin",
    title_hi: "ट्रक तिरपाल",
    category: "Commercial Transport",
    image: truckTirpalImg,
    description: "Industrial grade rubberized/PVC truck cover tarpaulin for long-distance transport, logistics, and rainy season cargo protection.",
    features: ["High tensile strength 550+ GSM", "Double heat-sealed joints", "Heavy rope reinforced hem"],
    price_per_unit: "₹35 / sq.ft",
    popular_sizes: ["18x24 ft", "20x28 ft", "24x36 ft", "Custom Truck Body"]
  },
  {
    id: "army-tent",
    title_en: "Army & Relief Canvas Tent",
    title_hi: "आर्मी टेंट",
    category: "Tents & Shelters",
    image: armyTentImg,
    description: "All-weather heavy duty military style canvas tent with windows, ventilation, and metal frame poles. Ideal for camps, disaster relief, and sites.",
    features: ["Heavy cotton/poly canvas", "Wind & rain resistant", "Complete with poles, pegs, and ropes"],
    price_per_unit: "₹14,500 / tent",
    popular_sizes: ["10x12 ft (4-6 persons)", "14x14 ft (8-10 persons)", "18x24 ft (Command/Dorm)"]
  }
];

export default function App() {
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [activeTab, setActiveTab] = useState("catalog");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeProduct, setActiveProduct] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quoteForm, setQuoteForm] = useState({ name: "", phone: "", size: "", notes: "" });
  const [submitStatus, setSubmitStatus] = useState(null);

  const PHONE_1 = "9412516083";
  const PHONE_2 = "8445576040";

  useEffect(() => {
    // If backend is active locally, fetch from it; otherwise keep DEFAULT_PRODUCTS
    fetch("http://localhost:8000/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const merged = data.map((item) => ({
            ...item,
            image: imageMap[item.id] || item.image,
          }));
          setProducts(merged);
        }
      })
      .catch(() => {
        // Backend offline (e.g. GitHub Pages) - DEFAULT_PRODUCTS remains active
      });
  }, []);

  const categories = ["All", ...new Set(products.map((p) => p.category))];

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const handleOpenQuote = (product) => {
    setActiveProduct(product);
    setQuoteForm({
      name: "",
      phone: "",
      size: product.popular_sizes?.[0] || "",
      notes: "",
    });
    setSubmitStatus(null);
  };

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/api/inquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...quoteForm,
          product_id: activeProduct.id,
        }),
      });
      if (response.ok) {
        setSubmitStatus("Thank you! Our sales team will call you shortly.");
      }
    } catch {
      const msg = encodeURIComponent(
        `Hello JP & Company, I want a price quote for ${activeProduct.title_en} (${activeProduct.title_hi}). Size: ${quoteForm.size}. Name: ${quoteForm.name}, Contact: ${quoteForm.phone}`
      );
      window.open(`https://wa.me/91${PHONE_1}?text=${msg}`, "_blank");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-red-950 text-slate-200 text-xs py-2 px-4 border-b border-red-900">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-2 font-medium text-center sm:text-left">
            <span className="bg-red-700 text-white px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">
              Wholesale & Retail
            </span>
            <span>All types of Tarpaulins, Shed Nets, PVC AC Curtains & Military Tents</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <a href={`tel:${PHONE_1}`} className="flex items-center gap-1 hover:text-amber-400 transition">
              <Phone size={13} className="text-amber-400" /> +91 {PHONE_1}
            </a>
            <span className="text-slate-600">|</span>
            <a href={`tel:${PHONE_2}`} className="flex items-center gap-1 hover:text-amber-400 transition">
              <Phone size={13} className="text-amber-400" /> +91 {PHONE_2}
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER & NAVBAR */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Brand Logo */}
            <div 
              onClick={() => { setActiveTab("catalog"); setSelectedCategory("All"); }}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded-xl flex items-center justify-center shadow-md shadow-red-500/20 text-white font-black text-2xl tracking-tighter border-2 border-red-400/30">
                JP
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 block leading-tight">
                  JP & COMPANY
                </span>
                <span className="text-xs font-bold text-red-600 uppercase tracking-widest block">
                  तिरपाल & प्लास्टिक विशेषज्ञ
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8">
              <button
                onClick={() => setActiveTab("catalog")}
                className={`text-sm font-bold tracking-wide transition pb-1 border-b-2 ${
                  activeTab === "catalog"
                    ? "text-red-700 border-red-700"
                    : "text-slate-600 border-transparent hover:text-red-700"
                }`}
              >
                Products Catalog
              </button>
              <button
                onClick={() => setActiveTab("about")}
                className={`text-sm font-bold tracking-wide transition pb-1 border-b-2 ${
                  activeTab === "about"
                    ? "text-red-700 border-red-700"
                    : "text-slate-600 border-transparent hover:text-red-700"
                }`}
              >
                About & Quality Specs
              </button>
              <button
                onClick={() => setActiveTab("contact")}
                className={`text-sm font-bold tracking-wide transition pb-1 border-b-2 ${
                  activeTab === "contact"
                    ? "text-red-700 border-red-700"
                    : "text-slate-600 border-transparent hover:text-red-700"
                }`}
              >
                Contact & Wholesale
              </button>
            </nav>

            {/* CTA Button Group */}
            <div className="hidden sm:flex items-center gap-3">
              <a
                href={`https://wa.me/91${PHONE_1}?text=${encodeURIComponent("Hello JP & Company, I want to inquire about your products.")}`}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm shadow-emerald-600/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <MessageCircle size={16} /> WhatsApp Quote
              </a>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex md:hidden items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
              >
                {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 shadow-lg">
            <button
              onClick={() => { setActiveTab("catalog"); setMobileMenuOpen(false); }}
              className={`w-full text-left py-2 px-3 rounded-lg text-sm font-bold ${
                activeTab === "catalog" ? "bg-red-50 text-red-700" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              📦 Product Catalog
            </button>
            <button
              onClick={() => { setActiveTab("about"); setMobileMenuOpen(false); }}
              className={`w-full text-left py-2 px-3 rounded-lg text-sm font-bold ${
                activeTab === "about" ? "bg-red-50 text-red-700" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              🏢 About JP & Company
            </button>
            <button
              onClick={() => { setActiveTab("contact"); setMobileMenuOpen(false); }}
              className={`w-full text-left py-2 px-3 rounded-lg text-sm font-bold ${
                activeTab === "contact" ? "bg-red-50 text-red-700" : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              📞 Direct Contact & Store Info
            </button>
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <a
                href={`tel:${PHONE_1}`}
                className="w-full bg-red-700 text-white py-2.5 rounded-lg font-bold text-center text-xs flex justify-center items-center gap-2"
              >
                <Phone size={14} /> Call {PHONE_1}
              </a>
              <a
                href={`https://wa.me/91${PHONE_1}`}
                className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-bold text-center text-xs flex justify-center items-center gap-2"
              >
                <MessageCircle size={14} /> Chat on WhatsApp
              </a>
            </div>
          </div>
        )}
      </header>

      {/* 3. HERO / BANNER SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-900 via-red-800 to-amber-900 text-white py-12 md:py-16 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
        <div className="relative max-w-5xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-2 bg-amber-400/90 text-red-950 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow">
            Direct Wholesaler & Distributor
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight uppercase">
            तिरपाल & प्लास्टिक <br />
            <span className="text-amber-300 font-extrabold normal-case text-2xl sm:text-4xl">
              (Heavy Tarpaulins, Shed Nets & Tents)
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-200 max-w-3xl mx-auto leading-relaxed">
            गार्डन नेट • ए.सी. पर्दा • मच्छरदानी • प्लास्टिक तिरपाल • ट्रक तिरपाल • आर्मी टेंट
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-3">
            <a
              href={`tel:${PHONE_1}`}
              className="bg-amber-400 hover:bg-amber-300 text-red-950 font-black px-6 py-3 rounded-xl shadow-lg transition flex items-center gap-2 text-sm"
            >
              <Phone size={16} /> Call +91 {PHONE_1}
            </a>
            <a
              href={`tel:${PHONE_2}`}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-6 py-3 rounded-xl transition flex items-center gap-2 text-sm backdrop-blur-sm"
            >
              <Phone size={16} /> Call +91 {PHONE_2}
            </a>
          </div>
        </div>
      </section>

      {/* 4. KEY BADGES / TRUST PILLARS */}
      <section className="bg-white border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="p-3 bg-red-100 text-red-700 rounded-lg">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">100% Waterproof</h4>
              <p className="text-[11px] text-slate-500">UV-Proof & Tear Resistant</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="p-3 bg-amber-100 text-amber-700 rounded-lg">
              <Layers size={24} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">All Sizes & GSM</h4>
              <p className="text-[11px] text-slate-500">Standard & Custom Cut</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="p-3 bg-emerald-100 text-emerald-700 rounded-lg">
              <Truck size={24} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">Fast Bulk Supply</h4>
              <p className="text-[11px] text-slate-500">Doorstep & Transport Logistics</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <div className="p-3 bg-blue-100 text-blue-700 rounded-lg">
              <Award size={24} />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">Direct Mill Rates</h4>
              <p className="text-[11px] text-slate-500">Genuine Factory Wholesale</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PRODUCT CATALOG */}
      {activeTab === "catalog" && (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 border-b border-slate-200 pb-6">
            <div>
              <span className="text-xs font-bold text-red-600 uppercase tracking-widest">
                Our Inventory
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Complete Product Catalog
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Select your required category below or click "Get Best Price" for customized sizes.
              </p>
            </div>

            <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`whitespace-nowrap px-4 py-2 rounded-lg text-xs font-bold transition ${
                    selectedCategory === cat
                      ? "bg-red-700 text-white shadow-md shadow-red-700/20"
                      : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative h-64 bg-slate-100 overflow-hidden">
                  <img
                    src={p.image}
                    alt={p.title_en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-red-700 text-white text-xs font-bold px-3 py-1 rounded-md shadow-md uppercase tracking-wider">
                    {p.title_hi}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-slate-900/90 text-amber-300 backdrop-blur-md text-xs font-black px-3 py-1.5 rounded-lg shadow-md">
                    Starting {p.price_per_unit}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {p.category}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-red-700 transition">
                      {p.title_en}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                      {p.description}
                    </p>

                    <div className="mt-4 space-y-1.5">
                      {p.features?.map((f, i) => (
                        <div key={i} className="flex items-center text-xs text-slate-700">
                          <CheckCircle2 size={13} className="text-emerald-600 mr-2 flex-shrink-0" />
                          <span>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <div className="flex flex-wrap gap-1">
                      <span className="text-[11px] font-bold text-slate-500 mr-1 self-center">Sizes:</span>
                      {p.popular_sizes?.slice(0, 3).map((s, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded font-medium">
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenQuote(p)}
                        className="flex-1 bg-red-700 hover:bg-red-800 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider transition shadow-sm text-center"
                      >
                        Get Best Price
                      </button>
                      <a
                        href={`https://wa.me/91${PHONE_1}?text=${encodeURIComponent(`Hi JP & Company, I want to inquire about ${p.title_en} (${p.title_hi}).`)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-xl transition border border-emerald-200"
                        title="Inquire on WhatsApp"
                      >
                        <MessageCircle size={18} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      )}

      {/* ABOUT TAB */}
      {activeTab === "about" && (
        <section className="flex-1 max-w-5xl mx-auto px-4 py-12 w-full space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-red-600 uppercase tracking-widest">Quality Assurance</span>
            <h2 className="text-3xl font-black text-slate-900">About JP & Company</h2>
            <p className="text-slate-600 text-sm max-w-2xl mx-auto">
              Trusted supplier and wholesaler of all heavy-duty waterproof tarpaulins, agro-shade nets, transparent AC curtains, and camping military tents.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <h4 className="font-extrabold text-slate-900 text-base">Industrial Grade GSM</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                From lightweight agro protection nets (50% to 90% shade) to 550+ GSM heavy duty truck tirpals, our products withstand harsh rain, scorching sun, and extreme wind.
              </p>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <h4 className="font-extrabold text-slate-900 text-base">Custom Sizing on Demand</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Whether you need vehicle covers, agricultural shed covers, grain stock coverings, or doorway strip curtains, we fabricate custom sizes with reinforced eyelets.
              </p>
            </div>
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <h4 className="font-extrabold text-slate-900 text-base">Transparent Wholesale Pricing</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct factory-to-buyer supply ensures minimum overheads, quick turnarounds for bulk transporters, contractors, nurseries, and retail customers.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* CONTACT TAB */}
      {activeTab === "contact" && (
        <section className="flex-1 max-w-5xl mx-auto px-4 py-12 w-full space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-red-600 uppercase tracking-widest">Reach Out</span>
            <h2 className="text-3xl font-black text-slate-900">Contact & Place Orders</h2>
            <p className="text-slate-600 text-sm max-xl mx-auto">
              Call us directly or send a message on WhatsApp for instant quote estimations, bulk orders, and sample questions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <h3 className="text-lg font-bold text-slate-900">Direct Phone Lines</h3>
              <div className="space-y-3">
                <a
                  href={`tel:${PHONE_1}`}
                  className="flex items-center justify-between p-4 bg-slate-50 hover:bg-red-50 rounded-xl border border-slate-200 transition group"
                >
                  <div className="flex items-center gap-3">
                    <Phone className="text-red-700" size={20} />
                    <div>
                      <div className="font-bold text-slate-900 text-sm">+91 {PHONE_1}</div>
                      <div className="text-xs text-slate-500">Sales & Inquiries</div>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-400 group-hover:text-red-700" />
                </a>

                <a
                  href={`tel:${PHONE_2}`}
                  className="flex items-center justify-between p-4 bg-slate-50 hover:bg-red-50 rounded-xl border border-slate-200 transition group"
                >
                  <div className="flex items-center gap-3">
                    <Phone className="text-red-700" size={20} />
                    <div>
                      <div className="font-bold text-slate-900 text-sm">+91 {PHONE_2}</div>
                      <div className="text-xs text-slate-500">Wholesale & Logistics</div>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-400 group-hover:text-red-700" />
                </a>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
                <Clock size={15} /> Open Mon - Sun: 8:00 AM - 9:00 PM
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-emerald-700 to-emerald-900 rounded-2xl text-white shadow-lg space-y-4 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest">Instant Chat</span>
                <h3 className="text-xl font-black mt-1">Connect on WhatsApp</h3>
                <p className="text-emerald-100 text-xs mt-2 leading-relaxed">
                  Send your custom sizes (Length × Width in feet or meters) directly on WhatsApp to get instant rate calculations and photo samples.
                </p>
              </div>

              <div className="space-y-2">
                <a
                  href={`https://wa.me/91${PHONE_1}?text=${encodeURIComponent("Hello JP & Company, I want details regarding Tirpal / Nets.")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-white text-emerald-950 font-black py-3 rounded-xl text-center text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-emerald-50 transition"
                >
                  <MessageCircle size={16} /> WhatsApp ({PHONE_1})
                </a>
                <a
                  href={`https://wa.me/91${PHONE_2}?text=${encodeURIComponent("Hello JP & Company, I want details regarding Tirpal / Nets.")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-emerald-800 text-white font-bold py-3 rounded-xl text-center text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-emerald-700 transition"
                >
                  <MessageCircle size={16} /> WhatsApp ({PHONE_2})
                </a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* MODAL */}
      {activeProduct && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setActiveProduct(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X size={20} />
            </button>

            <div className="mb-4">
              <span className="text-xs font-bold text-red-700 uppercase tracking-wider">Quick Inquiry</span>
              <h3 className="text-xl font-black text-slate-900">
                {activeProduct.title_en} ({activeProduct.title_hi})
              </h3>
              <p className="text-xs text-slate-500 mt-1">Get special wholesale and custom-cut rates.</p>
            </div>

            {submitStatus ? (
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm space-y-4">
                <div className="flex items-center gap-2 font-bold">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                  <span>Request Received!</span>
                </div>
                <p className="text-xs text-emerald-700">{submitStatus}</p>
                <button
                  onClick={() => setActiveProduct(null)}
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-lg text-xs"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full name"
                    value={quoteForm.name}
                    onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone / WhatsApp Number</label>
                  <input
                    type="tel"
                    required
                    placeholder="E.g., 9412516083"
                    value={quoteForm.phone}
                    onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Standard Size or Custom</label>
                  <select
                    value={quoteForm.size}
                    onChange={(e) => setQuoteForm({ ...quoteForm, size: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  >
                    {activeProduct.popular_sizes?.map((sz, idx) => (
                      <option key={idx} value={sz}>{sz}</option>
                    ))}
                    <option value="Custom Size">Custom Measurement / Bulk Order</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Requirements / Remarks (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="Tell us about color, GSM, or city for delivery..."
                    value={quoteForm.notes}
                    onChange={(e) => setQuoteForm({ ...quoteForm, notes: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition shadow-md shadow-red-700/20"
                >
                  Send Inquiry Now
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-300 pt-12 pb-24 md:pb-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 bg-red-700 text-white font-black text-sm flex items-center justify-center rounded-lg">
                JP
              </span>
              <span className="font-black text-lg text-white tracking-tight">JP & COMPANY</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Wholesaler and supplier of heavy waterproof plastic tarpaulins, agro-shade nets, transparent cooling PVC curtains, anti-mosquito netting, and camping tents.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold text-sm mb-3">Key Catalog Products</h4>
            <ul className="text-xs space-y-1.5 text-slate-400">
              <li>• गार्डन नेट (Garden Agro Shade Net)</li>
              <li>• ए.सी. पर्दा (Transparent PVC Strip Curtain)</li>
              <li>• मच्छरदानी (Foldable & Hanging Mosquito Net)</li>
              <li>• प्लास्टिक तिरपाल (Waterproof Heavy Tarpaulin)</li>
              <li>• ट्रक तिरपाल (Transport Heavy Duty Tirpal)</li>
              <li>• आर्मी टेंट (Relief & Military Canvas Tent)</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm mb-3">Order Contacts</h4>
            <div className="text-xs space-y-2 text-slate-400">
              <p className="flex items-center gap-2">
                <Phone size={14} className="text-amber-400" /> +91 {PHONE_1}
              </p>
              <p className="flex items-center gap-2">
                <Phone size={14} className="text-amber-400" /> +91 {PHONE_2}
              </p>
              <p className="flex items-center gap-2">
                <MapPin size={14} className="text-amber-400" /> Fast Dispatch & Transport Shipping Available
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} JP & Company (तिरपाल & प्लास्टिक). All rights reserved.
        </div>
      </footer>

      {/* MOBILE BOTTOM STICKY ACTION BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-2.5 z-40 flex gap-2 shadow-2xl">
        <a
          href={`tel:${PHONE_1}`}
          className="flex-1 bg-red-700 hover:bg-red-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow"
        >
          <Phone size={14} /> Call {PHONE_1}
        </a>
        <a
          href={`https://wa.me/91${PHONE_1}?text=${encodeURIComponent("Hello JP & Company, I want to inquire about your products.")}`}
          target="_blank"
          rel="noreferrer"
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow"
        >
          <MessageCircle size={14} /> WhatsApp
        </a>
      </div>
    </div>
  );
}