import React, { useState, useMemo } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import PromoBar from "./components/PromoBar";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductSection from "./components/ProductSection";
import PaymentInfo from "./components/PaymentInfo";
import ShippingCalculator from "./components/ShippingCalculator";
import StoreAddress from "./components/StoreAddress";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import { promoText, injeksiProducts, insulinProducts, asmaProducts } from "./mock";

const Home = () => {
  const [query, setQuery] = useState("");

  const filterFn = (list) => {
    if (!query.trim()) return list;
    const q = query.toLowerCase();
    return list.filter((p) => p.name.toLowerCase().includes(q));
  };

  const injeksi = useMemo(() => filterFn(injeksiProducts), [query]);
  const insulin = useMemo(() => filterFn(insulinProducts), [query]);
  const asma = useMemo(() => filterFn(asmaProducts), [query]);

  return (
    <div className="min-h-screen bg-white">
      <PromoBar text={promoText} />
      <Header />
      <Hero onSearch={setQuery} />
      <div id="products">
        {injeksi.length > 0 && (
          <ProductSection title="OBAT INJEKSI" products={injeksi} id="injeksi" />
        )}
        {insulin.length > 0 && (
          <ProductSection title="OBAT INSULIN" products={insulin} id="insulin" />
        )}
        {asma.length > 0 && (
          <ProductSection title="OBAT ASMA" products={asma} id="asma" />
        )}
        {injeksi.length === 0 && insulin.length === 0 && asma.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            Tidak ada produk ditemukan untuk &quot;{query}&quot;
          </div>
        )}
      </div>
      <div id="confirm">
        <PaymentInfo />
      </div>
      <ShippingCalculator />
      <StoreAddress />
      <Footer />
      <WhatsAppButton />
      <Toaster />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
