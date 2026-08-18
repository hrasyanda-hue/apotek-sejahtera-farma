import React from 'react';
import { Filter, ArrowUpDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export const CATEGORIES = [
  { key: 'all', label: 'Semua Kategori' },
  { key: 'injeksi', label: 'Obat Injeksi' },
  { key: 'insulin', label: 'Obat Insulin' },
  { key: 'asma', label: 'Obat Asma' },
];

export const SORTS = [
  { key: 'default', label: 'Paling Populer' },
  { key: 'price_asc', label: 'Harga Terendah' },
  { key: 'price_desc', label: 'Harga Tertinggi' },
  { key: 'rating_desc', label: 'Rating Tertinggi' },
  { key: 'discount_desc', label: 'Diskon Terbesar' },
];

export default function FilterBar({ category, onCategoryChange, sort, onSortChange, totalCount }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
        <div className="flex items-center gap-2 text-slate-700">
          <Filter size={18} className="text-emerald-600"/>
          <span className="font-semibold text-sm">Filter Produk</span>
        </div>

        <div className="flex-1 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => onCategoryChange(c.key)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all border ${
                category === c.key
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400 hover:text-emerald-700'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 lg:ml-auto">
          <ArrowUpDown size={16} className="text-slate-500"/>
          <Select value={sort} onValueChange={onSortChange}>
            <SelectTrigger className="w-48"><SelectValue/></SelectTrigger>
            <SelectContent>
              {SORTS.map((s) => (
                <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {typeof totalCount === 'number' && (
        <div className="mt-3 text-xs text-slate-500">
          Menampilkan <span className="font-semibold text-slate-800">{totalCount}</span> produk
        </div>
      )}
    </div>
  );
}
