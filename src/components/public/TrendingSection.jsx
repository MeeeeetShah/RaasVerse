'use client';

import Link from 'next/link';
import { ArrowRight, Flame } from 'lucide-react';
import EventCard from './EventCard';

export default function TrendingSection({ events = [], loading = false, onBookClick, onLayoutClick }) {
  const trendingEvents = events.filter((e) => e.trending === true);
  const displayEvents = trendingEvents.length > 0 ? trendingEvents : events.slice(0, 4);

  return (
    <section className="py-20 bg-[#07070a] relative overflow-hidden" id="trending">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">
              <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
              <span>Grab Your Passes Now For</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Trending Garba In <span className="text-gradient-red">Ahmedabad</span>
            </h2>
            <p className="text-gray-400 text-sm sm:text-base mt-2 max-w-2xl">
              Experience the grandest folk celebration with authentic verified passes, zero black-market worries, and instant WhatsApp support.
            </p>
          </div>

          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors group"
          >
            <span>View All Ahmedabad Events</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="rounded-2xl glass-panel p-4 h-96 animate-pulse space-y-4">
                <div className="h-48 bg-white/5 rounded-xl" />
                <div className="h-4 bg-white/5 rounded w-2/3" />
                <div className="h-3 bg-white/5 rounded w-1/2" />
                <div className="h-8 bg-white/5 rounded mt-8" />
              </div>
            ))}
          </div>
        ) : (
          /* Events Grid (up to 4 on home trending) */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
            {displayEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onBookClick={onBookClick}
                onLayoutClick={onLayoutClick}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
