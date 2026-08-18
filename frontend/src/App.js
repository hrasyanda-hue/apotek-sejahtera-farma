import React, { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import PromoBar from "./components/PromoBar";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductsShowcase from "./components/ProductsShowcase";
import PaymentInfo from "./components/PaymentInfo";
import ShippingCalculator from "./components/ShippingCalculator";
import StoreAddress from "./components/StoreAddress";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import Testimonials from "./components/Testimonials";
import { promoText } from "./mock";

const Home = () => {
  const [query, setQuery] = useState("");

  return (
    <div className="min-h-screen bg-white">
      <PromoBar text={promoText} />
      <Header />
      <Hero onSearch={setQuery} />
      <ProductsShowcase query={query} />
      <div id="confirm">
        <PaymentInfo />
      </div>
      <ShippingCalculator />
      <Testimonials />
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
