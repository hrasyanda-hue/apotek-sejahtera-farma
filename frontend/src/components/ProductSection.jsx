import React, { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import { Button } from './ui/button';
import { ChevronRight } from 'lucide-react';

export default function ProductSection({ title, products, id, initialCount = 8 }) {
  const [showAll, setShowAll] = useState(false);
  const list = useMemo(() => showAll ? products : products.slice(0, initialCount), [showAll, products, initialCount]);

  return (
    <section id={id} className="py-10 md:py-14 bg-slate-50/60">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="h-1 w-14 bg-emerald-500 rounded-full mb-2"/>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h2>
          </div>
          {products.length > initialCount && (
            <button onClick={() => setShowAll(!showAll)} className="text-sm text-emerald-700 font-semibold hover:underline hidden sm:flex items-center gap-1">
              {showAll ? 'Lebih sedikit' : 'Lihat semua'} <ChevronRight size={16}/>
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {list.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
        {products.length > initialCount && (
          <div className="mt-8 flex justify-center">
            <Button variant="outline" className="border-emerald-600 text-emerald-700 hover:bg-emerald-50" onClick={() => setShowAll(!showAll)}>
              {showAll ? 'Sembunyikan' : 'Lihat Lagi'}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
