import React from 'react';
import { Quote, ShieldCheck } from 'lucide-react';
import StarRating from './StarRating';
import { featuredTestimonials, overallStats } from '../reviews';

export default function Testimonials() {
  return (
    <section className="py-14 bg-gradient-to-b from-white to-emerald-50/40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <ShieldCheck size={14}/> Terpercaya Ribuan Pelanggan
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">Apa Kata Pelanggan Kami</h2>
          <div className="mt-3 flex items-center justify-center gap-2">
            <StarRating rating={overallStats.averageRating} size={20}/>
            <span className="text-lg font-bold text-slate-900">{overallStats.averageRating}</span>
            <span className="text-sm text-slate-500">dari {overallStats.totalReviews.toLocaleString('id-ID')} ulasan</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredTestimonials.map((t, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 p-6 relative">
              <Quote className="absolute top-4 right-4 text-emerald-100" size={44}/>
              <div className="flex items-center gap-3 mb-3 relative z-10">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 text-white font-bold flex items-center justify-center shadow">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-slate-900 text-sm">{t.name}</div>
                  <div className="text-xs text-slate-500">{t.location}</div>
                </div>
              </div>
              <StarRating rating={t.rating} size={14} />
              <p className="mt-3 text-sm text-slate-600 leading-relaxed relative z-10">
                &ldquo;{t.comment}&rdquo;
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
          {overallStats.distribution.slice(0, 4).map((d) => (
            <div key={d.stars} className="bg-white border border-slate-200 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <span className="text-lg font-bold text-slate-900">{d.stars}</span>
                <StarRating rating={1} size={14}/>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${d.percent}%` }}/>
              </div>
              <div className="text-xs text-slate-500 mt-1.5">{d.percent}%</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
