import React, { useState } from 'react';
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { ShoppingBag, Minus, Plus, Loader2, CheckCircle2, Copy, MessageCircle, FileText } from 'lucide-react';
import { toast } from '../hooks/use-toast';
import { storeInfo } from '../mock';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const formatRp = (n) => 'Rp ' + Number(n).toLocaleString('id-ID');

export default function CheckoutDialog({ product, open, onOpenChange }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null); // order object on success

  const reset = () => {
    setName(''); setPhone(''); setAddress(''); setNotes(''); setQty(1); setBusy(false); setResult(null);
  };

  const handleClose = (v) => {
    if (!v) reset();
    onOpenChange(v);
  };

  if (!product) return null;
  const total = product.price * qty;

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 2) {
      toast({ title: 'Nama wajib diisi', description: 'Minimal 2 karakter.' });
      return;
    }
    if (!/^[0-9+\-\s]{6,}$/.test(phone.trim())) {
      toast({ title: 'Nomor telepon tidak valid', description: 'Contoh: 08123456789' });
      return;
    }
    if (!address.trim() || address.trim().length < 5) {
      toast({ title: 'Alamat wajib diisi', description: 'Minimal 5 karakter.' });
      return;
    }
    setBusy(true);
    try {
      const payload = {
        customer_name: name,
        phone,
        address,
        notes,
        items: [{
          product_id: product.id,
          name: product.name,
          price: product.price,
          quantity: qty,
        }],
      };
      const { data } = await axios.post(`${API}/orders`, payload, { timeout: 15000 });
      setResult(data);
      toast({ title: 'Pesanan terkirim', description: `Invoice: ${data.invoice}` });
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || 'Gagal mengirim pesanan';
      toast({ title: 'Gagal membuat pesanan', description: String(msg) });
    } finally {
      setBusy(false);
    }
  };

  const copyInvoice = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.invoice);
    toast({ title: 'Nomor invoice tersalin', description: result.invoice });
  };

  const openWa = () => {
    if (!result) return;
    const lines = [
      `Halo Apotek Mediva, saya mau konfirmasi pesanan:`,
      ``,
      `Invoice: *${result.invoice}*`,
      `Nama: ${result.customer_name}`,
      `HP: ${result.phone}`,
      `Alamat: ${result.address}`,
      ``,
      `Produk:`,
      ...result.items.map((it) => `- ${it.name} x${it.quantity} = ${formatRp(it.price * it.quantity)}`),
      ``,
      `Total: *${formatRp(result.total)}*`,
      result.notes ? `\nCatatan: ${result.notes}` : '',
    ].filter(Boolean).join('\n');
    window.open(`https://wa.me/${storeInfo.whatsapp}?text=${encodeURIComponent(lines)}`, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        {!result ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-lg text-slate-900">Form Pemesanan</DialogTitle>
              <DialogDescription className="text-sm text-slate-500 line-clamp-2">
                {product.name}
              </DialogDescription>
            </DialogHeader>

            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 mt-3 flex items-center gap-3">
              <img src={product.image} alt="" className="w-14 h-14 rounded-md object-contain bg-white border border-slate-200"/>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-slate-800 line-clamp-1">{product.name}</div>
                <div className="text-emerald-700 font-bold text-sm">{formatRp(product.price)}</div>
              </div>
              <div className="flex items-center bg-white border border-slate-200 rounded-lg">
                <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="p-1.5 text-slate-600 hover:text-emerald-600 disabled:opacity-40" disabled={qty <= 1} aria-label="minus"><Minus size={14}/></button>
                <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                <button type="button" onClick={() => setQty(Math.min(99, qty + 1))} className="p-1.5 text-slate-600 hover:text-emerald-600" aria-label="plus"><Plus size={14}/></button>
              </div>
            </div>

            <form onSubmit={submit} className="space-y-4 mt-4">
              <div>
                <Label className="text-slate-700 text-sm">Nama Lengkap *</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama penerima" className="mt-1" maxLength={80}/>
              </div>
              <div>
                <Label className="text-slate-700 text-sm">Nomor WhatsApp / HP *</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08123456789" className="mt-1" maxLength={25}/>
              </div>
              <div>
                <Label className="text-slate-700 text-sm">Alamat Pengiriman *</Label>
                <Textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Alamat lengkap dengan kota dan kode pos" className="mt-1 min-h-20" maxLength={400}/>
              </div>
              <div>
                <Label className="text-slate-700 text-sm">Catatan (opsional)</Label>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Contoh: kirim pagi hari, atau kebutuhan khusus" className="mt-1 min-h-16" maxLength={500}/>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 pt-3">
                <div className="text-sm text-slate-600">Total ({qty} item)</div>
                <div className="text-xl font-extrabold text-emerald-700">{formatRp(total)}</div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => handleClose(false)} disabled={busy}>Batal</Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2" disabled={busy}>
                  {busy ? <Loader2 size={16} className="animate-spin"/> : <ShoppingBag size={16}/>}
                  {busy ? 'Memproses...' : 'Buat Pesanan'}
                </Button>
              </div>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-lg text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="text-emerald-600" size={22}/> Pesanan Berhasil Dibuat
              </DialogTitle>
              <DialogDescription className="sr-only">Nomor invoice pesanan</DialogDescription>
            </DialogHeader>

            <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 rounded-xl p-5 mt-2 text-center">
              <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mb-1">
                <FileText size={14}/> Nomor Invoice
              </div>
              <div className="text-2xl font-extrabold text-slate-900 tracking-wider mb-2">{result.invoice}</div>
              <Button type="button" variant="outline" onClick={copyInvoice} className="gap-2 h-8">
                <Copy size={14}/> Salin Nomor
              </Button>
            </div>

            <div className="mt-4 text-sm space-y-1.5 bg-slate-50 rounded-lg p-4 border border-slate-100">
              <div className="flex justify-between"><span className="text-slate-500">Nama</span><span className="font-semibold text-slate-800">{result.customer_name}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Nomor HP</span><span className="font-semibold text-slate-800">{result.phone}</span></div>
              <div className="flex justify-between gap-3"><span className="text-slate-500 shrink-0">Alamat</span><span className="font-semibold text-slate-800 text-right">{result.address}</span></div>
              <div className="border-t border-slate-200 my-2"/>
              {result.items.map((it, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-slate-600 truncate mr-2">{it.name} x{it.quantity}</span>
                  <span className="font-semibold text-slate-800 shrink-0">{formatRp(it.price * it.quantity)}</span>
                </div>
              ))}
              <div className="border-t border-slate-200 my-2"/>
              <div className="flex justify-between">
                <span className="font-bold text-slate-800">Total</span>
                <span className="font-extrabold text-emerald-700 text-lg">{formatRp(result.total)}</span>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
              Simpan nomor invoice Anda. Silakan konfirmasi pesanan melalui WhatsApp untuk mempercepat proses pengiriman.
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Button type="button" variant="outline" onClick={() => handleClose(false)} className="sm:flex-1">Selesai</Button>
              <Button type="button" onClick={openWa} className="sm:flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                <MessageCircle size={16}/> Konfirmasi via WhatsApp
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
