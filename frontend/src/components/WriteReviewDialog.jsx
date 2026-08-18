import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Star, Camera, X as XIcon, Send } from 'lucide-react';
import { toast } from '../hooks/use-toast';
import { addUserReview } from '../userReviews';

const MAX_PHOTO_BYTES = 500 * 1024; // ~500KB after compression

function compressImage(file, maxSize = 800) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        // Iterative quality reduction to fit under limit
        let quality = 0.85;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        while (dataUrl.length * 0.75 > MAX_PHOTO_BYTES && quality > 0.3) {
          quality -= 0.1;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }
        resolve(dataUrl);
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function WriteReviewDialog({ product, open, onOpenChange, onSubmitted }) {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [photo, setPhoto] = useState(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);

  const reset = () => {
    setName(''); setRating(5); setHover(0); setComment(''); setPhoto(null); setBusy(false);
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      toast({ title: 'File tidak valid', description: 'Silakan pilih file gambar.' });
      return;
    }
    try {
      setBusy(true);
      const dataUrl = await compressImage(file);
      setPhoto(dataUrl);
    } catch {
      toast({ title: 'Gagal memuat foto', description: 'Coba foto lain.' });
    } finally {
      setBusy(false);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast({ title: 'Nama wajib diisi' });
      return;
    }
    if (!comment.trim() || comment.trim().length < 5) {
      toast({ title: 'Ulasan terlalu pendek', description: 'Minimal 5 karakter.' });
      return;
    }
    addUserReview(product.id, { name, rating, comment, photo });
    toast({ title: 'Ulasan terkirim', description: 'Terima kasih atas ulasan Anda!' });
    onSubmitted && onSubmitted();
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg text-slate-900">Tulis Ulasan</DialogTitle>
          <DialogDescription className="text-sm text-slate-500 line-clamp-2">
            {product?.name}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4 mt-2">
          <div>
            <Label className="text-slate-700 text-sm">Nama Anda</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Budi Santoso"
              className="mt-1"
              maxLength={40}
            />
          </div>

          <div>
            <Label className="text-slate-700 text-sm">Rating</Label>
            <div className="flex items-center gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((i) => {
                const active = (hover || rating) >= i;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(i)}
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(0)}
                    className="p-1 focus:outline-none"
                    aria-label={`${i} bintang`}
                  >
                    <Star
                      size={26}
                      className={active ? 'text-amber-400' : 'text-slate-300'}
                      fill="currentColor"
                    />
                  </button>
                );
              })}
              <span className="ml-2 text-sm text-slate-600 font-medium">{rating}.0 / 5</span>
            </div>
          </div>

          <div>
            <Label className="text-slate-700 text-sm">Komentar</Label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Bagikan pengalaman Anda dengan produk ini..."
              className="mt-1 min-h-24"
              maxLength={500}
            />
            <div className="text-right text-xs text-slate-400 mt-1">{comment.length}/500</div>
          </div>

          <div>
            <Label className="text-slate-700 text-sm">Foto Produk (opsional)</Label>
            {photo ? (
              <div className="mt-1 relative inline-block">
                <img src={photo} alt="preview" className="w-32 h-32 object-cover rounded-lg border border-slate-200"/>
                <button
                  type="button"
                  onClick={() => setPhoto(null)}
                  className="absolute -top-2 -right-2 bg-slate-900 text-white rounded-full p-1 shadow hover:bg-slate-700"
                  aria-label="Hapus foto"
                >
                  <XIcon size={14}/>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={busy}
                className="mt-1 w-full flex items-center justify-center gap-2 border-2 border-dashed border-slate-300 hover:border-emerald-400 rounded-lg py-4 text-slate-500 hover:text-emerald-600 text-sm transition-colors disabled:opacity-50"
              >
                <Camera size={18}/> {busy ? 'Memproses foto...' : 'Tambah Foto (klik untuk pilih)'}
              </button>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2" disabled={busy}>
              <Send size={16}/> Kirim Ulasan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
