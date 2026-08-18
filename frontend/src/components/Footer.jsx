import React from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react';
import { storeInfo } from '../mock';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white font-bold">NF</div>
            <div>
              <div className="font-bold text-white">Nabilah Farma</div>
              <div className="text-xs text-slate-400">Toko Obat & Injeksi</div>
            </div>
          </div>
          <p className="text-sm text-slate-400">Kami menjual obat, obat injeksi dan keperluan medis lainnya. Dikirim ke seluruh Indonesia.</p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-3">Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#home" className="hover:text-emerald-400 transition-colors">Home</a></li>
            <li><a href="#blog" className="hover:text-emerald-400 transition-colors">Blog</a></li>
            <li><a href="#products" className="hover:text-emerald-400 transition-colors">Daftar Produk</a></li>
            <li><a href="#confirm" className="hover:text-emerald-400 transition-colors">Konfirmasi Pembayaran</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-3">Social Media</h4>
          <div className="flex items-center gap-2">
            <a href="#" className="w-9 h-9 rounded-full bg-slate-800 hover:bg-emerald-600 flex items-center justify-center transition-colors"><Facebook size={16}/></a>
            <a href="#" className="w-9 h-9 rounded-full bg-slate-800 hover:bg-emerald-600 flex items-center justify-center transition-colors"><Instagram size={16}/></a>
          </div>
          <h4 className="text-white font-bold mt-5 mb-3">Metode Pengiriman</h4>
          <div className="flex items-center gap-3 bg-white/95 rounded-md p-2 w-fit">
            <img src="https://brdsg.com/logo/id/jne.svg" alt="JNE" className="h-6"/>
            <img src="https://brdsg.com/logo/id/jet.svg" alt="J&T" className="h-6"/>
          </div>
        </div>
        <div>
          <h4 className="text-white font-bold mb-3">Alamat</h4>
          <ul className="space-y-2 text-sm text-slate-400">
            <li className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 text-emerald-400"/> {storeInfo.address}</li>
            <li className="flex items-center gap-2"><Phone size={14} className="text-emerald-400"/> <a href={`tel:${storeInfo.phone}`} className="hover:text-emerald-400">{storeInfo.phone}</a></li>
            <li className="flex items-center gap-2"><Mail size={14} className="text-emerald-400"/> <a href={`mailto:${storeInfo.email}`} className="hover:text-emerald-400">{storeInfo.email}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-xs text-slate-500">
          @{year} Apotek Nabilah Injeksi Inc.
        </div>
      </div>
    </footer>
  );
}
