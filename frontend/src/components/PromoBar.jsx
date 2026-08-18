import React from 'react';

export default function PromoBar({ text }) {
  return (
    <div className="bg-emerald-600 text-white text-center text-sm font-semibold py-2 px-4 overflow-hidden">
      <div className="animate-marquee whitespace-nowrap inline-block">
        {text} &nbsp;&nbsp;&nbsp;&nbsp; {text}
      </div>
    </div>
  );
}
