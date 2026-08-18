import React from 'react';
import { Star } from 'lucide-react';

export default function StarRating({ rating = 0, size = 14, showValue = false, className = '' }) {
  const rounded = Math.round(rating * 2) / 2;
  return (
    <div className={`inline-flex items-center gap-0.5 ${className}`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= Math.floor(rounded);
        const half = !filled && i - 0.5 === rounded;
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star size={size} className="text-slate-300" fill="currentColor" />
            {(filled || half) && (
              <span className="absolute inset-0 overflow-hidden" style={{ width: half ? '50%' : '100%' }}>
                <Star size={size} className="text-amber-400" fill="currentColor" />
              </span>
            )}
          </span>
        );
      })}
      {showValue && (
        <span className="ml-1 text-xs font-semibold text-slate-700">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
