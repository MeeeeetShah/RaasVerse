'use client';

import { useState } from 'react';
import { Calendar, Sparkles, Music, Star, ArrowRight } from 'lucide-react';
import { NAVRATRI_DAYS } from '@/constants';

export default function NavratriPlanner({ onSelectDay }) {
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const activeDay = NAVRATRI_DAYS[activeDayIndex];

  return (
    <section className="py-20 bg-[#090a0f] border-y border-white/5 relative overflow-hidden" id="nine-nights">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center justify-center gap-1.5 mb-2">
            <Sparkles className="w-4 h-4 text-rose-500" /> Exclusive RaasVerse Feature
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Navratri 2026 <span className="text-gradient-red">9-Nights Lineup</span>
          </h2>
          <p className="text-gray-400 text-sm sm:text-base mt-2">
            Plan your outfits, match the traditional color codes, and book passes for your favorite artists and grounds night-by-night.
          </p>
        </div>

        {/* 9-Day Buttons Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none justify-start md:justify-center">
          {NAVRATRI_DAYS.map((item, idx) => {
            const isSelected = activeDayIndex === idx;
            return (
              <button
                key={item.day}
                onClick={() => setActiveDayIndex(idx)}
                className={`px-4 py-3 rounded-2xl shrink-0 text-center transition-all border ${
                  isSelected
                    ? 'bg-rose-600 border-rose-500 text-white shadow-[0_0_20px_rgba(225,29,72,0.4)] scale-105'
                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <span className="block text-[10px] uppercase tracking-wider font-bold opacity-80">Night {item.day}</span>
                <span className="block text-xs font-black mt-0.5 whitespace-nowrap">{item.date.split(' ')[0]} Oct</span>
                <span
                  className="w-2.5 h-2.5 rounded-full mx-auto mt-1.5 block border border-black/40"
                  style={{ backgroundColor: item.colorHex }}
                />
              </button>
            );
          })}
        </div>

        {/* Active Night Detail Card */}
        <div className="mt-8 p-6 sm:p-8 rounded-3xl glass-panel border border-rose-900/30 max-w-4xl mx-auto shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left Col */}
            <div className="md:col-span-8 space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-600/30 text-rose-300 border border-rose-500/40">
                  Night {activeDay.day} of 9
                </span>
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold text-black flex items-center gap-1.5 shadow-sm"
                  style={{ backgroundColor: activeDay.colorHex }}
                >
                  <span>Color Code:</span>
                  <span>{activeDay.color}</span>
                </span>
              </div>

              <h3 className="text-2xl font-black text-white">{activeDay.title}</h3>
              <p className="text-sm text-gray-300 italic">{activeDay.vibes}</p>

              <div className="space-y-1.5 pt-2 text-xs text-gray-300">
                <p className="flex items-center gap-2">
                  <Music className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="font-bold text-white">Featured Performance:</span>
                  <span>{activeDay.artist}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span className="font-bold text-white">Participating Grounds:</span>
                  <span>{activeDay.venues.join(' • ')}</span>
                </p>
              </div>
            </div>

            {/* Right Col: Instant Booking Trigger */}
            <div className="md:col-span-4 flex flex-col items-center md:items-end justify-center pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-white/10 md:pl-6">
              <span className="text-xs text-gray-400 uppercase tracking-widest font-medium">Passes Available</span>
              <span className="text-2xl font-black text-white mt-0.5">From ₹799</span>
              <button
                onClick={() => onSelectDay && onSelectDay(activeDay.date)}
                className="mt-4 w-full sm:w-auto btn-primary-glow px-6 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Book For This Night</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
