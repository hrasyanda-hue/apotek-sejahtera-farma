import React, { useState } from 'react';
import { Menu, X, Home, FileText, Package, CreditCard, Phone, Mail } from 'lucide-react';
import { storeInfo } from '../mock';

export default function Header() {
  const [open, setOpen] = useState(false);
  const links = [
    { name: 'Home', icon: Home, href: '#home' },
    { name: 'Blog', icon: FileText, href: '#blog' },
    { name: 'Daftar Produk', icon: Package, href: '#products' },
    { name: 'Konfirmasi Pembayaran', icon: CreditCard, href: '#confirm' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="#home" className="flex items-center gap-2">
          <img
            src={storeInfo.logo}
            alt="Apotek Mediva"
            className="w-12 h-12 rounded-full object-contain bg-white ring-1 ring-slate-200 shadow-sm"
          />
          <div>
            <div className="text-blue-800 font-bold text-lg leading-tight">Apotek Mediva</div>
            <div className="text-xs text-slate-500">Medical Pharmacy</div>
          </div>
        </a>
        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <a key={l.name} href={l.href} className="text-slate-700 hover:text-emerald-600 text-sm font-medium transition-colors flex items-center gap-1.5">
              <l.icon size={16} /> {l.name}
            </a>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-3 text-sm">
          <a href={`tel:${storeInfo.phone}`} className="text-emerald-700 flex items-center gap-1 font-semibold">
            <Phone size={14}/> {storeInfo.phone}
          </a>
        </div>
        <button className="md:hidden p-2 text-slate-700" onClick={() => setOpen(!open)} aria-label="menu">
          {open ? <X size={22}/> : <Menu size={22}/>}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-emerald-100 bg-white">
          <div className="px-4 py-3 flex flex-col gap-3">
            {links.map((l) => (
              <a key={l.name} href={l.href} onClick={() => setOpen(false)} className="text-slate-700 hover:text-emerald-600 text-sm font-medium flex items-center gap-2">
                <l.icon size={16}/> {l.name}
              </a>
            ))}
            <a href={`tel:${storeInfo.phone}`} className="text-emerald-700 flex items-center gap-2 text-sm font-semibold">
              <Phone size={14}/> {storeInfo.phone}
            </a>
            <a href={`mailto:${storeInfo.email}`} className="text-emerald-700 flex items-center gap-2 text-sm">
              <Mail size={14}/> {storeInfo.email}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
