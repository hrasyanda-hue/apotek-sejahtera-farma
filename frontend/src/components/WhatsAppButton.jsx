import React from 'react';
import { MessageCircle } from 'lucide-react';
import { storeInfo } from '../mock';

export default function WhatsAppButton() {
  const href = `https://wa.me/${storeInfo.whatsapp}?text=Halo%20Apotek%20Pantek%20saya%20mau%20order%20obat...`;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 group">
      <span className="absolute inset-0 rounded-full bg-emerald-500 opacity-70 animate-ping"/>
      <span className="relative flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-full shadow-lg font-semibold transition-colors">
        <MessageCircle size={20}/> <span className="hidden sm:inline">Pesan via WhatsApp</span>
      </span>
    </a>
  );
}
