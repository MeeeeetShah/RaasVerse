'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  LogOut,
  Calendar,
  Sparkles,
  MapPin,
  Tag,
  CheckCircle2,
  Flame,
  ShieldCheck
} from 'lucide-react';
import EventFormModal from '@/components/admin/EventFormModal';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchFilter, setSearchFilter] = useState('');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState(null);
  const [eventToDelete, setEventToDelete] = useState(null);

  // Check auth session
  useEffect(() => {
    async function checkAuthAndLoad() {
      try {
        const verifyRes = await fetch('/api/admin/verify');
        const verifyData = await verifyRes.json();

        if (!verifyRes.ok || !verifyData.authenticated) {
          router.push('/admin/login');
          return;
        }

        setAdminUser(verifyData.user);

        // Fetch events
        const eventsRes = await fetch('/api/events');
        if (eventsRes.ok) {
          const eventsData = await eventsRes.json();
          setEvents(eventsData);
        }
      } catch (err) {
        console.error('Error verifying admin session:', err);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    }
    checkAuthAndLoad();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (_) {}
    router.push('/admin/login');
  };

  const handleSaveEvent = (savedEvent) => {
    setEvents((prev) => {
      const exists = prev.some((e) => e.id === savedEvent.id);
      if (exists) {
        return prev.map((e) => (e.id === savedEvent.id ? savedEvent : e));
      }
      return [savedEvent, ...prev];
    });
  };

  const handleDeletedEvent = (deletedId) => {
    setEvents((prev) => prev.filter((e) => e.id !== deletedId));
  };

  const handleToggleTrending = async (event) => {
    try {
      const updatedTrending = !event.trending;
      const res = await fetch(`/api/events/${event.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trending: updatedTrending })
      });
      if (res.ok) {
        const updated = await res.json();
        setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
      }
    } catch (err) {
      console.error('Failed to toggle trending:', err);
    }
  };

  // Filter events
  const filteredEvents = events.filter((e) => {
    if (!searchFilter.trim()) return true;
    const q = searchFilter.toLowerCase();
    return (
      e.title?.toLowerCase().includes(q) ||
      e.location?.toLowerCase().includes(q) ||
      e.venue?.toLowerCase().includes(q)
    );
  });

  // Calculate metrics
  const totalEvents = events.length;
  const trendingCount = events.filter((e) => e.trending).length;
  const totalDates = events.reduce((acc, e) => acc + (e.dates?.length || 0), 0);
  const totalPassTiers = events.reduce(
    (acc, e) =>
      acc +
      (e.dates?.reduce((dAcc, d) => dAcc + (d.passes?.length || 0), 0) || 0),
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07070a] flex items-center justify-center text-gray-400 font-mono text-sm">
        Authenticating Super Admin session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07070a] text-slate-100 selection:bg-rose-600 selection:text-white">
      {/* Top Admin Navigation */}
      <header className="border-b border-white/10 bg-[#090a10]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden p-[2px] bg-gradient-to-tr from-rose-600 to-amber-500 shadow-md">
              <Image
                src="/assets/logo.png"
                alt="RaasVerse Logo"
                width={40}
                height={40}
                className="rounded-full object-cover scale-105"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base text-white tracking-wide">RAASVERSE</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-rose-600/20 text-rose-400 border border-rose-500/30">
                  Super Admin
                </span>
              </div>
              <span className="text-[10px] text-gray-400 font-mono block">Event & Pass CRUD Hub</span>
            </div>
          </div>

          {/* User Email & Logout */}
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-300 hidden sm:inline font-medium">
              {adminUser?.email}
            </span>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-rose-600/20 text-gray-300 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-1">
            <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Active Events</span>
            <p className="text-3xl font-black text-white font-mono">{totalEvents}</p>
            <span className="text-[11px] text-emerald-400">Live in NoSQL Database</span>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-rose-900/30 space-y-1">
            <span className="text-xs text-rose-400 uppercase tracking-wider font-semibold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" /> Trending
            </span>
            <p className="text-3xl font-black text-rose-500 font-mono">{trendingCount}</p>
            <span className="text-[11px] text-gray-400">Featured on Home Page</span>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-amber-900/30 space-y-1">
            <span className="text-xs text-amber-400 uppercase tracking-wider font-semibold">Active Dates</span>
            <p className="text-3xl font-black text-amber-400 font-mono">{totalDates}</p>
            <span className="text-[11px] text-gray-400">Navratri Nights Configured</span>
          </div>

          <div className="p-5 rounded-2xl glass-panel border border-white/10 space-y-1">
            <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Pass Tiers</span>
            <p className="text-3xl font-black text-white font-mono">{totalPassTiers}</p>
            <span className="text-[11px] text-gray-400">GA, VIP & Season Rates</span>
          </div>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
          <div className="relative max-w-sm flex-1">
            <input
              type="text"
              placeholder="Search admin events..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-rose-500"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3 pointer-events-none" />
          </div>

          <button
            onClick={() => {
              setEventToEdit(null);
              setIsFormModalOpen(true);
            }}
            className="btn-primary-glow px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Event</span>
          </button>
        </div>

        {/* Events Table */}
        <div className="rounded-2xl glass-panel border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-black/60 text-gray-400 border-b border-white/10 uppercase tracking-wider font-semibold text-[11px]">
                <tr>
                  <th className="py-3.5 px-4">Event</th>
                  <th className="py-3.5 px-4">Location & Venue</th>
                  <th className="py-3.5 px-4">Dates</th>
                  <th className="py-3.5 px-4">Starting Price</th>
                  <th className="py-3.5 px-4 text-center">Trending</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredEvents.map((ev) => (
                  <tr key={ev.id} className="hover:bg-white/5 transition-colors">
                    {/* Event Banner & Title */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-black/60 shrink-0 border border-white/10">
                          <Image
                            src={ev.image || 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1200&auto=format&fit=crop'}
                            alt={ev.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm line-clamp-1">{ev.title}</h4>
                          <span className="text-[10px] text-amber-400 font-medium">{ev.festival}</span>
                          {ev.badge && (
                            <span className="ml-2 px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                              {ev.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-4 px-4 text-gray-300">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span className="line-clamp-1">{ev.location || ev.venue || ev.city}</span>
                      </div>
                    </td>

                    {/* Dates count */}
                    <td className="py-4 px-4 text-gray-300 font-mono">
                      <span>{ev.dates?.length || 0} Night(s)</span>
                      <span className="block text-[10px] text-gray-500">{ev.dateRange}</span>
                    </td>

                    {/* Starting Price */}
                    <td className="py-4 px-4 font-black text-amber-400 font-mono text-sm">
                      ₹{ev.price}
                    </td>

                    {/* Trending Switch */}
                    <td className="py-4 px-4 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleTrending(ev)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all ${
                          ev.trending
                            ? 'bg-rose-600/30 text-rose-400 border border-rose-500/50 shadow-[0_0_10px_rgba(225,29,72,0.3)]'
                            : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white'
                        }`}
                      >
                        {ev.trending ? '🔥 Active' : 'Off'}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => {
                            setEventToEdit(ev);
                            setIsFormModalOpen(true);
                          }}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors"
                          title="Edit Event"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        {/* View Public Live Card */}
                        <Link
                          href={`/events?search=${encodeURIComponent(ev.title)}`}
                          target="_blank"
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-amber-400 hover:text-amber-300 transition-colors"
                          title="View Live On Public Site"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => setEventToDelete(ev)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-rose-600/20 text-rose-400 hover:text-rose-300 transition-colors"
                          title="Delete Event"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Form Modal (Create / Edit) */}
      <EventFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEventToEdit(null);
        }}
        onSave={handleSaveEvent}
        eventToEdit={eventToEdit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        event={eventToDelete}
        isOpen={Boolean(eventToDelete)}
        onClose={() => setEventToDelete(null)}
        onDeleted={handleDeletedEvent}
      />
    </div>
  );
}
