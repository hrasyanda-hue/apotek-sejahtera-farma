import React, { useState } from 'react';
import { Truck, Calculator } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { provinces, cities, districts, shippingRates } from '../mock';

export default function ShippingCalculator() {
  const [province, setProvince] = useState('DKI Jakarta');
  const [city, setCity] = useState('Jakarta Pusat');
  const [district, setDistrict] = useState('Jakarta Pusat');
  const [weight, setWeight] = useState('1');
  const [result, setResult] = useState(null);

  const submit = (e) => {
    e.preventDefault();
    const w = parseFloat(weight) || 1;
    const rows = shippingRates.map(r => ({ ...r, price: Math.round(r.price * Math.max(1, w)) }));
    setResult({ destination: `${district} (${w} kg)`, rows });
  };
  const reset = () => { setResult(null); };

  return (
    <section className="py-10 md:py-14 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <Truck className="text-emerald-600" size={22}/>
            <h3 className="text-xl font-bold text-slate-900">Cek Ongkos Kirim</h3>
          </div>
          <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-700">Provinsi</Label>
              <Select value={province} onValueChange={setProvince}>
                <SelectTrigger className="mt-1"><SelectValue/></SelectTrigger>
                <SelectContent className="max-h-72">
                  {provinces.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-slate-700">Kota/Kabupaten</Label>
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger className="mt-1"><SelectValue/></SelectTrigger>
                <SelectContent>
                  {cities.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-slate-700">Kecamatan</Label>
              <Select value={district} onValueChange={setDistrict}>
                <SelectTrigger className="mt-1"><SelectValue/></SelectTrigger>
                <SelectContent>
                  {districts.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-slate-700">Berat (kg)</Label>
              <Input type="number" min="1" step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} className="mt-1"/>
            </div>
            <div className="md:col-span-2 flex gap-3 mt-2">
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                <Calculator size={16}/> Cek Ongkir
              </Button>
              <Button type="button" variant="outline" onClick={reset}>Batal</Button>
            </div>
          </form>

          {result && (
            <div className="mt-6 border-t border-slate-200 pt-6">
              <div className="text-sm text-slate-600 mb-3">Tujuan: <span className="font-semibold text-slate-900">{result.destination}</span></div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-emerald-50 text-emerald-800">
                      <th className="text-left p-3 rounded-l-md">Kurir</th>
                      <th className="text-left p-3">Layanan</th>
                      <th className="text-left p-3">Harga</th>
                      <th className="text-left p-3 rounded-r-md">Estimasi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((r, i) => (
                      <tr key={i} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="p-3 font-semibold text-slate-800">{r.courier}</td>
                        <td className="p-3 text-slate-600">{r.service}</td>
                        <td className="p-3 font-bold text-emerald-700">Rp {r.price.toLocaleString('id-ID')}</td>
                        <td className="p-3 text-slate-600">{r.estimate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
