import React, { useState } from 'react';
import { Share2, ShoppingBag, Info } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from '../hooks/use-toast';
import { storeInfo } from '../mock';
import { getReviews } from '../reviews';
import StarRating from './StarRating';
import ProductDetailDialog from './ProductDetailDialog';

const formatRp = (n) => 'Rp ' + n.toLocaleString('id-ID');

export default function ProductCard({ product }) {
  const [open, setOpen] = useState(false);
  const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
  const reviews = getReviews(product.id);
  const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;

  const order = (e) => {
    e.stopPropagation();
    const msg = encodeURIComponent(`Halo Apotek Mediva, saya mau order: ${product.name}`);
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
    <>
      <div
        onClick={() => setOpen(true)}
        className="group bg-white rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
      >
        <div className="relative overflow-hidden bg-slate-50 aspect-square">
          {discount > 0 && (
            <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow">
              -{discount}%
            </div>
          )}
          <div className="absolute top-2 right-2 z-10 bg-white/90 backdrop-blur text-emerald-700 text-xs font-semibold px-2 py-1 rounded-md shadow flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Info size={12}/> Detail
          </div>
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
          <h3 className="text-sm text-slate-700 font-semibold line-clamp-2 min-h-[2.4rem] group-hover:text-emerald-700 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1">
            <StarRating rating={avgRating} size={12}/>
            <span className="text-xs text-slate-500">({reviews.length})</span>
          </div>
          <p className="text-xs text-slate-500 line-clamp-2 mt-1 min-h-[2rem] leading-relaxed">
            {product.description}
          </p>
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
      <ProductDetailDialog product={product} open={open} onOpenChange={setOpen}/>
    </>
  );
}
