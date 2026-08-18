import React, { useState } from 'react';
import { Search, ShieldCheck, Truck, Award } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { storeInfo } from '../mock';

export default function Hero({ onSearch }) {
  const [q, setQ] = useState('');

  const submit = (e) => {
    e.preventDefault();
    onSearch && onSearch(q);
  };

  return (
    <section id="home" className="relative bg-gradient-to-b from-emerald-50 to-white overflow-hidden">
      <div className="absolute inset-0 opacity-30 pointer-events-none" style={{backgroundImage:'radial-gradient(circle at 20% 20%, #10b98122, transparent 40%), radial-gradient(circle at 80% 60%, #06b6d422, transparent 45%)'}}/>
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 relative">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold mb-4">
              <ShieldCheck size={14}/> 100% Produk Original
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
              Selamat Datang di <span className="text-emerald-600">{storeInfo.tagline}</span>
            </h1>
            <p className="mt-4 text-slate-600 text-base md:text-lg max-w-lg">
              {storeInfo.description}. Melayani pengiriman seluruh Indonesia dengan harga bersahabat.
            </p>
            <form onSubmit={submit} className="mt-6 flex items-center gap-2 max-w-md bg-white rounded-full shadow-md border border-emerald-100 p-1.5">
              <div className="pl-3 text-slate-400"><Search size={18}/></div>
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari obat..."
                className="flex-1 border-0 focus-visible:ring-0 shadow-none bg-transparent"
              />
              <Button type="submit" className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-5">Cari</Button>
            </form>
            <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
              <div className="flex flex-col items-start gap-1">
                <Award className="text-emerald-600" size={20}/>
                <span className="text-xs text-slate-600 font-medium">Harga Bersahabat</span>
              </div>
              <div className="flex flex-col items-start gap-1">
                <ShieldCheck className="text-emerald-600" size={20}/>
                <span className="text-xs text-slate-600 font-medium">100% Original</span>
              </div>
              <div className="flex flex-col items-start gap-1">
                <Truck className="text-emerald-600" size={20}/>
                <span className="text-xs text-slate-600 font-medium">Kirim Seluruh Indonesia</span>
              </div>
            </div>
          </div>
          <div className="relative min-h-72 md:min-h-96 hidden md:block">
            <div className="absolute -inset-4 bg-gradient-to-br from-emerald-200/40 to-cyan-200/30 blur-2xl rounded-3xl"/>
            <img
              src="https://customer-assets-v7afamib.emergentagent.net/job_wellness-center-87/artifacts/1taw0med_ChatGPT%20Image%2018%20Agu%202026%2C%2021.26.18.png"
              alt="Apotek Mediva - Obat Tepat, Hidup Sehat"
              className="relative w-full h-full object-contain rounded-2xl bg-white p-4 shadow-xl border border-emerald-100"
            />
            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg px-4 py-3 flex items-center gap-3 border border-emerald-100">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <ShieldCheck className="text-emerald-600" size={20}/>
              </div>
              <div>
                <div className="text-sm font-bold text-slate-800">Dijamin Aman</div>
                <div className="text-xs text-slate-500">Pengiriman terjamin</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
