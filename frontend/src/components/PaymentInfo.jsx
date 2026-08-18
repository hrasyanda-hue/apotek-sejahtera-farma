import React, { useState } from 'react';
import { Copy, Check, Landmark } from 'lucide-react';
import { storeInfo } from '../mock';
import { toast } from '../hooks/use-toast';

export default function PaymentInfo() {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(storeInfo.bank.account);
    setCopied(true);
    toast({ title: 'Nomor rekening disalin', description: storeInfo.bank.account });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="py-10 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Landmark className="text-emerald-600" size={20}/>
            <h3 className="text-lg font-bold text-slate-900">Pembayaran hanya melalui rek bank</h3>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
            <div className="flex items-center gap-4">
              <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-sm">
                <img src={storeInfo.bank.logo} alt={storeInfo.bank.name} className="h-10 w-auto"/>
              </div>
              <div>
                <div className="text-xs text-slate-500">Nomor Rekening</div>
                <div className="text-2xl font-extrabold text-slate-900 tracking-wider">{storeInfo.bank.account}</div>
                <div className="text-sm text-slate-600 mt-1">A/N <span className="font-semibold">{storeInfo.bank.holder}</span></div>
              </div>
            </div>
            <button onClick={copy} className="md:ml-auto inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-colors">
              {copied ? <Check size={16}/> : <Copy size={16}/>} {copied ? 'Tersalin' : 'Salin Nomor'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
