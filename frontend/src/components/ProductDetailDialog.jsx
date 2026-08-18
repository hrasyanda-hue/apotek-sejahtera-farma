import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { ShoppingBag, ShieldCheck, Package, Tag, MessageSquare } from 'lucide-react';
import { storeInfo } from '../mock';
import { getReviews } from '../reviews';
import StarRating from './StarRating';

const formatRp = (n) => 'Rp ' + n.toLocaleString('id-ID');

export default function ProductDetailDialog({ product, open, onOpenChange }) {
  if (!product) return null;
  const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
  const reviews = getReviews(product.id);
  const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;

  const order = () => {
    const msg = encodeURIComponent(`Halo Apotek Mediva, saya mau order: ${product.name}`);
    window.open(`https://wa.me/${storeInfo.whatsapp}?text=${msg}`, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg text-slate-900 pr-8">{product.name}</DialogTitle>
          <DialogDescription className="sr-only">Detail produk</DialogDescription>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-5 mt-2">
          <div className="relative bg-slate-50 rounded-xl overflow-hidden aspect-square border border-slate-200">
            {discount > 0 && (
              <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow z-10">
                -{discount}%
              </div>
            )}
            <img src={product.image} alt={product.name} className="w-full h-full object-contain p-4"/>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <Tag size={14} className="text-emerald-600"/>
              <span className="text-xs text-emerald-700 font-semibold uppercase tracking-wider">Obat Original</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <StarRating rating={avgRating} size={16}/>
              <span className="text-sm font-semibold text-slate-800">{avgRating.toFixed(1)}</span>
              <span className="text-xs text-slate-500">({reviews.length} ulasan)</span>
            </div>
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-sm text-slate-400 line-through">{formatRp(product.oldPrice)}</span>
              <span className="text-2xl font-extrabold text-emerald-700">{formatRp(product.price)}</span>
            </div>
            <div className="mb-4">
              <h4 className="text-sm font-bold text-slate-800 mb-1.5">Deskripsi Produk</h4>
              <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="flex items-center gap-2 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
                <ShieldCheck size={16} className="text-emerald-600 shrink-0"/>
                <span className="text-xs text-slate-700 font-medium">100% Original</span>
              </div>
              <div className="flex items-center gap-2 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
                <Package size={16} className="text-emerald-600 shrink-0"/>
                <span className="text-xs text-slate-700 font-medium">Kirim Aman</span>
              </div>
            </div>
            <Button onClick={order} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white gap-2 mt-auto">
              <ShoppingBag size={16}/> Pesan Sekarang via WhatsApp
            </Button>
            <p className="text-xs text-slate-500 mt-2 text-center">
              *Obat resep hanya dilayani dengan resep dokter yang sah
            </p>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-6 pt-5 border-t border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare size={18} className="text-emerald-600"/>
            <h4 className="font-bold text-slate-900">Ulasan Pelanggan ({reviews.length})</h4>
          </div>
          <div className="space-y-3">
            {reviews.map((r, i) => (
              <div key={i} className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">
                      {r.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{r.name}</div>
                      <div className="text-xs text-slate-500">{r.date}</div>
                    </div>
                  </div>
                  <StarRating rating={r.rating} size={12}/>
                </div>
                <p className="text-sm text-slate-600 leading-relaxed">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
