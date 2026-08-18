import React, { useState, useMemo, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { ShoppingBag, ShieldCheck, Package, Tag, MessageSquare, PencilLine, BadgeCheck } from 'lucide-react';
import { storeInfo } from '../mock';
import { getReviews } from '../reviews';
import { getUserReviews } from '../userReviews';
import StarRating from './StarRating';
import WriteReviewDialog from './WriteReviewDialog';

const formatRp = (n) => 'Rp ' + n.toLocaleString('id-ID');

export default function ProductDetailDialog({ product, open, onOpenChange }) {
  const [writeOpen, setWriteOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    if (open) setRefreshKey((k) => k + 1);
  }, [open]);

  const { reviews, avgRating } = useMemo(() => {
    if (!product) return { reviews: [], avgRating: 0 };
    const userReviews = getUserReviews(product.id);
    const mockReviews = getReviews(product.id);
    const combined = [...userReviews, ...mockReviews];
    const avg = combined.reduce((s, r) => s + r.rating, 0) / (combined.length || 1);
    return { reviews: combined, avgRating: avg };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, refreshKey]);

  if (!product) return null;
  const discount = Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);

  const order = () => {
    const msg = encodeURIComponent(`Halo Apotek Mediva, saya mau order: ${product.name}`);
    window.open(`https://wa.me/${storeInfo.whatsapp}?text=${msg}`, '_blank');
  };

  return (
    <>
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
            <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-emerald-600"/>
                <h4 className="font-bold text-slate-900">Ulasan Pelanggan ({reviews.length})</h4>
              </div>
              <Button
                onClick={() => setWriteOpen(true)}
                variant="outline"
                className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 gap-2 h-9"
              >
                <PencilLine size={15}/> Tulis Ulasan
              </Button>
            </div>
            <div className="space-y-3">
              {reviews.map((r, i) => (
                <div key={r.id || i} className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">
                        {r.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900 flex items-center gap-1.5">
                          {r.name}
                          {r.isUser && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                              <BadgeCheck size={10}/> Anda
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500">{r.date}</div>
                      </div>
                    </div>
                    <StarRating rating={r.rating} size={12}/>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{r.comment}</p>
                  {r.photo && (
                    <button
                      type="button"
                      onClick={() => setLightbox(r.photo)}
                      className="mt-2 block"
                    >
                      <img
                        src={r.photo}
                        alt="Foto ulasan"
                        className="w-24 h-24 object-cover rounded-md border border-slate-200 hover:opacity-90 transition-opacity"
                      />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <WriteReviewDialog
        product={product}
        open={writeOpen}
        onOpenChange={setWriteOpen}
        onSubmitted={() => setRefreshKey((k) => k + 1)}
      />

      {/* Simple lightbox for review photos */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setLightbox(null)}
        >
          <img src={lightbox} alt="Foto ulasan besar" className="max-w-full max-h-full rounded-lg shadow-2xl"/>
        </div>
      )}
    </>
  );
}
