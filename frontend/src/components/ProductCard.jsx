import React from 'react';
import { Share2, ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from '../hooks/use-toast';
import { storeInfo } from '../mock';

const formatRp = (n) => 'Rp ' + n.toLocaleString('id-ID');

export default function ProductCard({ product }) {
  const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);

  const order = () => {
    const msg = encodeURIComponent(`Halo Apotek Nabilah Farma, saya mau order: ${product.name}`);
    window.open(`https://wa.me/${storeInfo.whatsapp}?text=${msg}`, '_blank');
  };

  const share = async (e) => {
    e.stopPropagation();
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: product.name, url }); } catch (_) { /* ignore */ }
    } else {
      navigator.clipboard?.writeText(url);
      toast({ title: 'Link disalin', description: 'Link produk berhasil disalin.' });
    }
  };

  return (
    <div className="group bg-white rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
      <div className="relative overflow-hidden bg-slate-50 aspect-square">
        {discount > 0 && (
          <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow">
            -{discount}%
          </div>
        )}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-3 flex flex-col flex-1">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-xs text-slate-400 line-through">{formatRp(product.oldPrice)}</span>
        </div>
        <div className="text-emerald-700 font-extrabold text-lg leading-tight mb-2">{formatRp(product.price)}</div>
        <h3 className="text-sm text-slate-700 font-medium line-clamp-3 min-h-[3.6rem] hover:text-emerald-700 transition-colors cursor-pointer">
          {product.name}
        </h3>
        <div className="mt-3 flex items-center gap-2">
          <Button onClick={order} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5">
            <ShoppingBag size={16}/> Pesan Sekarang
          </Button>
          <button onClick={share} className="p-2 rounded-md border border-slate-200 hover:bg-slate-50 text-slate-600" aria-label="share">
            <Share2 size={16}/>
          </button>
        </div>
      </div>
    </div>
  );
}
