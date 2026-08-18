import React from 'react';
import { MapPin, ShieldCheck, Handshake, PackageCheck, Send } from 'lucide-react';
import { storeInfo } from '../mock';

const iconMap = [Handshake, ShieldCheck, PackageCheck, Send];

export default function StoreAddress() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <MapPin size={14}/> Alamat Toko
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900">{storeInfo.address}</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {storeInfo.benefits.map((b, i) => {
            const Icon = iconMap[i] || ShieldCheck;
            return (
              <div key={i} className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-5 text-center hover:shadow-md transition-shadow">
                <div className="w-11 h-11 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-3">
                  <Icon size={20}/>
                </div>
                <p className="text-sm font-semibold text-slate-800">{b}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
