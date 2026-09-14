'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, ArrowUpDown, MessageCircle, Sparkles, ArrowDown } from 'lucide-react';
import { CONTACT_INFO } from '@/lib/constants';
import EventCard from './EventCard';

export default function EventsCatalog({
  events = [],
  loading = false,
  onBookClick,
  onLayoutClick,
  initialSearch = ''
}) {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [visibleCount, setVisibleCount] = useState(8);

  const categories = [
    { id: 'all', label: 'All Garba Events' },
    { id: 'trending', label: '🔥 Trending' },
    { id: 'vip', label: '👑 VIP Lounges' },
    { id: 'sghighway', label: '📍 S.G. Highway' },
    { id: 'sindhubhavan', label: '📍 Sindhu Bhavan' },
    { id: 'budget', label: '💰 Under ₹800' }
  ];

  // Filter and sort logic
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      // 1. Search filter
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const searchable = [
          event.title,
          event.city,
          event.location,
          event.venue,
          event.festival,
          event.badge,
          event.description
        ].filter(Boolean).join(' ').toLowerCase();

        if (!searchable.includes(query)) return false;
      }

      // 2. Category filter
      if (activeCategory === 'trending') {
        if (!event.trending) return false;
      } else if (activeCategory === 'vip') {
        const hasVip = event.dates?.some((d) =>
          d.passes?.some((p) => p.name?.toLowerCase().includes('vip'))
        );
        if (!hasVip && !event.badge?.toLowerCase().includes('vip')) return false;
      } else if (activeCategory === 'sghighway') {
        const loc = (event.location || event.venue || '').toLowerCase();
        if (!loc.includes('s.g') && !loc.includes('sg highway')) return false;
      } else if (activeCategory === 'sindhubhavan') {
        const loc = (event.location || event.venue || '').toLowerCase();
        if (!loc.includes('sindhu') && !loc.includes('bhavan')) return false;
      } else if (activeCategory === 'budget') {
        if ((Number(event.price) || 999) > 800) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') {
        return (Number(a.price) || 0) - (Number(b.price) || 0);
      }
      if (sortBy === 'price_desc') {
        return (Number(b.price) || 0) - (Number(a.price) || 0);
      }
      return (Number(a.order) || 0) - (Number(b.order) || 0);
    });
  }, [events, searchTerm, activeCategory, sortBy]);

  const displayedEvents = filteredEvents.slice(0, visibleCount);
  const hasMore = visibleCount < filteredEvents.length;

  return (
    <div className="space-y-8">
      {/* Controls Bar: Search & Category Filter & Sort */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          {/* Live Search Input */}
          <div className="relative flex-1 max-w-lg">
            <input
              type="text"
              placeholder="Search by ground name, area, singer or festival..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl glass-panel border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-sm"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5 pointer-events-none" />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-amber-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-3 px-4 rounded-xl glass-panel border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-rose-500 cursor-pointer bg-[#0c0d14]"
            >
              <option value="default">Featured Ranking</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setActiveCategory(cat.id);
                setVisibleCount(8);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                activeCategory === cat.id
                  ? 'bg-rose-600 border-rose-500 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)]'
                  : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events Results Count */}
      <div className="flex justify-between items-center text-xs text-gray-400 border-b border-white/5 pb-2">
        <span>Showing {displayedEvents.length} of {filteredEvents.length} available events</span>
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-rose-400 hover:text-rose-300 underline"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="rounded-2xl glass-panel p-4 h-96 animate-pulse space-y-4">
              <div className="h-48 bg-white/5 rounded-xl" />
              <div className="h-4 bg-white/5 rounded w-2/3" />
              <div className="h-3 bg-white/5 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : displayedEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-stretch">
          {displayedEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onBookClick={onBookClick}
              onLayoutClick={onLayoutClick}
            />
          ))}
        </div>
      ) : (
        /* Empty State with Direct WhatsApp Concierge Help (Exact replica feature of RaasFiesta) */
        <div className="py-16 px-6 rounded-3xl glass-panel border border-white/10 text-center max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-600/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-500">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">Couldn't Find That Event</h3>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
            We couldn't find <strong className="text-amber-400">"{searchTerm}"</strong> in our active catalog. It might be coming soon or available via private pass allocation.
          </p>
          <a
            href={CONTACT_INFO.getWhatsAppBookingUrl(`Hi RaasVerse! I was looking for "${searchTerm}" on your website. Can you help me find passes for this event?`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Inquire on WhatsApp</span>
          </a>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && !loading && (
        <div className="text-center pt-8">
          <button
            onClick={() => setVisibleCount((prev) => prev + 4)}
            className="px-8 py-3 rounded-xl glass-panel hover:bg-white/10 border border-white/10 hover:border-rose-500/50 text-sm font-bold text-white transition-all inline-flex items-center gap-2 shadow-lg"
          >
            <span>Load More Experiences</span>
            <ArrowDown className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      )}
    </div>
  );
}
