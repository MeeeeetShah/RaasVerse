'use client';

import Image from 'next/image';
import { Calendar, MapPin, Sparkles, ArrowRight, Map } from 'lucide-react';

export default function EventCard({ event, onBookClick, onLayoutClick }) {
  // Compute lowest price across all dates/passes
  const getLowestPrice = () => {
    if (!event.dates || !Array.isArray(event.dates) || event.dates.length === 0) {
      return event.price || 599;
    }
    const prices = [];
    event.dates.forEach((d) => {
      if (d.passes && Array.isArray(d.passes)) {
        d.passes.forEach((p) => {
          if (p.price) prices.push(Number(p.price));
        });
      }
    });
    if (prices.length > 0) {
      return Math.min(...prices);
    }
    return event.price || 599;
  };

  const lowestPrice = getLowestPrice();

  return (
    <div className="group relative rounded-2xl glass-panel border border-white/10 overflow-hidden flex flex-col justify-between transition-all duration-300 hover:border-rose-500/50 hover:shadow-[0_15px_35px_rgba(225,29,72,0.25)] hover:-translate-y-1.5">
      {/* Image Wrap */}
      <div className="relative h-56 w-full overflow-hidden bg-black/40">
        <Image
          src={event.image || 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1200&auto=format&fit=crop'}
          alt={event.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
        />

        {/* Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0d13] via-black/20 to-transparent" />

        {/* Badge */}
        {event.badge && (
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-rose-600/90 text-white backdrop-blur-md shadow-md border border-rose-400/30">
            {event.badge}
          </span>
        )}

        {/* Venue Layout Map Button (if layout exists) */}
        {event.layoutImage && (
          <button
            onClick={() => onLayoutClick && onLayoutClick(event)}
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-black/60 hover:bg-rose-600 text-gray-200 hover:text-white backdrop-blur-md border border-white/20 transition-all text-xs flex items-center gap-1"
            title="View Venue Map"
          >
            <Map className="w-3.5 h-3.5" />
            <span className="text-[10px] font-semibold hidden sm:inline">Layout</span>
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Festival Tag */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{event.festival || 'Navratri 2026'}</span>
          </div>

          {/* Event Title */}
          <h3 className="text-lg font-bold text-white group-hover:text-rose-400 transition-colors line-clamp-1">
            {event.title}
          </h3>

          {/* Event Info Details */}
          <div className="space-y-1.5 text-xs text-gray-400 pt-1">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span className="truncate">{event.dateRange || '11 Oct - 19 Oct 2026'}</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="truncate">{event.location || event.venue || event.city || 'Ahmedabad, Gujarat'}</span>
            </div>

            {/* Event Features Chips */}
            {event.features && Array.isArray(event.features) && event.features.length > 0 && (
              <div className="flex flex-wrap items-center gap-1 pt-1.5">
                {event.features.slice(0, 2).map((feat, fIdx) => (
                  <span
                    key={fIdx}
                    className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/5 text-gray-300 border border-white/10"
                  >
                    ✨ {feat}
                  </span>
                ))}
                {event.features.length > 2 && (
                  <span className="text-[10px] font-semibold text-rose-400/90 pl-0.5">
                    +{event.features.length - 2} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Price & Book Action Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between mt-auto">
          <div>
            <span className="text-[10px] text-gray-400 uppercase tracking-wider block font-medium">Starts from</span>
            <span className="text-lg font-extrabold text-white">
              ₹{lowestPrice}{' '}
              <span className="text-[11px] text-gray-400 font-normal">/ pass</span>
            </span>
          </div>

          <button
            onClick={() => onBookClick && onBookClick(event)}
            className="btn-primary-glow px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md cursor-pointer"
          >
            <span>Book Passes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
