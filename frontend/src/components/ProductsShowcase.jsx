import React, { useState, useMemo } from 'react';
import FilterBar from './FilterBar';
import ProductCard from './ProductCard';
import { Button } from './ui/button';
import { injeksiProducts, insulinProducts, asmaProducts } from '../mock';
import { getReviews } from '../reviews';
import { getUserReviews } from '../userReviews';
import { PackageSearch } from 'lucide-react';

const CATEGORY_MAP = {
  all: null,
  injeksi: 'OBAT INJEKSI',
  insulin: 'OBAT INSULIN',
  asma: 'OBAT ASMA',
};

function annotateCategory(list, category) {
  return list.map((p) => ({ ...p, category }));
}

function avgRating(id) {
  const list = [...getUserReviews(id), ...getReviews(id)];
  return list.reduce((s, r) => s + r.rating, 0) / (list.length || 1);
}

export default function ProductsShowcase({ query }) {
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('default');
  const [showAll, setShowAll] = useState(false);

  const allProducts = useMemo(() => ([
    ...annotateCategory(injeksiProducts, 'injeksi'),
    ...annotateCategory(insulinProducts, 'insulin'),
    ...annotateCategory(asmaProducts, 'asma'),
  ]), []);

  const filtered = useMemo(() => {
    let list = allProducts;
    if (category !== 'all') list = list.filter((p) => p.category === category);
    if (query && query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }
    switch (sort) {
      case 'price_asc':
        list = [...list].sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        list = [...list].sort((a, b) => b.price - a.price);
        break;
      case 'rating_desc':
        list = [...list].sort((a, b) => avgRating(b.id) - avgRating(a.id));
        break;
      case 'discount_desc':
        list = [...list].sort((a, b) => ((b.oldPrice - b.price) / b.oldPrice) - ((a.oldPrice - a.price) / a.oldPrice));
        break;
      default:
        break;
    }
    return list;
  }, [allProducts, category, query, sort]);

  const isFiltered = category !== 'all' || sort !== 'default' || (query && query.trim());
  const INITIAL = 12;
  const visible = showAll ? filtered : filtered.slice(0, INITIAL);

  // When default and no query, show sectioned by category to preserve original layout feel
  const grouped = useMemo(() => ({
    injeksi: filtered.filter((p) => p.category === 'injeksi'),
    insulin: filtered.filter((p) => p.category === 'insulin'),
    asma: filtered.filter((p) => p.category === 'asma'),
  }), [filtered]);

  return (
    <section id="products" className="py-10 md:py-14 bg-slate-50/60">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          <FilterBar
            category={category}
            onCategoryChange={(c) => { setCategory(c); setShowAll(false); }}
            sort={sort}
            onSortChange={(s) => { setSort(s); setShowAll(false); }}
            totalCount={filtered.length}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 py-16 text-center">
            <PackageSearch className="mx-auto text-slate-300 mb-3" size={48}/>
            <div className="text-slate-700 font-semibold">Produk tidak ditemukan</div>
            <div className="text-sm text-slate-500 mt-1">Coba ubah kata kunci pencarian atau filter</div>
          </div>
        ) : isFiltered ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {visible.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
            {filtered.length > INITIAL && (
              <div className="mt-8 flex justify-center">
                <Button variant="outline" className="border-emerald-600 text-emerald-700 hover:bg-emerald-50" onClick={() => setShowAll(!showAll)}>
                  {showAll ? 'Sembunyikan' : `Lihat ${filtered.length - INITIAL} Produk Lainnya`}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-10">
            {[
              { key: 'injeksi', title: 'OBAT INJEKSI', list: grouped.injeksi },
              { key: 'insulin', title: 'OBAT INSULIN', list: grouped.insulin },
              { key: 'asma', title: 'OBAT ASMA', list: grouped.asma },
            ].map((sec) => (
              sec.list.length === 0 ? null : (
                <div key={sec.key}>
                  <div className="flex items-end justify-between mb-5">
                    <div>
                      <div className="h-1 w-14 bg-emerald-500 rounded-full mb-2"/>
                      <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">{sec.title}</h2>
                    </div>
                    <button onClick={() => setCategory(sec.key)} className="text-sm text-emerald-700 font-semibold hover:underline hidden sm:inline">
                      Lihat semua →
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                    {sec.list.slice(0, 8).map((p) => <ProductCard key={p.id} product={p} />)}
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
